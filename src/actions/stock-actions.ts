// @/actions/stock-actions.ts
"use server";

import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, stockCarHistory, stockCars, users } from "@/db";
import { isSalesRole, normaliseRole } from "@/lib/lead-routing";
import {
  compareStockCars,
  diffStockCar,
  memberCodeFor,
  STOCK_ADMIN_PATH,
  STOCK_HISTORY_PATH,
  STOCK_PUBLIC_PATH,
  type StockAction,
  type StockCarFields,
  type StockCarInput,
  type StockCarView,
  type StockChange,
  type StockErrors,
  type StockHistoryEntry,
  stockFields,
  validateStockCar,
} from "@/lib/stock";
import { auth } from "@/utils/auth";

export interface StockActor {
  id: string;
  name: string;
  memberCode: string;
  isAdmin: boolean;
}

export type StockResult =
  | { success: true; car: StockCarView }
  | { success: false; error: string; errors?: StockErrors };

type StockRow = typeof stockCars.$inferSelect;

/**
 * The signed-in user, if they may keep a stock list: anyone in a sales
 * position, staff and admins, and not banned. Read from the user row rather
 * than the session so a role change applies at once. Admins see and edit every
 * list and read the history; everyone else works on their own cars only.
 */
export async function getStockActor(): Promise<StockActor | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!user || user.isBanned) return null;

  const role = normaliseRole(user.role);
  const isAdmin = role === "admin";
  if (!isAdmin && role !== "staff" && !isSalesRole(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    memberCode: memberCodeFor(user),
    isAdmin,
  };
}

function toView(row: StockRow): StockCarView {
  return {
    id: row.id,
    ...stockFields(row as unknown as StockCarFields),
    memberCode: row.memberCode,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    isRemoved: row.isRemoved,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function revalidateStock() {
  revalidatePath(STOCK_ADMIN_PATH);
  revalidatePath(STOCK_HISTORY_PATH);
  revalidatePath(STOCK_PUBLIC_PATH);
}

/** Admins get every car; everyone else gets the cars they added. */
export async function getMyStock(): Promise<StockCarView[]> {
  const actor = await getStockActor();
  if (!actor) return [];

  const rows = await db
    .select()
    .from(stockCars)
    .where(actor.isAdmin ? undefined : eq(stockCars.ownerId, actor.id))
    .orderBy(desc(stockCars.updatedAt));
  return rows.map(toView);
}

/** The car, if this actor may change it. */
async function editableCar(actor: StockActor, id: string) {
  const [row] = await db
    .select()
    .from(stockCars)
    .where(
      actor.isAdmin
        ? eq(stockCars.id, id)
        : and(eq(stockCars.id, id), eq(stockCars.ownerId, actor.id)),
    )
    .limit(1);
  return row ?? null;
}

function historyRow(
  actor: StockActor,
  carId: string,
  action: StockAction,
  changes: StockChange[],
  snapshot: StockCarFields,
  memberCode: string,
) {
  return {
    id: crypto.randomUUID(),
    carId,
    action,
    changes,
    snapshot: { ...snapshot, memberCode },
    actorId: actor.id,
    actorName: actor.name,
    memberCode: actor.memberCode,
  };
}

export async function createStockCar(
  input: StockCarInput,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const checked = validateStockCar(input);
    if (!checked.ok) {
      return {
        success: false,
        error: "Check the highlighted fields",
        errors: checked.errors,
      };
    }

    const id = crypto.randomUUID();
    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(stockCars)
        .values({
          id,
          ...checked.value,
          memberCode: actor.memberCode,
          ownerId: actor.id,
          ownerName: actor.name,
        })
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(actor, id, "created", [], checked.value, actor.memberCode),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(created) };
  } catch (error) {
    console.error("Stock create error:", error);
    return { success: false, error: "Could not save the car" };
  }
}

export async function updateStockCar(
  id: string,
  input: StockCarInput,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const current = await editableCar(actor, id);
    if (!current) return { success: false, error: "Car not found" };

    const checked = validateStockCar(input);
    if (!checked.ok) {
      return {
        success: false,
        error: "Check the highlighted fields",
        errors: checked.errors,
      };
    }

    const changes = diffStockCar(
      stockFields(current as unknown as StockCarFields),
      checked.value,
    );
    if (changes.length === 0) return { success: true, car: toView(current) };

    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(stockCars)
        .set({ ...checked.value, updatedAt: new Date() })
        .where(eq(stockCars.id, id))
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(
            actor,
            id,
            "updated",
            changes,
            checked.value,
            current.memberCode,
          ),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(updated) };
  } catch (error) {
    console.error("Stock update error:", error);
    return { success: false, error: "Could not save the car" };
  }
}

/** Takes a car off both lists (removed = true) or puts it back. */
export async function setStockCarRemoved(
  id: string,
  removed: boolean,
): Promise<StockResult> {
  try {
    const actor = await getStockActor();
    if (!actor) return { success: false, error: "Not allowed" };

    const current = await editableCar(actor, id);
    if (!current) return { success: false, error: "Car not found" };
    if (current.isRemoved === removed) {
      return { success: true, car: toView(current) };
    }

    const updated = await db.transaction(async (tx) => {
      const now = new Date();
      const [row] = await tx
        .update(stockCars)
        .set({
          isRemoved: removed,
          removedAt: removed ? now : null,
          updatedAt: now,
        })
        .where(eq(stockCars.id, id))
        .returning();
      await tx
        .insert(stockCarHistory)
        .values(
          historyRow(
            actor,
            id,
            removed ? "removed" : "restored",
            [],
            stockFields(current as unknown as StockCarFields),
            current.memberCode,
          ),
        );
      return row;
    });

    revalidateStock();
    return { success: true, car: toView(updated) };
  } catch (error) {
    console.error("Stock remove error:", error);
    return { success: false, error: "Could not update the car" };
  }
}

/** Every change to every car, newest first. Admins only. */
export async function getStockHistory(
  limit = 1000,
): Promise<StockHistoryEntry[]> {
  const actor = await getStockActor();
  if (!actor?.isAdmin) return [];

  const rows = await db
    .select()
    .from(stockCarHistory)
    .orderBy(desc(stockCarHistory.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    carId: row.carId,
    action: row.action as StockAction,
    changes: (row.changes as StockChange[]) ?? [],
    snapshot: (row.snapshot as StockHistoryEntry["snapshot"]) ?? {},
    actorName: row.actorName,
    memberCode: row.memberCode,
    createdAt: row.createdAt.toISOString(),
  }));
}

/**
 * Every live car from every salesperson — the public list. Only the eight
 * fields and the member code leave the server; who owns the row does not.
 */
export async function getPublicStock(): Promise<
  (StockCarFields & { id: string; memberCode: string; updatedAt: string })[]
> {
  const rows = await db
    .select()
    .from(stockCars)
    .where(eq(stockCars.isRemoved, false));

  return rows
    .map((row) => ({
      id: row.id,
      ...stockFields(row as unknown as StockCarFields),
      memberCode: row.memberCode,
      updatedAt: row.updatedAt.toISOString(),
    }))
    .sort(compareStockCars);
}
