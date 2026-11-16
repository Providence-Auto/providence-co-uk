"use client";

import { CircleCheckBig, Info, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitDealerInquiry } from "@/actions/dealer-inquiry-actions";
import { LHD_ALTERNATIVE, type MarketOption } from "@/config/dealer-sourcing";
import {
  checkWhatsApp,
  DESIGNATION_SUGGESTIONS,
  type FieldErrors,
  hasErrors,
  LIMITS,
  MAX_STOCK_CARS,
  type PhoneLib,
  phoneIsoForCountry,
  validateContact,
  validateDealership,
} from "@/lib/dealer-inquiry";
import { scrollBehavior } from "@/lib/fluid";
import { pushLeadEvent } from "@/lib/lead-events";
import { currentRepCode } from "@/lib/rep-link";
import { formatFob, type StockCarFields } from "@/lib/stock";

export type PublicStockCar = StockCarFields & {
  id: string;
  memberCode: string;
};

const FORM_ID = "stock-inquiry";

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

const carName = (car: PublicStockCar) => `${car.year} ${car.make} ${car.model}`;

type Success = {
  reference: string;
  consultant: { name: string; email: string; image: string } | null;
  receiptSent: boolean;
  firstName: string;
  email: string;
};

const inputClass =
  "h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-sky-500/15";

export default function AvailableCarsClient({
  cars,
  markets,
}: {
  cars: PublicStockCar[];
  markets: MarketOption[];
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [form, setForm] = useState({
    contactName: "",
    designation: "",
    email: "",
    whatsapp: "",
    dealershipName: "",
    website: "",
    notes: "",
    faxNumber: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);
  const phoneLibRef = useRef<PhoneLib | null>(null);
  const tracking = useRef({
    source: "",
    gclid: "",
    fbclid: "",
    fbc: "",
    fbp: "",
  });

  const market = markets.find((m) => m.name === country) ?? null;
  const byId = useMemo(() => new Map(cars.map((c) => [c.id, c])), [cars]);
  const picked = selected.flatMap((id) => {
    const car = byId.get(id);
    return car ? [car] : [];
  });
  // A market that drives on the right may inquire for left-hand-drive cars
  // only (business instruction 2026-11-16). The server decides it again from
  // the list itself; this only says so before the dealer types anything.
  const rightTraffic = market?.status === "right-traffic";
  const allLhd = picked.length > 0 && picked.every((c) => c.steering === "LHD");
  const blocked = rightTraffic && !allLhd;
  const rhdPicked = picked.filter((c) => c.steering !== "LHD");
  // Not on our destination list: the consultant confirms the route first.
  const unlisted =
    market?.status === "unlisted" || (rightTraffic && market?.listed === false);
  const full = selected.length >= MAX_STOCK_CARS;

  // Attribution, read once, the same way the dealer page reads it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    tracking.current = {
      source: params.get("ref") || window.location.pathname,
      gclid: params.get("gclid") || "",
      fbclid: params.get("fbclid") || "",
      fbc: readCookie("_fbc"),
      fbp: readCookie("_fbp"),
    };
  }, []);

  // The bottom bar is only a way to the form, so it steps aside while the
  // form is on screen and never sits over its submit button.
  const [formInView, setFormInView] = useState(false);
  useEffect(() => {
    const section = document.getElementById(FORM_ID);
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setFormInView(entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The full phone metadata is ~40 KB; fetch it once the dealer reaches the
  // form rather than with the list.
  const loadPhoneLib = useCallback(async (): Promise<PhoneLib> => {
    if (phoneLibRef.current) return phoneLibRef.current;
    const lib = await import("libphonenumber-js/max");
    phoneLibRef.current = lib;
    return lib;
  }, []);

  const toggle = (id: string) => {
    setSelected((list) =>
      list.includes(id)
        ? list.filter((x) => x !== id)
        : list.length >= MAX_STOCK_CARS
          ? list
          : [...list, id],
    );
    if (errors.stockCars) setErrors(({ stockCars: _, ...rest }) => rest);
  };

  const set = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest);
  };

  const goToForm = () =>
    document
      .getElementById(FORM_ID)
      ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || blocked) return;

    const found: FieldErrors = {
      ...validateContact(form),
      ...validateDealership({ ...form, socialMedia: "" }),
    };
    if (picked.length === 0)
      found.stockCars = "Select at least one car from the list";
    if (!market) found.country = "Choose your country";
    if (form.notes.trim().length > LIMITS.notes) {
      found.notes = "Keep your note under 2,000 characters";
    }
    // The number can only be checked against a country; until one is chosen,
    // flag a blank field at least.
    if (!form.whatsapp.trim()) {
      found.whatsapp = "Enter your WhatsApp number";
    } else if (market && !blocked) {
      const lib = await loadPhoneLib().catch(() => null);
      const iso = lib ? phoneIsoForCountry(lib, market.name) : null;
      if (lib && iso) {
        const check = checkWhatsApp(lib, form.whatsapp, iso, market.name);
        if (!check.ok) found.whatsapp = check.error;
      }
    }
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    setBusy(true);
    try {
      const result = await submitDealerInquiry({
        country,
        dealershipName: form.dealershipName,
        website: form.website,
        socialMedia: "",
        contactName: form.contactName,
        designation: form.designation,
        email: form.email,
        whatsapp: form.whatsapp,
        sourceMarket: "",
        wantsSpecificCars: false,
        cars: [],
        stockCarIds: picked.map((c) => c.id),
        notes: form.notes,
        faxNumber: form.faxNumber,
        ...tracking.current,
        repCode: currentRepCode(),
        pagePath: window.location.pathname,
      });
      if (result.success) {
        // Only now, once the inquiry is stored (src/lib/lead-events.ts).
        pushLeadEvent({
          leadType: "dealer",
          reference: result.reference,
          formName: "stock_list",
          destinationCountry: country,
          carCount: picked.length,
        });
        setSuccess({
          reference: result.reference,
          consultant: result.consultant,
          receiptSent: result.receiptSent,
          firstName: form.contactName.trim().split(/\s+/)[0] || "there",
          email: form.email.trim(),
        });
        setSelected([]);
        return;
      }
      setErrors({ ...(result.errors ?? {}), submit: result.message });
    } catch {
      setErrors({
        submit:
          "We couldn't send your inquiry just now. Please try again in a moment.",
      });
    } finally {
      setBusy(false);
    }
  };

  const checkbox = (car: PublicStockCar) => {
    const on = selected.includes(car.id);
    return (
      <input
        type="checkbox"
        checked={on}
        disabled={!on && full}
        onChange={() => toggle(car.id)}
        aria-label={`Select the ${carName(car)}`}
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-900 disabled:cursor-not-allowed"
      />
    );
  };

  const field = (
    name: keyof typeof form,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-800">
        {label}
      </span>
      <input
        {...props}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        onFocus={() => loadPhoneLib().catch(() => undefined)}
        aria-invalid={Boolean(errors[name])}
        className={`${inputClass} ${errors[name] ? "border-red-400" : "border-zinc-200"}`}
      />
      {errors[name] && (
        <span className="mt-1 block text-sm text-red-600">{errors[name]}</span>
      )}
    </label>
  );

  return (
    <>
      {cars.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-zinc-500">
          No cars are listed right now.
        </p>
      ) : (
        <>
          {/* Phones: one card per car. */}
          <ul className="mt-8 space-y-3 md:hidden">
            {cars.map((car) => (
              <li key={car.id}>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: the checkbox is inside, rendered by checkbox() */}
                <label
                  className={`block cursor-pointer rounded-2xl border bg-white p-4 ${
                    selected.includes(car.id)
                      ? "border-zinc-900 ring-1 ring-zinc-900"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {checkbox(car)}
                    <p className="flex-1 font-semibold text-zinc-900">
                      {carName(car)}
                    </p>
                    <span className="shrink-0 font-mono text-xs font-semibold text-zinc-500">
                      {car.memberCode}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pl-8 text-sm">
                    <div>
                      <dt className="text-xs text-zinc-500">Colour</dt>
                      <dd className="text-zinc-900">{car.color}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">Engine</dt>
                      <dd className="text-zinc-900">{car.engine}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">LHD/RHD</dt>
                      <dd className="text-zinc-900">{car.steering}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">Shipping port</dt>
                      <dd className="text-zinc-900">{car.shippingPort}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs text-zinc-500">FOB</dt>
                      <dd className="font-semibold tabular-nums text-zinc-900">
                        {formatFob(car.fobPrice, car.fobCurrency)}
                      </dd>
                    </div>
                  </dl>
                </label>
              </li>
            ))}
          </ul>

          {/* Tablet and up: one table. */}
          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3">
                    <span className="sr-only">Select</span>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Make
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Model
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Year
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Colour
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Engine
                  </th>
                  <th scope="col" className="px-4 py-3">
                    LHD/RHD
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    FOB
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Shipping port
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Code
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {cars.map((car) => (
                  <tr
                    key={car.id}
                    onClick={(e) => {
                      // The checkbox handles its own click.
                      if ((e.target as HTMLElement).tagName !== "INPUT") {
                        toggle(car.id);
                      }
                    }}
                    className={`cursor-pointer ${
                      selected.includes(car.id)
                        ? "bg-sky-50"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <td className="px-4 py-3">{checkbox(car)}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {car.make}
                    </td>
                    <td className="px-4 py-3">{car.model}</td>
                    <td className="px-4 py-3 tabular-nums">{car.year}</td>
                    <td className="px-4 py-3">{car.color}</td>
                    <td className="px-4 py-3">{car.engine}</td>
                    <td className="px-4 py-3">{car.steering}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums">
                      {formatFob(car.fobPrice, car.fobCurrency)}
                    </td>
                    <td className="px-4 py-3">{car.shippingPort}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-zinc-500">
                      {car.memberCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {full && (
            <p className="mt-3 text-sm text-zinc-500">
              You can send up to {MAX_STOCK_CARS} cars in one inquiry.
            </p>
          )}
        </>
      )}

      <section
        id={FORM_ID}
        aria-labelledby={`${FORM_ID}-heading`}
        className="mt-14 scroll-mt-6 rounded-[2rem] border border-zinc-200 bg-white p-6 sm:p-10"
      >
        {success ? (
          <div className="flex flex-col items-center text-center">
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CircleCheckBig size={28} aria-hidden />
            </span>
            <h2
              id={`${FORM_ID}-heading`}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Your inquiry is in, {success.firstName}.
            </h2>
            <p className="mt-3 text-zinc-500">
              Reference{" "}
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-sm font-semibold text-zinc-800">
                {success.reference}
              </span>
            </p>
            <div className="mt-8 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-black/5 bg-zinc-50 p-4 text-left">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-50">
                {success.consultant?.image ? (
                  // biome-ignore lint/performance/noImgElement: a remote profile photo of unknown host
                  <img
                    src={success.consultant.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={26} className="text-sky-600" aria-hidden />
                )}
              </span>
              <p className="text-sm leading-relaxed text-zinc-700">
                {success.consultant ? (
                  <>
                    <span className="block font-semibold text-black">
                      {success.consultant.name}
                    </span>
                    is your consultant for this inquiry.
                  </>
                ) : (
                  "A consultant from our sales team will pick up your inquiry."
                )}
              </p>
            </div>
            {success.receiptSent && (
              <p className="mt-6 max-w-md text-sm text-zinc-500">
                A copy is on its way to{" "}
                <span className="font-medium text-zinc-700">
                  {success.email}
                </span>
                . If it isn&rsquo;t in your inbox, check your spam folder.
              </p>
            )}
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="mt-8 rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-zinc-800 transition-feedback hover:border-black/40 active:scale-[0.98] active:duration-0"
            >
              Send another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2
              id={`${FORM_ID}-heading`}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Send one inquiry for the cars you selected.
            </h2>

            <div className="mt-6">
              {picked.length === 0 ? (
                <p
                  className={`rounded-xl border border-dashed px-4 py-3 text-sm ${
                    errors.stockCars
                      ? "border-red-300 text-red-600"
                      : "border-zinc-300 text-zinc-500"
                  }`}
                >
                  {errors.stockCars || "Select cars from the list above."}
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {picked.map((car) => (
                    <li
                      key={car.id}
                      className="flex items-center gap-1.5 rounded-full bg-zinc-900 py-1.5 pl-3.5 pr-1.5 text-sm font-medium text-white"
                    >
                      {carName(car)}
                      <span className="text-white/60">
                        · {formatFob(car.fobPrice, car.fobCurrency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(car.id)}
                        aria-label={`Remove the ${carName(car)}`}
                        className="rounded-full p-1 text-white/70 transition-feedback hover:bg-white/15 hover:text-white"
                      >
                        <X size={14} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {picked.length > 0 && errors.stockCars && (
                <p className="mt-2 text-sm text-red-600">{errors.stockCars}</p>
              )}
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-zinc-800">
                  Country your dealership imports into
                </span>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setErrors(({ country: _, whatsapp: __, ...rest }) => rest);
                  }}
                  aria-invalid={Boolean(errors.country)}
                  className={`${inputClass} ${errors.country ? "border-red-400" : "border-zinc-200"}`}
                >
                  <option value="" disabled>
                    Choose a country
                  </option>
                  {markets.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.country}
                  </span>
                )}
              </label>

              {market && unlisted && !blocked && (
                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:col-span-2">
                  <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-amber-600"
                    aria-hidden
                  />
                  <p className="text-sm text-amber-900">
                    {market.name} isn&rsquo;t one of our listed destinations.
                    You can still send your inquiry — your consultant confirms
                    whether we can ship there before anything else.
                  </p>
                </div>
              )}
              {blocked && (
                <div className="flex gap-3 rounded-2xl border border-black/10 bg-zinc-50 p-4 sm:col-span-2">
                  <Info
                    size={20}
                    className="mt-0.5 shrink-0 text-zinc-500"
                    aria-hidden
                  />
                  <p className="text-sm text-zinc-600">
                    {rhdPicked.length > 0
                      ? `${market?.name} drives on the right, so you can send an inquiry for left-hand-drive cars only. Remove the right-hand-drive ${rhdPicked.length === 1 ? "car" : "cars"} to continue.`
                      : `${market?.name} drives on the right, so you can send an inquiry for the left-hand-drive (LHD) cars on this list. Select one to continue.`}{" "}
                    Also see{" "}
                    <Link
                      href={LHD_ALTERNATIVE.href}
                      className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:decoration-sky-600"
                    >
                      {LHD_ALTERNATIVE.label}
                    </Link>
                    .
                  </p>
                </div>
              )}

              {field("contactName", "Full name", { autoComplete: "name" })}
              {field("designation", "Your role", {
                list: `${FORM_ID}-roles`,
                autoComplete: "organization-title",
              })}
              <datalist id={`${FORM_ID}-roles`}>
                {DESIGNATION_SUGGESTIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              {field("email", "Email", {
                type: "email",
                autoComplete: "email",
                inputMode: "email",
              })}
              {field(
                "whatsapp",
                market?.dial
                  ? `WhatsApp number (${market.dial})`
                  : "WhatsApp number",
                { type: "tel", autoComplete: "tel", inputMode: "tel" },
              )}
              {field("dealershipName", "Dealership name (optional)", {
                autoComplete: "organization",
              })}
              {field("website", "Website (optional)", {
                inputMode: "url",
                placeholder: "yourdealership.com",
              })}

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-zinc-800">
                  Note (optional)
                </span>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  aria-invalid={Boolean(errors.notes)}
                  className={`w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-zinc-900 focus:outline-none focus:ring-4 focus:ring-sky-500/15 ${
                    errors.notes ? "border-red-400" : "border-zinc-200"
                  }`}
                />
                {errors.notes && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.notes}
                  </span>
                )}
              </label>

              {/* Honeypot: off-screen, never filled in by a person. */}
              <input
                type="text"
                name="faxNumber"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.faxNumber}
                onChange={(e) => set("faxNumber", e.target.value)}
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
            </div>

            {errors.submit && (
              <p className="mt-6 text-sm text-red-600" role="alert">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || blocked}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-8 text-[15px] font-semibold text-white transition-feedback hover:bg-zinc-800 active:scale-[0.98] active:duration-0 disabled:opacity-50 sm:w-auto"
            >
              {busy
                ? "Sending…"
                : picked.length > 1
                  ? `Send inquiry for ${picked.length} cars`
                  : "Send inquiry"}
            </button>
          </form>
        )}
      </section>

      {/* The way to the form once something is picked; it sits over the list,
          never over the form itself. */}
      {selected.length > 0 && !success && !formInView && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-sm font-medium text-zinc-800">
              {selected.length} {selected.length === 1 ? "car" : "cars"}{" "}
              selected
            </p>
            <button
              type="button"
              onClick={goToForm}
              className="h-10 rounded-full bg-black px-5 text-sm font-semibold text-white transition-feedback hover:bg-zinc-800 active:scale-[0.98] active:duration-0"
            >
              Send inquiry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
