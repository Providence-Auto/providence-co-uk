"use client";

import type { CountryCode } from "libphonenumber-js";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleCheckBig,
  ExternalLink,
  Info,
  Loader2,
  Plus,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitDealerInquiry } from "@/actions/dealer-inquiry-actions";
import Combobox, { type ComboboxOption } from "@/components/dealer/Combobox";
import DealerCarCard from "@/components/dealer/DealerCarCard";
import Flag from "@/components/dealer/Flag";
import {
  Chip,
  Field,
  FieldMessage,
  inputClass,
  Segmented,
} from "@/components/dealer/fields";
import {
  DEALER_SOURCE_MARKETS,
  joinSourceMarkets,
  parseSourceMarkets,
  sourceMarketCurrency,
  LHD_ALTERNATIVE,
  MAX_DEALER_CARS,
  type MarketOption,
} from "@/config/dealer-sourcing";
import { currencyForCountry } from "@/lib/currencies";
import {
  checkSocial,
  checkWhatsApp,
  DESIGNATION_SUGGESTIONS,
  type DealerCarInput,
  type DealerInquiryInput,
  emptyCar,
  type FieldErrors,
  hasErrors,
  type PhoneLib,
  parseSocialLink,
  regionName,
  resolvePhoneCountry,
  SOCIAL_PLATFORMS,
  type SocialPlatform,
  validateCar,
  validateCarsStep,
  validateContact,
  validateDealership,
} from "@/lib/dealer-inquiry";
import { currentRepCode } from "@/lib/rep-link";

// The contact comes first and the dealership details are optional, on the
// same step below it (business instruction 2026-10-26).
const STEPS = [
  { key: "market", label: "Market" },
  { key: "details", label: "You" },
  { key: "cars", label: "Cars" },
] as const;

const STEP_TITLES = [
  "Where does your dealership import cars into?",
  "Who should your consultant contact?",
  "Which cars do you want to import?",
];

/** Which step owns each server-side error key, so a rejected submit lands there. */
const FIELD_STEP: Record<string, number> = {
  country: 0,
  contactName: 1,
  designation: 1,
  email: 1,
  whatsapp: 1,
  dealershipName: 1,
  website: 1,
  socialMedia: 1,
};

/** The role chip that opens a free-text field instead of filling one in. */
const OTHER_ROLE = "Other";

type SocialChoice = SocialPlatform | "other";

const SOCIAL_CHOICES: { value: SocialChoice; label: string }[] = [
  ...(Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).map((key) => ({
    value: key,
    label: SOCIAL_PLATFORMS[key].label,
  })),
  { value: "other", label: "Other" },
];

const isSourceMarket = (slug: string) =>
  DEALER_SOURCE_MARKETS.some((m) => m.slug === slug);

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * The country calling code only — "+1-876" → "+1", "+44-1481" → "+44".
 * COUNTRIES carries an area code for some territories, but showing it in
 * front of the field tells the dealer not to type it, and a Jamaican number
 * does not parse without it (Jamaica has two area codes, 876 and 658).
 */
const dialLabel = (dial: string) => dial.split("-")[0];

/** For +1 territories, an example that shows the area code is part of the number. */
const phonePlaceholder = (dial: string) => {
  const [code, area] = dial.split("-");
  return code === "+1" && area ? `${area} 555 0123` : undefined;
};

type Success = {
  reference: string;
  consultant: { name: string; email: string; image: string } | null;
  receiptSent: boolean;
};

export default function DealerInquiryForm({
  markets,
  initialCountry = "",
  initialSourceMarket = null,
}: {
  /** Every country in the picker, resolved on the server (src/lib/dealer-markets.ts). */
  markets: MarketOption[];
  /**
   * Preselects the market check — a market-specific page such as
   * /import-japanese-cars/dealership opens on its own country. Must be the
   * exact COUNTRIES spelling; the dealer can still change it.
   */
  initialCountry?: string;
  /** Preselects the source market (a DEALER_SOURCE_MARKETS slug). */
  initialSourceMarket?: string | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  const phoneLibRef = useRef<PhoneLib | null>(null);
  const tracking = useRef({
    source: "",
    gclid: "",
    fbclid: "",
    fbc: "",
    fbp: "",
  });

  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [country, setCountry] = useState(initialCountry);
  const [form, setForm] = useState({
    dealershipName: "",
    website: "",
    socialMedia: "",
    contactName: "",
    designation: "",
    email: "",
    whatsapp: "",
    notes: "",
    faxNumber: "",
  });
  const [socialPlatform, setSocialPlatform] =
    useState<SocialChoice>("instagram");
  // null = no role chosen yet.
  const [designationChoice, setDesignationChoice] = useState<string | null>(
    null,
  );
  const designationRef = useRef<HTMLInputElement>(null);
  const focusDesignation = useRef(false);
  // null = the import country's code. Set only when the dealer changes it.
  const [phoneCountry, setPhoneCountry] = useState<CountryCode | null>(null);
  const [phoneLibReady, setPhoneLibReady] = useState(false);
  // null = not answered yet; "" = no particular market; otherwise the picked
  // markets, comma-joined (see parseSourceMarkets).
  const [sourceMarket, setSourceMarket] = useState<string | null>(
    initialSourceMarket,
  );
  const [wantsSpecificCars, setWantsSpecificCars] = useState<boolean | null>(
    null,
  );
  const [cars, setCars] = useState<DealerCarInput[]>([]);
  const [openCar, setOpenCar] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [carErrors, setCarErrors] = useState<FieldErrors[]>([]);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);
  // Bumped on every failed check, so the effect that brings the first problem
  // into view runs after the render that shows it (and opens its car card).
  const [errorNonce, setErrorNonce] = useState(0);
  const flagErrors = () => setErrorNonce((n) => n + 1);
  const addCarRef = useRef<HTMLButtonElement>(null);
  const refocusAfterRemove = useRef(false);

  const market = markets.find((m) => m.name === country) ?? null;
  // A budget is what the car costs where it is bought, so it opens in the
  // source market's currency; with no market chosen, the dealer's own.
  const defaultCurrency = (slug: string | null) =>
    sourceMarketCurrency(slug) || currencyForCountry(country);
  const preferredCurrency = defaultCurrency(sourceMarket);
  const pickedMarkets = parseSourceMarkets(sourceMarket);

  // Attribution, read once. Deliberately not useSearchParams: that would put
  // the whole form behind a Suspense boundary for four query parameters.
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

  // The full phone metadata is ~40 KB; fetch it only once the dealer is near
  // the step that needs it.
  const loadPhoneLib = useCallback(async (): Promise<PhoneLib> => {
    if (phoneLibRef.current) return phoneLibRef.current;
    const lib = await import("libphonenumber-js/max");
    phoneLibRef.current = lib;
    setPhoneLibReady(true);
    return lib;
  }, []);

  useEffect(() => {
    if (step >= 1) loadPhoneLib().catch(() => undefined);
  }, [step, loadPhoneLib]);

  // After a step change: bring the top of the form into view if it has
  // scrolled away, and move focus to the new step's heading for keyboard and
  // screen-reader users. Skipped on first render so the page doesn't jump.
  // biome-ignore lint/correctness/useExhaustiveDependencies: step and success are the triggers, not values read inside
  useEffect(() => {
    if (!interacted.current) return;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step, success]);

  // A failed check must be visible where the dealer is looking. Step 4 runs
  // to thousands of pixels on a phone, and "Send request" sits at the bottom,
  // far below a missed market choice or a car's empty make — so without this
  // the button just appears to do nothing. Declared after the step effect so
  // that, when both run, focus ends on the problem rather than the heading.
  useEffect(() => {
    if (errorNonce === 0) return;
    const root = rootRef.current;
    const first = root?.querySelector<HTMLElement>(
      '[aria-invalid="true"], [role="alert"]',
    );
    if (!first) return;
    first.scrollIntoView({ behavior: "smooth", block: "center" });
    const control = first.matches('[aria-invalid="true"]')
      ? first
      : first
          .closest("fieldset")
          ?.querySelector<HTMLElement>("input, button, textarea");
    control?.focus({ preventScroll: true });
  }, [errorNonce]);

  // Removing a car unmounts the button that had focus; hand it to "Add
  // another car", which always exists after a removal, rather than letting it
  // fall back to the top of the document.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when a car is removed; the count is the trigger
  useEffect(() => {
    if (!refocusAfterRemove.current) return;
    refocusAfterRemove.current = false;
    addCarRef.current?.focus();
  }, [cars.length]);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const chooseSocialPlatform = (choice: SocialChoice) => {
    setSocialPlatform(choice);
    setErrors(({ socialMedia: _s, ...rest }) => rest);
    if (choice !== "other" && form.socialMedia.trimStart().startsWith("@")) {
      setField("socialMedia", form.socialMedia.replace(/^\s*@+/, ""));
    }
  };

  // A pasted profile link is turned into the platform plus the username, so
  // the dealer sees what we will store — and doesn't have to pick the
  // platform first.
  const changeSocial = (value: string) => {
    const link = parseSocialLink(value);
    if (link?.url) {
      setSocialPlatform(link.platform);
      setField("socialMedia", link.handle ?? value);
      return;
    }
    // The field already shows the "@" in front of a username.
    setField(
      "socialMedia",
      socialPlatform === "other" ? value : value.replace(/^\s*@+/, ""),
    );
  };

  const socialCheck = form.socialMedia.trim()
    ? checkSocial(form.socialMedia, socialPlatform)
    : null;

  // A preset role fills the field; "Other" empties it and opens a text field.
  const chooseDesignation = (title: string) => {
    if (title === OTHER_ROLE && designationChoice === OTHER_ROLE) return;
    setDesignationChoice(title);
    setField("designation", title === OTHER_ROLE ? "" : title);
    focusDesignation.current = title === OTHER_ROLE;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when "Other" is chosen; the choice is the trigger
  useEffect(() => {
    if (!focusDesignation.current) return;
    focusDesignation.current = false;
    designationRef.current?.focus();
  }, [designationChoice]);

  // The WhatsApp country: the import country unless the dealer changed it.
  const phoneIso = phoneCountry ?? market?.iso ?? null;
  const phoneChanged = Boolean(phoneCountry && phoneCountry !== market?.iso);
  const phoneLib = phoneLibReady ? phoneLibRef.current : null;
  const phoneDial =
    phoneChanged && phoneLib && phoneCountry
      ? `+${phoneLib.getCountryCallingCode(phoneCountry)}`
      : market
        ? dialLabel(market.dial)
        : "";
  const phoneOptions = useMemo(() => {
    if (!phoneLib) return [];
    return phoneLib
      .getCountries()
      .map((iso) => ({
        iso,
        name: regionName(iso),
        code: phoneLib.getCountryCallingCode(iso),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "en"));
  }, [phoneLib]);

  const choosePhoneCountry = (iso: string) => {
    const lib = phoneLibRef.current;
    if (!lib?.isSupportedCountry(iso)) return;
    setPhoneCountry(iso === market?.iso ? null : (iso as CountryCode));
    setErrors(({ whatsapp: _w, ...rest }) => rest);
  };

  const goTo = (next: number) => {
    interacted.current = true;
    setStep(next);
    setFurthest((f) => Math.max(f, next));
  };

  // ── Step checks ────────────────────────────────────────────────────────────

  const checkMarketStep = (): boolean => {
    if (!market) {
      setErrors({ country: "Choose your country to continue" });
      flagErrors();
      return false;
    }
    return market.status !== "right-traffic";
  };

  const checkPhone = async (): Promise<string | null> => {
    if (!market?.iso) return "Choose your country first";
    const lib = await loadPhoneLib();
    const phone = resolvePhoneCountry(lib, phoneCountry, market.iso, country);
    const result = checkWhatsApp(lib, form.whatsapp, phone.iso, phone.name);
    if (!result.ok) return result.error;
    setForm((prev) => ({ ...prev, whatsapp: result.national }));
    return null;
  };

  const carsStepErrors = () => {
    const stepErrors: FieldErrors = {};
    if (sourceMarket === null) {
      stepErrors.sourceMarket = "Choose a market, or “No particular market”";
    }
    if (wantsSpecificCars === null) {
      stepErrors.wantsSpecificCars = "Choose yes or no";
    }
    const checked = validateCarsStep(
      {
        sourceMarket: sourceMarket ?? "",
        wantsSpecificCars: wantsSpecificCars === true,
        cars,
        notes: form.notes,
      },
      isSourceMarket,
    );
    // "Pick a market or add cars" only makes sense once both are answered.
    if (sourceMarket === null || wantsSpecificCars === null) {
      delete checked.errors.cars;
    }
    return {
      errors: { ...stepErrors, ...checked.errors },
      carErrors: checked.carErrors,
    };
  };

  const next = async () => {
    setErrors({});
    if (step === 0) {
      if (checkMarketStep()) goTo(1);
      return;
    }
    if (step === 1) {
      setBusy(true);
      try {
        const found = {
          ...validateContact(form),
          ...validateDealership({ ...form, socialPlatform }),
        };
        if (designationChoice === null) {
          found.designation = "Choose your role at the dealership";
        }
        const phoneError = await checkPhone();
        if (phoneError) found.whatsapp = phoneError;
        if (hasErrors(found)) {
          setErrors(found);
          flagErrors();
          return;
        }
      } catch {
        setErrors({
          whatsapp: "We couldn't check that number — please try again",
        });
        flagErrors();
        return;
      } finally {
        setBusy(false);
      }
      goTo(2);
      return;
    }
    await submit();
  };

  const submit = async () => {
    const checked = carsStepErrors();
    setCarErrors(checked.carErrors);
    if (hasErrors(checked.errors) || hasErrors(checked.carErrors)) {
      setErrors(checked.errors);
      const firstBadCar = checked.carErrors.findIndex(
        (e) => Object.keys(e).length > 0,
      );
      if (firstBadCar >= 0) setOpenCar(firstBadCar);
      flagErrors();
      return;
    }

    const payload: DealerInquiryInput = {
      country,
      dealershipName: form.dealershipName,
      website: form.website,
      socialMedia: form.socialMedia,
      socialPlatform,
      contactName: form.contactName,
      designation: form.designation,
      email: form.email,
      whatsapp: form.whatsapp,
      whatsappCountry: phoneIso ?? undefined,
      sourceMarket: sourceMarket ?? "",
      wantsSpecificCars: wantsSpecificCars === true,
      cars: wantsSpecificCars ? cars : [],
      notes: form.notes,
      faxNumber: form.faxNumber,
      ...tracking.current,
      // Read at submit, not with the rest of the attribution on mount: the
      // rep link may have been seen on another page earlier in the visit.
      repCode: currentRepCode(),
    };

    setBusy(true);
    try {
      const result = await submitDealerInquiry(payload);
      if (result.success) {
        interacted.current = true;
        setSuccess({
          reference: result.reference,
          consultant: result.consultant,
          receiptSent: result.receiptSent,
        });
        return;
      }
      // Route the server's verdict back to the step that owns it.
      const fieldErrors: FieldErrors = {};
      const serverCarErrors: FieldErrors[] = cars.map(() => ({}));
      let target = STEPS.length - 1;
      for (const [key, message] of Object.entries(result.errors ?? {})) {
        const carMatch = key.match(/^cars\.(\d+)\.(.+)$/);
        if (carMatch) {
          const i = Number(carMatch[1]);
          if (serverCarErrors[i]) serverCarErrors[i][carMatch[2]] = message;
          continue;
        }
        fieldErrors[key] = message;
        if (key in FIELD_STEP) target = Math.min(target, FIELD_STEP[key]);
      }
      setCarErrors(serverCarErrors);
      setErrors({ ...fieldErrors, submit: result.message });
      if (target !== step) goTo(target);
      flagErrors();
    } catch {
      setErrors({
        submit:
          "We couldn't send your request just now. Please try again in a moment.",
      });
      flagErrors();
    } finally {
      setBusy(false);
    }
  };

  // ── Cars ───────────────────────────────────────────────────────────────────

  /**
   * Markets are multi-select; "No particular market" ("") is exclusive of
   * them. Unpicking the last market leaves the question unanswered (null).
   */
  const chooseSourceMarket = (slug: string) => {
    let next: string | null = "";
    if (slug) {
      const picked = parseSourceMarkets(sourceMarket);
      const toggled = picked.includes(slug)
        ? picked.filter((s) => s !== slug)
        : [...picked, slug];
      next = toggled.length ? joinSourceMarkets(toggled) : null;
    }
    // Cars still on the old default follow the first market picked; a
    // currency the dealer picked by hand stays.
    const from = preferredCurrency;
    const to = defaultCurrency(next);
    setSourceMarket(next);
    setCars((prev) =>
      prev.map((car) =>
        car.budgetCurrency === from ? { ...car, budgetCurrency: to } : car,
      ),
    );
    setErrors(({ sourceMarket: _s, cars: _c, ...rest }) => rest);
  };

  const chooseSpecificCars = (wants: boolean) => {
    setWantsSpecificCars(wants);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.wantsSpecificCars;
      delete next.cars;
      return next;
    });
    if (wants && cars.length === 0) {
      setCars([emptyCar(preferredCurrency)]);
      setCarErrors([{}]);
      setOpenCar(0);
    }
  };

  const updateCar = (index: number, patch: Partial<DealerCarInput>) => {
    setCars((prev) =>
      prev.map((car, i) => (i === index ? { ...car, ...patch } : car)),
    );
    setCarErrors((prev) => {
      if (!prev[index]) return prev;
      const copy = [...prev];
      const current = { ...copy[index] };
      for (const key of Object.keys(patch)) {
        delete current[key];
        if (key === "mileageMin" || key === "mileageMax")
          delete current.mileage;
      }
      copy[index] = current;
      return copy;
    });
  };

  const addCar = () => {
    if (cars.length >= MAX_DEALER_CARS) return;
    // Finish the open car before starting another, so a half-filled card
    // isn't left collapsed and forgotten.
    const openErrors = cars[openCar] ? validateCar(cars[openCar]) : {};
    if (hasErrors(openErrors)) {
      setCarErrors((prev) => {
        const copy = [...prev];
        copy[openCar] = openErrors;
        return copy;
      });
      flagErrors();
      return;
    }
    const currency = cars[openCar]?.budgetCurrency || preferredCurrency;
    setCars((prev) => [...prev, emptyCar(currency)]);
    setCarErrors((prev) => [...prev, {}]);
    setOpenCar(cars.length);
  };

  /** A fresh cars step, keeping the market, dealership and contact details. */
  const startAnother = () => {
    setCars([]);
    setCarErrors([]);
    setOpenCar(0);
    setSourceMarket(null);
    setWantsSpecificCars(null);
    setForm((prev) => ({ ...prev, notes: "" }));
    setErrors({});
    interacted.current = true;
    setStep(STEPS.length - 1);
    setSuccess(null);
  };

  const removeCar = (index: number) => {
    refocusAfterRemove.current = true;
    setCars((prev) => prev.filter((_, i) => i !== index));
    setCarErrors((prev) => prev.filter((_, i) => i !== index));
    setOpenCar((current) =>
      current === index
        ? Math.max(0, index - 1)
        : current > index
          ? current - 1
          : current,
    );
  };

  // ── Options ────────────────────────────────────────────────────────────────

  const countryOptions = useMemo<ComboboxOption[]>(() => {
    const toOption = (m: MarketOption, group: string): ComboboxOption => ({
      value: m.name,
      label: m.name,
      group,
      leading: <Flag iso={m.iso} size={22} />,
    });
    return [
      ...markets
        .filter((m) => m.listed)
        .map((m) => toOption(m, "Markets we ship to")),
      ...markets
        .filter((m) => !m.listed)
        .map((m) => toOption(m, "All other countries")),
    ];
  }, [markets]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (success) {
    const firstName = form.contactName.trim().split(/\s+/)[0] || "there";
    return (
      <div
        ref={rootRef}
        id="inquiry-form"
        className="relative scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/90 p-6 shadow-[0_40px_100px_rgba(2,6,23,0.10)] backdrop-blur-xl sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CircleCheckBig size={28} />
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-black focus:outline-none sm:text-3xl"
          >
            Your request is in, {firstName}.
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
                <UserRound size={26} className="text-sky-600" />
              )}
            </span>
            <p className="text-sm leading-relaxed text-zinc-700">
              {success.consultant ? (
                <>
                  <span className="block font-semibold text-black">
                    {success.consultant.name}
                  </span>
                  is your consultant for this request.
                </>
              ) : (
                "A consultant from our sales team will pick up your request."
              )}
            </p>
          </div>

          {success.receiptSent && (
            <p className="mt-6 max-w-md text-sm text-zinc-500">
              A copy of your request is on its way to{" "}
              <span className="font-medium text-zinc-700">
                {form.email.trim()}
              </span>
              . If it isn't in your inbox, check your spam folder.
            </p>
          )}

          {/* The five-car cap tells dealers to send, then start another — so
              the way to do that is here, with the dealership and contact
              details kept rather than typed out again. */}
          <button
            type="button"
            onClick={startAnother}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20"
          >
            <Plus size={16} />
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = step === STEPS.length - 1;
  const blocked = step === 0 && market?.status === "right-traffic";

  return (
    <div
      ref={rootRef}
      id="inquiry-form"
      className="relative scroll-mt-28 rounded-[2rem] border border-black/5 bg-white/90 shadow-[0_40px_100px_rgba(2,6,23,0.10)] backdrop-blur-xl"
    >
      {/* Progress: one segment per step, each a way back to a step already done. */}
      <nav aria-label="Form progress" className="px-5 pt-5 sm:px-8 sm:pt-7">
        <ol className="grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            const reachable = i <= furthest && i !== step;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!reachable || busy}
                  onClick={() => goTo(i)}
                  aria-current={current ? "step" : undefined}
                  className="group w-full text-left disabled:cursor-default"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-colors ${
                      current
                        ? "bg-gradient-to-r from-sky-500 to-violet-500"
                        : done || i <= furthest
                          ? "bg-black"
                          : "bg-black/10"
                    }`}
                  />
                  <span
                    className={`mt-2 block text-xs font-semibold tracking-wide ${
                      current
                        ? "text-black"
                        : reachable
                          ? "text-zinc-500 group-hover:text-black"
                          : "text-zinc-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-1.5 text-xl font-bold tracking-tight text-black focus:outline-none sm:text-2xl"
        >
          {STEP_TITLES[step]}
        </h2>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy && !blocked) void next();
          }}
          className="mt-6"
        >
          {/* Honeypot — off-screen, unfocusable, unlabelled for people. */}
          <div
            aria-hidden
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            <label>
              Fax number
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.faxNumber}
                onChange={(e) => setField("faxNumber", e.target.value)}
              />
            </label>
          </div>

          <div key={step} className="pa-step-in space-y-6">
            {step === 0 && (
              <>
                <Field
                  id="dealer-country"
                  label="Your country"
                  error={errors.country}
                >
                  <Combobox
                    id="dealer-country"
                    labelledBy="dealer-country-label"
                    options={countryOptions}
                    value={country}
                    onChange={(value) => {
                      setCountry(value);
                      setErrors({});
                    }}
                    placeholder="Search for your country"
                    size="lg"
                    invalid={Boolean(errors.country)}
                    // The result is part of the field's description, so a
                    // screen-reader user returning to it hears why Continue
                    // is (or isn't) available.
                    describedBy={
                      [
                        errors.country && "dealer-country-message",
                        market && "dealer-market-status",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                  />
                </Field>

                {/* Always in the document: a live region inserted together
                    with its first message is not announced, so the first
                    country a dealer picks would otherwise go unread. */}
                <div
                  id="dealer-market-status"
                  aria-live="polite"
                  className={market ? "" : "-mt-6"}
                >
                  {market?.status === "destination" && (
                    <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                      <CheckCircle2
                        size={22}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <div>
                        <p className="font-semibold text-emerald-950">
                          Yes — you can import into {market.name}.
                        </p>
                        <p className="mt-1 text-sm text-emerald-900/80">
                          Cars ship CNF to your port, with the document pack
                          prepared and clearance support when they arrive. The
                          rules for your exact cars — age limits, the hand
                          they're built in, the duty — are confirmed before you
                          commit.
                        </p>
                      </div>
                    </div>
                  )}
                  {market?.status === "unlisted" && (
                    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                      <Info
                        size={22}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />
                      <div>
                        <p className="font-semibold text-amber-950">
                          {market.name} isn't one of our listed destinations.
                        </p>
                        <p className="mt-1 text-sm text-amber-900/80">
                          You can still send your request — your consultant
                          confirms whether we can ship there before anything
                          else.
                        </p>
                      </div>
                    </div>
                  )}
                  {market?.status === "right-traffic" && (
                    <div className="flex gap-3 rounded-2xl border border-black/10 bg-zinc-50 p-4">
                      <Info
                        size={22}
                        className="mt-0.5 shrink-0 text-zinc-500"
                      />
                      <div>
                        <p className="font-semibold text-black">
                          This page is for markets that drive on the left.
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">
                          For left-hand-drive markets, see{" "}
                          <Link
                            href={LHD_ALTERNATIVE.href}
                            className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:decoration-sky-600"
                          >
                            {LHD_ALTERNATIVE.label}
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 1 && market && (
              <>
                <Field
                  id="dealer-contact"
                  label="Your full name"
                  error={errors.contactName}
                >
                  <input
                    id="dealer-contact"
                    value={form.contactName}
                    onChange={(e) => setField("contactName", e.target.value)}
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={Boolean(errors.contactName) || undefined}
                    className={inputClass(Boolean(errors.contactName), "h-13")}
                  />
                </Field>
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-zinc-800">
                    Your role at the dealership
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {[...DESIGNATION_SUGGESTIONS, OTHER_ROLE].map((title) => (
                      <Chip
                        key={title}
                        selected={designationChoice === title}
                        onClick={() => chooseDesignation(title)}
                      >
                        {title}
                      </Chip>
                    ))}
                  </div>
                  {designationChoice === OTHER_ROLE ? (
                    <div className="mt-3">
                      <label htmlFor="dealer-designation" className="sr-only">
                        Your role
                      </label>
                      <input
                        id="dealer-designation"
                        ref={designationRef}
                        value={form.designation}
                        onChange={(e) =>
                          setField("designation", e.target.value)
                        }
                        autoComplete="organization-title"
                        placeholder="e.g. Fleet Manager"
                        maxLength={80}
                        aria-invalid={Boolean(errors.designation) || undefined}
                        aria-describedby="dealer-designation-message"
                        className={inputClass(
                          Boolean(errors.designation),
                          "h-13",
                        )}
                      />
                    </div>
                  ) : null}
                  <FieldMessage
                    id="dealer-designation"
                    error={errors.designation}
                  />
                </fieldset>
                <Field id="dealer-email" label="Email" error={errors.email}>
                  <input
                    id="dealer-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    autoComplete="email"
                    maxLength={254}
                    aria-invalid={Boolean(errors.email) || undefined}
                    className={inputClass(Boolean(errors.email), "h-13")}
                  />
                </Field>
                <Field
                  id="dealer-whatsapp"
                  label="WhatsApp number"
                  error={errors.whatsapp}
                  hint={
                    phoneChanged && phoneIso
                      ? `Country code changed from ${market.name}, your import country.`
                      : `Country code set from your import country, ${market.name}. Change it if your WhatsApp number is from another country.`
                  }
                >
                  <div
                    className={`flex h-13 items-stretch overflow-hidden rounded-2xl border transition-[border-color,box-shadow] focus-within:border-sky-500 focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] ${
                      errors.whatsapp
                        ? "border-red-400 bg-red-50/40"
                        : "border-black/10 bg-zinc-50/80"
                    }`}
                  >
                    {/* The visible prefix is drawn underneath; a transparent
                        native <select> covers it, so a tap opens the phone's
                        own picker and a keyboard user gets type-ahead. */}
                    <span className="relative flex shrink-0 items-center gap-2 border-r border-black/10 bg-white/60 px-3.5 text-sm font-semibold text-zinc-700 focus-within:bg-white">
                      <Flag iso={phoneIso} size={20} />
                      {phoneDial}
                      {phoneOptions.length > 0 && (
                        <>
                          <ChevronDown
                            size={14}
                            aria-hidden
                            className="-ml-1 text-zinc-400"
                          />
                          <select
                            aria-label="WhatsApp country code"
                            value={phoneIso ?? ""}
                            onChange={(e) => choosePhoneCountry(e.target.value)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                          >
                            {market.iso && (
                              <optgroup label="Your import country">
                                <option value={market.iso}>
                                  {`${country} (+${phoneLib?.getCountryCallingCode(market.iso)})`}
                                </option>
                              </optgroup>
                            )}
                            <optgroup label="All countries">
                              {phoneOptions
                                .filter((o) => o.iso !== market.iso)
                                .map((o) => (
                                  <option key={o.iso} value={o.iso}>
                                    {`${o.name} (+${o.code})`}
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                        </>
                      )}
                    </span>
                    <input
                      id="dealer-whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={form.whatsapp}
                      onChange={(e) => setField("whatsapp", e.target.value)}
                      placeholder={
                        phoneChanged ? undefined : phonePlaceholder(market.dial)
                      }
                      maxLength={30}
                      aria-invalid={Boolean(errors.whatsapp) || undefined}
                      aria-describedby="dealer-whatsapp-message"
                      className="w-0 min-w-0 flex-1 bg-transparent px-4 text-base text-black placeholder:text-zinc-400 focus:outline-none"
                    />
                  </div>
                </Field>
                <fieldset className="border-t border-black/5 pt-6">
                  {/* The legend is for screen readers; the visible heading
                      sits in normal flow, which a <legend> does not. */}
                  <legend className="sr-only">
                    Your dealership (optional)
                  </legend>
                  <p
                    aria-hidden
                    className="mb-5 text-base font-semibold text-black"
                  >
                    Your dealership
                    <span className="ml-1.5 text-sm font-normal text-zinc-400">
                      optional
                    </span>
                  </p>
                  <div className="space-y-6">
                    <Field
                      id="dealer-name"
                      label="Dealership name"
                      error={errors.dealershipName}
                    >
                      <input
                        id="dealer-name"
                        value={form.dealershipName}
                        onChange={(e) =>
                          setField("dealershipName", e.target.value)
                        }
                        autoComplete="organization"
                        maxLength={120}
                        aria-invalid={
                          Boolean(errors.dealershipName) || undefined
                        }
                        className={inputClass(
                          Boolean(errors.dealershipName),
                          "h-13",
                        )}
                      />
                    </Field>
                    <Field
                      id="dealer-website"
                      label="Website"
                      error={errors.website}
                    >
                      <input
                        id="dealer-website"
                        value={form.website}
                        onChange={(e) => setField("website", e.target.value)}
                        placeholder="yourdealership.com"
                        inputMode="url"
                        autoComplete="url"
                        maxLength={300}
                        aria-invalid={Boolean(errors.website) || undefined}
                        className={inputClass(Boolean(errors.website), "h-13")}
                      />
                    </Field>
                    <fieldset className="space-y-3">
                      <legend className="mb-2 block text-sm font-medium text-zinc-800">
                        Social media page
                      </legend>
                      <Segmented
                        name="dealer-social-platform"
                        options={SOCIAL_CHOICES}
                        value={socialPlatform}
                        onChange={chooseSocialPlatform}
                      />
                      <Field
                        id="dealer-social"
                        label={
                          socialPlatform === "other"
                            ? "Link to your page"
                            : `${SOCIAL_PLATFORMS[socialPlatform].label} username`
                        }
                        error={errors.socialMedia}
                        hint={
                          socialCheck?.ok && (
                            <a
                              href={socialCheck.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-sky-700 underline-offset-2 hover:underline"
                            >
                              {socialCheck.url.replace(
                                /^https:\/\/(www\.)?/,
                                "",
                              )}
                              <ExternalLink size={13} aria-hidden />
                              <span className="sr-only">
                                (opens in a new tab)
                              </span>
                            </a>
                          )
                        }
                      >
                        <div className="relative">
                          {socialPlatform !== "other" &&
                            !form.socialMedia.includes("/") && (
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-zinc-400"
                              >
                                @
                              </span>
                            )}
                          <input
                            id="dealer-social"
                            value={form.socialMedia}
                            onChange={(e) => changeSocial(e.target.value)}
                            placeholder={
                              socialPlatform === "other"
                                ? "youtube.com/@yourdealership"
                                : "yourdealership"
                            }
                            inputMode={
                              socialPlatform === "other" ? "url" : "text"
                            }
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            maxLength={300}
                            aria-invalid={
                              Boolean(errors.socialMedia) || undefined
                            }
                            className={inputClass(
                              Boolean(errors.socialMedia),
                              socialPlatform !== "other" &&
                                !form.socialMedia.includes("/")
                                ? "h-13 pl-9"
                                : "h-13",
                            )}
                          />
                        </div>
                      </Field>
                    </fieldset>
                  </div>
                </fieldset>
              </>
            )}

            {step === 2 && (
              <>
                <fieldset>
                  <legend className="text-sm font-medium text-zinc-800">
                    Do you want to import from particular markets?
                  </legend>
                  <p className="mt-1 mb-3 text-xs text-zinc-500">
                    Choose as many as you like.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEALER_SOURCE_MARKETS.map((m) => (
                      <Chip
                        key={m.slug}
                        selected={pickedMarkets.includes(m.slug)}
                        onClick={() => chooseSourceMarket(m.slug)}
                        leading={<Flag iso={m.iso} size={18} />}
                      >
                        {m.name}
                      </Chip>
                    ))}
                    <Chip
                      selected={sourceMarket === ""}
                      onClick={() => chooseSourceMarket("")}
                    >
                      No particular market
                    </Chip>
                  </div>
                  <FieldMessage
                    id="dealer-source"
                    error={errors.sourceMarket}
                  />
                </fieldset>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-zinc-800">
                    Are you after particular makes or models?
                  </legend>
                  <Segmented
                    name="dealer-specific-cars"
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "Not yet" },
                    ]}
                    value={
                      wantsSpecificCars === null
                        ? null
                        : wantsSpecificCars
                          ? "yes"
                          : "no"
                    }
                    onChange={(value) => chooseSpecificCars(value === "yes")}
                    invalid={Boolean(errors.wantsSpecificCars)}
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    You can request multiple cars per request if needed.
                  </p>
                  <FieldMessage
                    id="dealer-specific"
                    error={errors.wantsSpecificCars}
                  />
                </fieldset>

                {wantsSpecificCars && (
                  <div className="space-y-3">
                    {cars.map((car, index) => (
                      <DealerCarCard
                        // biome-ignore lint/suspicious/noArrayIndexKey: cars have no identity beyond their position, and removal re-keys the rest on purpose
                        key={index}
                        index={index}
                        car={car}
                        errors={carErrors[index] ?? {}}
                        open={openCar === index}
                        canRemove={cars.length > 1}
                        preferredCurrency={preferredCurrency}
                        onToggle={() =>
                          setOpenCar((current) =>
                            current === index ? -1 : index,
                          )
                        }
                        onChange={(patch) => updateCar(index, patch)}
                        onRemove={() => removeCar(index)}
                      />
                    ))}
                    {cars.length < MAX_DEALER_CARS ? (
                      <button
                        type="button"
                        ref={addCarRef}
                        onClick={addCar}
                        className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-black/15 px-4 py-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-black/40 hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20"
                      >
                        <Plus size={16} />
                        Add another car
                        <span className="font-normal text-zinc-400">
                          {cars.length} of {MAX_DEALER_CARS}
                        </span>
                      </button>
                    ) : (
                      <p className="text-center text-sm text-zinc-500">
                        That's the most one request can carry. Send it, then
                        start another for more.
                      </p>
                    )}
                  </div>
                )}

                <FieldMessage id="dealer-cars" error={errors.cars} />

                <Field
                  id="dealer-notes"
                  label="Anything else your consultant should know?"
                  optional
                  error={errors.notes}
                >
                  <textarea
                    id="dealer-notes"
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="e.g. the monthly volume you're after, or a port you prefer"
                    className={inputClass(
                      Boolean(errors.notes),
                      "resize-none py-3",
                    )}
                  />
                </Field>
              </>
            )}
          </div>

          {errors.submit && (
            <p
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {errors.submit}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-zinc-600 transition-colors hover:text-black disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={busy || blocked}
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-[transform,background-color,opacity] hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLastStep ? "Send request" : "Continue"}
              {!busy && !isLastStep && <ArrowRight size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
