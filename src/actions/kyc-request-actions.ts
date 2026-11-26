// @/actions/kyc-request-actions.ts
"use server";

// Sales Confirmed from the KYC side of the admin (business instruction
// 2026-11-23). On a lead it is the "Sales Confirmed" sales status (see
// updateRequestStatus); here it starts from a KYC record or from nothing:
//
// - From a KYC record: with a lead linked, or one found and linked now, the
//   lead moves to Sales Confirmed (status, Purchase upload, the email). With
//   no lead — the admin's choice — only the email goes, its link reopening
//   that record pre-filled.
// - From the KYC list: with a lead found, the same as above; without one, a
//   new personal link to the name and email entered.
//
// Every action is staff-only (kycStaff).

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, kycSubmissions, requests } from "@/db";
import { KYC_ADMIN_PATH, kycReference } from "@/lib/kyc";
import { kycStaff } from "@/lib/kyc-access";
import { latestKycForLead, sendKycRequest } from "@/lib/kyc-request";
import {
  isSalesConfirmedStatus,
  SALES_CONFIRMED_STATUS,
} from "@/lib/leadConversion";
import { updateRequestStatus } from "./admin-actions";

export type ConfirmSaleResult =
  | {
      ok: true;
      email: string | null;
      emailed: boolean;
      link: string | null;
      prefilled: boolean;
      /** The lead it was confirmed on, when there is one. */
      leadName: string | null;
    }
  | { ok: false; message: string };

const NO_ACCESS = {
  ok: false as const,
  message: "You don't have access to KYC records.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function loadLead(id: string) {
  const [lead] = await db
    .select()
    .from(requests)
    .where(eq(requests.id, id))
    .limit(1);
  return lead && !lead.isDraft ? lead : null;
}

/**
 * Confirms the sale on a lead. A lead not yet Sales Confirmed moves there
 * (which sends the email); one already there gets a fresh link instead, so
 * pressing the button again is how a link is resent.
 */
async function confirmOnLead(
  leadId: string,
  kycSubmissionId: string | null,
  note: string,
  staff: { id: string; name: string },
): Promise<ConfirmSaleResult> {
  const lead = await loadLead(leadId);
  if (!lead) return { ok: false, message: "That lead no longer exists." };

  if (!isSalesConfirmedStatus(lead.leadStatus)) {
    const result = await updateRequestStatus(
      lead.id,
      lead.status,
      { leadStatus: SALES_CONFIRMED_STATUS, salesComment: note },
      { kycSubmissionId },
    );
    const sc = result.salesConfirmed;
    return {
      ok: true,
      email: sc?.email ?? lead.email ?? null,
      emailed: sc?.emailed ?? false,
      link: sc?.link ?? null,
      prefilled: sc?.prefilled ?? false,
      leadName: lead.name,
    };
  }

  if (!lead.email) {
    return { ok: false, message: "That lead has no email address." };
  }
  const sent = await sendKycRequest({
    requestId: lead.id,
    kycSubmissionId: kycSubmissionId ?? (await latestKycForLead(lead.id)),
    customerName: lead.name,
    customerEmail: lead.email,
    vehicle: [lead.make, lead.vehicleModel].filter(Boolean).join(" ") || null,
    consultantId: lead.assignedToId,
    staff,
  });
  return { ok: true, ...sent, leadName: lead.name };
}

/**
 * Sales Confirmed on a KYC record. `leadId` links that lead first when the
 * record has none; `leadId: null` confirms without a lead.
 */
export async function confirmSaleFromKyc(
  kycId: string,
  choice: { leadId: string | null },
): Promise<ConfirmSaleResult> {
  const staff = await kycStaff();
  if (!staff) return NO_ACCESS;
  const [kyc] = await db
    .select()
    .from(kycSubmissions)
    .where(eq(kycSubmissions.id, kycId))
    .limit(1);
  if (!kyc) return { ok: false, message: "That KYC record no longer exists." };

  let leadId = kyc.requestId;
  if (!leadId && typeof choice?.leadId === "string" && choice.leadId) {
    const lead = await loadLead(choice.leadId);
    if (!lead) return { ok: false, message: "That lead no longer exists." };
    leadId = lead.id;
    await db
      .update(kycSubmissions)
      .set({
        requestId: lead.id,
        // An unassigned record follows the lead's consultant.
        ...(!kyc.assignedToId && lead.assignedToId
          ? {
              assignedToId: lead.assignedToId,
              assignedToName: lead.assignedToName,
              assignmentMethod: "lead",
            }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(kycSubmissions.id, kyc.id));
  }

  let result: ConfirmSaleResult;
  if (leadId) {
    result = await confirmOnLead(
      leadId,
      kyc.id,
      `Sales Confirmed from KYC ${kycReference(kyc.id)}.`,
      staff,
    );
  } else {
    const sent = await sendKycRequest({
      kycSubmissionId: kyc.id,
      customerName: kyc.fullName,
      customerEmail: kyc.email,
      consultantId: kyc.assignedToId,
      staff,
    });
    result = { ok: true, ...sent, leadName: null };
  }

  revalidatePath(KYC_ADMIN_PATH);
  revalidatePath(`${KYC_ADMIN_PATH}/${kyc.id}`);
  return result;
}

/** Sales Confirmed from the KYC list: a lead, or just a name and email. */
export async function confirmSaleNew(
  choice: { leadId: string } | { name: string; email: string },
): Promise<ConfirmSaleResult> {
  const staff = await kycStaff();
  if (!staff) return NO_ACCESS;

  if ("leadId" in choice && typeof choice.leadId === "string") {
    const result = await confirmOnLead(
      choice.leadId,
      null,
      "Sales Confirmed from Client KYC.",
      staff,
    );
    revalidatePath(KYC_ADMIN_PATH);
    return result;
  }

  const name =
    "name" in choice
      ? String(choice.name ?? "")
          .trim()
          .slice(0, 160)
      : "";
  const email =
    "email" in choice
      ? String(choice.email ?? "")
          .trim()
          .toLowerCase()
          .slice(0, 254)
      : "";
  if (!name) return { ok: false, message: "Enter the customer's name." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }
  const sent = await sendKycRequest({
    customerName: name,
    customerEmail: email,
    staff,
  });
  revalidatePath(KYC_ADMIN_PATH);
  return { ok: true, ...sent, leadName: null };
}
