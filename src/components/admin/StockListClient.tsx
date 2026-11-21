"use client";

import {
  Check,
  Copy,
  FileSpreadsheet,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createStockCar,
  type StockMember,
  type StockSheetView,
  setStockCarRemoved,
  updateStockCar,
} from "@/actions/stock-actions";
import {
  compareStockCars,
  formatFob,
  MIN_YEAR,
  maxYear,
  STOCK_CURRENCIES,
  STOCK_STEERING,
  type StockCarInput,
  type StockCarView,
  type StockErrors,
  validateStockCar,
} from "@/lib/stock";
import { CAR_MAKES } from "@/lib/vehicle-inquiry";
import LinkedSheets from "./LinkedSheets";
import StockImport from "./StockImport";

const EMPTY: StockCarInput = {
  make: "",
  model: "",
  year: "",
  color: "",
  engine: "",
  steering: "RHD",
  fobPrice: "",
  fobCurrency: "USD",
  shippingPort: "",
};

const inputClass =
  "h-10 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

function toInput(car: StockCarView): StockCarInput {
  return {
    make: car.make,
    model: car.model,
    year: String(car.year),
    color: car.color,
    engine: car.engine,
    steering: car.steering,
    fobPrice: String(car.fobPrice),
    fobCurrency: car.fobCurrency,
    shippingPort: car.shippingPort,
  };
}

export default function StockListClient({
  initialCars,
  isAdmin,
  memberCode,
  publicLink,
  actorId,
  initialSheets,
  stockMembers,
}: {
  initialCars: StockCarView[];
  isAdmin: boolean;
  memberCode: string;
  publicLink: string;
  actorId: string;
  initialSheets: StockSheetView[];
  stockMembers: StockMember[];
}) {
  const [cars, setCars] = useState(initialCars);
  const [sheets, setSheets] = useState(initialSheets);
  const sheetUrl = useMemo(
    () => new Map(sheets.map((s) => [s.id, s.sheetUrl])),
    [sheets],
  );
  const [form, setForm] = useState<StockCarInput>(EMPTY);
  const [errors, setErrors] = useState<StockErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"live" | "removed">("live");
  const [member, setMember] = useState("all");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const members = useMemo(
    () => [...new Set(cars.map((c) => c.memberCode))].sort(),
    [cars],
  );
  const ports = useMemo(
    () => [...new Set(cars.map((c) => c.shippingPort))].sort(),
    [cars],
  );

  const shown = useMemo(
    () =>
      cars
        .filter((c) => (view === "live" ? !c.isRemoved : c.isRemoved))
        .filter((c) => member === "all" || c.memberCode === member)
        .sort(compareStockCars),
    [cars, view, member],
  );
  const liveCount = cars.filter((c) => !c.isRemoved).length;
  const removedCount = cars.length - liveCount;

  const set = (field: keyof StockCarInput, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field as keyof StockErrors]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const replace = (car: StockCarView) =>
    setCars((list) => {
      const rest = list.filter((c) => c.id !== car.id);
      return [car, ...rest];
    });

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setEditingId(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const checked = validateStockCar(form);
    if (!checked.ok) {
      setErrors(checked.errors);
      return;
    }
    startTransition(async () => {
      const result = editingId
        ? await updateStockCar(editingId, form)
        : await createStockCar(form);
      if (!result.success) {
        if (result.errors) setErrors(result.errors);
        toast.error(result.error);
        return;
      }
      replace(result.car);
      toast.success(editingId ? "Car updated" : "Car added");
      // Keep the shared fields for the next car: a salesperson usually adds
      // several from the same port, in the same currency.
      setForm({
        ...EMPTY,
        fobCurrency: form.fobCurrency,
        shippingPort: form.shippingPort,
        steering: form.steering,
      });
      setErrors({});
      setEditingId(null);
    });
  };

  const startEdit = (car: StockCarView) => {
    setEditingId(car.id);
    setForm(toInput(car));
    setErrors({});
    formRef.current?.scrollIntoView({ block: "start" });
  };

  const toggleRemoved = (car: StockCarView) => {
    const removing = !car.isRemoved;
    if (
      removing &&
      !window.confirm(
        `Remove the ${car.year} ${car.make} ${car.model} from the list?`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await setStockCarRemoved(car.id, removing);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      replace(result.car);
      if (editingId === car.id) reset();
      toast.success(removing ? "Removed from the list" : "Back on the list");
    });
  };

  const field = (
    name: keyof StockCarInput,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const error = errors[name as keyof StockErrors];
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-zinc-600">
          {label}
        </span>
        <input
          {...props}
          value={String(form[name])}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={Boolean(error)}
          className={`${inputClass} ${error ? "border-red-400" : "border-zinc-200"}`}
        />
        {error && (
          <span className="mt-1 block text-xs text-red-600">{error}</span>
        )}
      </label>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,28rem)]">
        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-900">
              {editingId ? "Edit car" : "Add a car"}
            </p>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-700">
              {editingId
                ? cars.find((c) => c.id === editingId)?.memberCode
                : memberCode}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {field("make", "Make", {
              list: "stock-makes",
              placeholder: "Toyota",
              autoComplete: "off",
            })}
            {field("model", "Model", {
              placeholder: "Land Cruiser 300",
              autoComplete: "off",
            })}
            {field("year", "Year", {
              inputMode: "numeric",
              placeholder: String(maxYear() - 1),
              min: MIN_YEAR,
              max: maxYear(),
            })}
            {field("color", "Colour", {
              placeholder: "Pearl White",
              autoComplete: "off",
            })}
            {field("engine", "Engine", {
              placeholder: "3.3L V6 Diesel",
              autoComplete: "off",
            })}

            <fieldset>
              <legend className="mb-1 block text-xs font-semibold text-zinc-600">
                LHD/RHD
              </legend>
              <div className="flex h-10 rounded-lg border border-zinc-200 p-0.5">
                {STOCK_STEERING.map((hand) => (
                  <button
                    key={hand}
                    type="button"
                    onClick={() => set("steering", hand)}
                    aria-pressed={form.steering === hand}
                    className={`flex-1 rounded-md text-sm font-semibold transition-feedback ${
                      form.steering === hand
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {hand}
                  </button>
                ))}
              </div>
              {errors.steering && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.steering}
                </span>
              )}
            </fieldset>

            <div>
              <span className="mb-1 block text-xs font-semibold text-zinc-600">
                FOB
              </span>
              <div className="flex gap-2">
                <select
                  aria-label="FOB currency"
                  value={form.fobCurrency}
                  onChange={(e) => set("fobCurrency", e.target.value)}
                  className={`${inputClass} w-24 shrink-0 border-zinc-200`}
                >
                  {STOCK_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="FOB price"
                  inputMode="decimal"
                  placeholder="25,000"
                  value={String(form.fobPrice)}
                  onChange={(e) => set("fobPrice", e.target.value)}
                  aria-invalid={Boolean(errors.fobPrice)}
                  className={`${inputClass} min-w-0 ${errors.fobPrice ? "border-red-400" : "border-zinc-200"}`}
                />
              </div>
              {errors.fobPrice && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors.fobPrice}
                </span>
              )}
            </div>

            {field("shippingPort", "Shipping port", {
              list: "stock-ports",
              placeholder: "Yokohama",
              autoComplete: "off",
            })}
          </div>

          <datalist id="stock-makes">
            {CAR_MAKES.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <datalist id="stock-ports">
            {ports.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-10 items-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0 disabled:opacity-50"
            >
              {editingId ? "Save changes" : "Add car"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition-feedback hover:bg-zinc-50 active:scale-[0.98] active:duration-0"
              >
                <X size={15} aria-hidden />
                Cancel
              </button>
            )}
          </div>
        </form>

        <PublicLink link={publicLink} />
      </div>

      <LinkedSheets
        sheets={sheets}
        isAdmin={isAdmin}
        onChange={(update, next) => {
          setSheets(update);
          setCars(next);
        }}
      />

      <StockImport
        isAdmin={isAdmin}
        actorId={actorId}
        memberCode={memberCode}
        members={stockMembers}
        onImported={(added) => {
          setCars((list) => [...added, ...list]);
          setView("live");
        }}
        onLinked={(sheet, next) => {
          setSheets((list) => [sheet, ...list]);
          setCars(next);
          setView("live");
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["live", `On the list (${liveCount})`],
              ["removed", `Removed (${removedCount})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition-feedback ${
                view === key
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          ))}

          {isAdmin && members.length > 1 && (
            <select
              aria-label="Filter by team member"
              value={member}
              onChange={(e) => setMember(e.target.value)}
              className="ml-auto h-9 rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-700"
            >
              <option value="all">Every team member</option>
              {members.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Make</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Colour</th>
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">LHD/RHD</th>
                <th className="px-4 py-3 text-right">FOB</th>
                <th className="px-4 py-3">Shipping port</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    {view === "live"
                      ? "No cars on the list yet."
                      : "No removed cars."}
                  </td>
                </tr>
              )}
              {shown.map((car) => (
                <tr
                  key={car.id}
                  className={editingId === car.id ? "bg-sky-50" : undefined}
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {car.make}
                  </td>
                  <td className="px-4 py-3">{car.model}</td>
                  <td className="px-4 py-3 tabular-nums">{car.year}</td>
                  <td className="px-4 py-3">{car.color}</td>
                  <td className="px-4 py-3">{car.engine}</td>
                  <td className="px-4 py-3">{car.steering}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatFob(car.fobPrice, car.fobCurrency)}
                  </td>
                  <td className="px-4 py-3">{car.shippingPort}</td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-xs font-semibold text-zinc-700"
                      title={car.ownerName ?? undefined}
                    >
                      {car.memberCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {car.sheetId ? (
                        <a
                          href={sheetUrl.get(car.sheetId) ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          title="This car comes from a linked Google Sheet. Change it in the sheet."
                          aria-label={`Edit ${car.make} ${car.model} in its Google Sheet`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-emerald-700 transition-feedback hover:bg-emerald-50"
                        >
                          <FileSpreadsheet size={14} aria-hidden />
                          In the sheet
                        </a>
                      ) : (
                        <>
                          {!car.isRemoved && (
                            <button
                              type="button"
                              onClick={() => startEdit(car)}
                              aria-label={`Edit ${car.make} ${car.model}`}
                              className="rounded-md p-2 text-zinc-500 transition-feedback hover:bg-zinc-100 hover:text-zinc-900"
                            >
                              <Pencil size={15} aria-hidden />
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={pending}
                            onClick={() => toggleRemoved(car)}
                            aria-label={
                              car.isRemoved
                                ? `Put ${car.make} ${car.model} back on the list`
                                : `Remove ${car.make} ${car.model}`
                            }
                            className={`rounded-md p-2 transition-feedback disabled:opacity-50 ${
                              car.isRemoved
                                ? "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                : "text-zinc-500 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            {car.isRemoved ? (
                              <RotateCcw size={15} aria-hidden />
                            ) : (
                              <Trash2 size={15} aria-hidden />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// The one link for customers: every live car from every team member.
function PublicLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-semibold text-zinc-900">Customer link</p>
      <p className="mt-0.5 text-xs text-zinc-500">
        Every team member&rsquo;s cars in one list. Changes show the moment they
        are saved.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Customer link"
          className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0"
        >
          {copied ? (
            <Check size={15} aria-hidden />
          ) : (
            <Copy size={15} aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-xs font-semibold text-sky-700 hover:underline"
      >
        Open the customer list
      </a>
    </div>
  );
}
