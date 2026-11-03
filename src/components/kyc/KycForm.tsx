"use client";

import { CheckCircle2, FileText, Loader2, Lock, Upload, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { submitKyc } from "@/actions/kyc-actions";
import { COUNTRIES } from "@/lib/countries";
import {
  checkIdFile,
  emptyKycInput,
  hasErrors,
  ID_DOCUMENT_TYPES,
  ID_FILE_ACCEPT,
  KYC_DECLARATIONS,
  type KycErrors,
  type KycField,
  type KycInput,
  LIMITS,
  needsBack,
  SOURCE_OF_FUNDS,
  validateKyc,
} from "@/lib/kyc";
import { currentRepCode } from "@/lib/rep-link";

// The order the fields appear in, so a failed submit can move focus to the
// first problem rather than leave the customer hunting for it.
const FIELD_ORDER: KycField[] = [
  "fullName",
  "dateOfBirth",
  "nationality",
  "addressLine1",
  "city",
  "country",
  "phone",
  "email",
  "idDocumentType",
  "idFront",
  "idBack",
  "paymentCountry",
  "bankName",
  "sourceOfFunds",
  "sourceOfFundsDetail",
  "sanctionsDeclared",
  "pepDeclared",
];

const DIAL_CODES = Array.from(new Set(COUNTRIES.map((c) => c.c))).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
);

const inputClass = (invalid: boolean) =>
  `block h-12 w-full rounded-xl border px-4 text-base text-black placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] focus:outline-none ${
    invalid ? "border-red-400 bg-red-50/40" : "border-black/10 bg-white"
  }`;

export default function KycForm() {
  const [form, setForm] = useState<KycInput>(emptyKycInput);
  const [files, setFiles] = useState<{ front: File | null; back: File | null }>(
    { front: null, back: null },
  );
  const [errors, setErrors] = useState<KycErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const dialTouched = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const backNeeded = needsBack(form.idDocumentType || null);
  const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const allErrors = (next: KycInput, nextFiles = files): KycErrors => {
    const e = validateKyc(next);
    const front = checkIdFile(nextFiles.front, "front");
    if (front) e.idFront = front;
    if (needsBack(next.idDocumentType || null)) {
      const back = checkIdFile(nextFiles.back, "back");
      if (back) e.idBack = back;
    }
    return e;
  };

  // After the first attempt, errors follow the input as it is corrected.
  const setField = <K extends keyof KycInput>(key: K, value: KycInput[K]) => {
    const next = { ...form, [key]: value };
    // The country of residence sets the dial code until the customer picks
    // one themselves.
    if (key === "country" && !dialTouched.current) {
      const dial = COUNTRIES.find((c) => c.n === value)?.c;
      if (dial) next.phoneDial = dial;
    }
    setForm(next);
    if (submitted) setErrors(allErrors(next));
  };

  const setFile = (side: "front" | "back", file: File | null) => {
    const next = { ...files, [side]: file };
    setFiles(next);
    if (submitted) setErrors(allErrors(form, next));
  };

  const focusFirstError = (e: KycErrors) => {
    const first = FIELD_ORDER.find((f) => e[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(
      `[data-field="${first}"]`,
    );
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "center" });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    setSubmitted(true);
    setFailure(null);

    const e = allErrors(form);
    setErrors(e);
    if (hasErrors(e)) {
      focusFirstError(e);
      return;
    }

    const data = new FormData();
    for (const [key, value] of Object.entries(form)) {
      data.set(key, String(value));
    }
    if (files.front) data.set("idFront", files.front);
    if (backNeeded && files.back) data.set("idBack", files.back);
    const rep = currentRepCode();
    if (rep) data.set("repCode", rep);

    setSending(true);
    try {
      const result = await submitKyc(data);
      if (result.ok) {
        setReference(result.reference);
        window.scrollTo({ top: 0 });
        return;
      }
      if (result.errors && hasErrors(result.errors)) {
        setErrors(result.errors);
        focusFirstError(result.errors);
      }
      setFailure(
        result.message ??
          "Some details need another look — check the fields marked in red.",
      );
    } catch {
      setFailure(
        "Your details could not be sent. Check your connection and try again — files must be 10 MB or smaller.",
      );
    } finally {
      setSending(false);
    }
  };

  if (reference) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-[0_24px_60px_rgba(2,6,23,0.06)] sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Your details are with us.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-500">
          Your reference is{" "}
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-sm font-semibold text-zinc-800">
            {reference}
          </span>
          . Your consultant will confirm once they are approved, and your
          proforma invoice follows.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
      aria-describedby={failure ? "kyc-failure" : undefined}
    >
      <Section number="01" title="Your identity">
        <Field
          id="kyc-fullName"
          field="fullName"
          label="Full legal name"
          hint="Exactly as it appears on your ID."
          error={errors.fullName}
        >
          <input
            id="kyc-fullName"
            data-field="fullName"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            autoComplete="name"
            maxLength={LIMITS.name}
            aria-invalid={Boolean(errors.fullName) || undefined}
            aria-describedby="kyc-fullName-message"
            className={inputClass(Boolean(errors.fullName))}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="kyc-dateOfBirth"
            field="dateOfBirth"
            label="Date of birth"
            error={errors.dateOfBirth}
          >
            <input
              id="kyc-dateOfBirth"
              data-field="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              max={maxDate}
              min="1900-01-01"
              onChange={(e) => setField("dateOfBirth", e.target.value)}
              autoComplete="bday"
              aria-invalid={Boolean(errors.dateOfBirth) || undefined}
              aria-describedby="kyc-dateOfBirth-message"
              className={inputClass(Boolean(errors.dateOfBirth))}
            />
          </Field>
          <Field
            id="kyc-nationality"
            field="nationality"
            label="Nationality"
            error={errors.nationality}
          >
            <CountrySelect
              id="kyc-nationality"
              field="nationality"
              value={form.nationality}
              onChange={(v) => setField("nationality", v)}
              invalid={Boolean(errors.nationality)}
            />
          </Field>
        </div>
      </Section>

      <Section number="02" title="Your current residential address">
        <Field
          id="kyc-addressLine1"
          field="addressLine1"
          label="Address line 1"
          error={errors.addressLine1}
        >
          <input
            id="kyc-addressLine1"
            data-field="addressLine1"
            value={form.addressLine1}
            onChange={(e) => setField("addressLine1", e.target.value)}
            autoComplete="address-line1"
            maxLength={LIMITS.line}
            aria-invalid={Boolean(errors.addressLine1) || undefined}
            aria-describedby="kyc-addressLine1-message"
            className={inputClass(Boolean(errors.addressLine1))}
          />
        </Field>
        <Field
          id="kyc-addressLine2"
          field="addressLine2"
          label="Address line 2"
          optional
        >
          <input
            id="kyc-addressLine2"
            value={form.addressLine2}
            onChange={(e) => setField("addressLine2", e.target.value)}
            autoComplete="address-line2"
            maxLength={LIMITS.line}
            className={inputClass(false)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="kyc-city"
            field="city"
            label="Town or city"
            error={errors.city}
          >
            <input
              id="kyc-city"
              data-field="city"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              autoComplete="address-level2"
              maxLength={LIMITS.line}
              aria-invalid={Boolean(errors.city) || undefined}
              aria-describedby="kyc-city-message"
              className={inputClass(Boolean(errors.city))}
            />
          </Field>
          <Field
            id="kyc-region"
            field="region"
            label="County, state or region"
            optional
          >
            <input
              id="kyc-region"
              value={form.region}
              onChange={(e) => setField("region", e.target.value)}
              autoComplete="address-level1"
              maxLength={LIMITS.line}
              className={inputClass(false)}
            />
          </Field>
          <Field id="kyc-postcode" field="postcode" label="Postcode" optional>
            <input
              id="kyc-postcode"
              value={form.postcode}
              onChange={(e) => setField("postcode", e.target.value)}
              autoComplete="postal-code"
              maxLength={LIMITS.postcode}
              className={inputClass(false)}
            />
          </Field>
          <Field
            id="kyc-country"
            field="country"
            label="Country"
            error={errors.country}
          >
            <CountrySelect
              id="kyc-country"
              field="country"
              value={form.country}
              onChange={(v) => setField("country", v)}
              invalid={Boolean(errors.country)}
              autoComplete="country-name"
            />
          </Field>
        </div>
      </Section>

      <Section number="03" title="Your contact details">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="kyc-phone"
            field="phone"
            label="Mobile number"
            error={errors.phone}
          >
            <div
              className={`flex h-12 overflow-hidden rounded-xl border transition-[border-color,box-shadow] focus-within:border-sky-500 focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] ${
                errors.phone
                  ? "border-red-400 bg-red-50/40"
                  : "border-black/10 bg-white"
              }`}
            >
              <select
                aria-label="Country code"
                value={form.phoneDial}
                onChange={(e) => {
                  dialTouched.current = true;
                  setField("phoneDial", e.target.value);
                }}
                className="shrink-0 cursor-pointer border-r border-black/10 bg-zinc-50 px-3 text-sm font-semibold text-zinc-700 focus:outline-none"
              >
                <option value="">Code</option>
                {DIAL_CODES.map((dial) => (
                  <option key={dial} value={dial}>
                    {dial}
                  </option>
                ))}
              </select>
              <input
                id="kyc-phone"
                data-field="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                maxLength={LIMITS.phone}
                aria-invalid={Boolean(errors.phone) || undefined}
                aria-describedby="kyc-phone-message"
                className="w-0 min-w-0 flex-1 bg-transparent px-4 text-base text-black focus:outline-none"
              />
            </div>
          </Field>
          <Field
            id="kyc-email"
            field="email"
            label="Email address"
            error={errors.email}
          >
            <input
              id="kyc-email"
              data-field="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              maxLength={LIMITS.email}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby="kyc-email-message"
              className={inputClass(Boolean(errors.email))}
            />
          </Field>
        </div>
      </Section>

      <Section number="04" title="Your ID, front and back">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-zinc-800">
            Which ID are you uploading?
          </legend>
          <div
            className="flex flex-wrap gap-2"
            aria-describedby="kyc-idDocumentType-message"
          >
            {ID_DOCUMENT_TYPES.map((doc, i) => {
              const active = form.idDocumentType === doc.value;
              return (
                <label
                  key={doc.value}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/20 ${
                    active
                      ? "border-black bg-black text-white"
                      : errors.idDocumentType
                        ? "border-red-300 bg-white text-zinc-700"
                        : "border-black/10 bg-white text-zinc-700 hover:border-black/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="idDocumentType"
                    value={doc.value}
                    checked={active}
                    data-field={i === 0 ? "idDocumentType" : undefined}
                    onChange={() => setField("idDocumentType", doc.value)}
                    className="sr-only"
                  />
                  {doc.label}
                </label>
              );
            })}
          </div>
          <FieldMessage
            id="kyc-idDocumentType-message"
            error={errors.idDocumentType}
          />
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <FileDrop
            side="front"
            label={
              form.idDocumentType === "passport"
                ? "Passport photo page"
                : "Front of your ID"
            }
            file={files.front}
            onChange={(f) => setFile("front", f)}
            error={errors.idFront}
          />
          {backNeeded ? (
            <FileDrop
              side="back"
              label="Back of your ID"
              file={files.back}
              onChange={(f) => setFile("back", f)}
              error={errors.idBack}
            />
          ) : (
            <p className="flex items-center rounded-2xl border border-dashed border-black/10 bg-zinc-50 p-5 text-sm text-zinc-500">
              A passport needs only the photo page.
            </p>
          )}
        </div>
        <p className="flex items-start gap-2 text-sm text-zinc-500">
          <Lock size={15} className="mt-0.5 shrink-0" aria-hidden />A clear
          photo or scan with all four corners visible. JPG, PNG, WebP or PDF, up
          to 10 MB each.
        </p>
      </Section>

      <Section number="05" title="How you will pay">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="kyc-paymentCountry"
            field="paymentCountry"
            label="Payment country"
            hint="The country your payment is sent from."
            error={errors.paymentCountry}
          >
            <CountrySelect
              id="kyc-paymentCountry"
              field="paymentCountry"
              value={form.paymentCountry}
              onChange={(v) => setField("paymentCountry", v)}
              invalid={Boolean(errors.paymentCountry)}
            />
          </Field>
          <Field
            id="kyc-bankName"
            field="bankName"
            label="Bank"
            hint="The bank the payment is sent from."
            error={errors.bankName}
          >
            <input
              id="kyc-bankName"
              data-field="bankName"
              value={form.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
              maxLength={LIMITS.bank}
              aria-invalid={Boolean(errors.bankName) || undefined}
              aria-describedby="kyc-bankName-message"
              className={inputClass(Boolean(errors.bankName))}
            />
          </Field>
        </div>
        <Field
          id="kyc-sourceOfFunds"
          field="sourceOfFunds"
          label="Source of funds"
          error={errors.sourceOfFunds}
        >
          <select
            id="kyc-sourceOfFunds"
            data-field="sourceOfFunds"
            value={form.sourceOfFunds}
            onChange={(e) => setField("sourceOfFunds", e.target.value)}
            aria-invalid={Boolean(errors.sourceOfFunds) || undefined}
            aria-describedby="kyc-sourceOfFunds-message"
            className={inputClass(Boolean(errors.sourceOfFunds))}
          >
            <option value="">Choose one</option>
            {SOURCE_OF_FUNDS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        {form.sourceOfFunds && (
          <Field
            id="kyc-sourceOfFundsDetail"
            field="sourceOfFundsDetail"
            label={
              form.sourceOfFunds === "Other"
                ? "Where do the funds come from?"
                : "Anything to add"
            }
            optional={form.sourceOfFunds !== "Other"}
            error={errors.sourceOfFundsDetail}
          >
            <textarea
              id="kyc-sourceOfFundsDetail"
              data-field="sourceOfFundsDetail"
              value={form.sourceOfFundsDetail}
              onChange={(e) => setField("sourceOfFundsDetail", e.target.value)}
              rows={3}
              maxLength={LIMITS.detail}
              aria-invalid={Boolean(errors.sourceOfFundsDetail) || undefined}
              aria-describedby="kyc-sourceOfFundsDetail-message"
              className={`${inputClass(Boolean(errors.sourceOfFundsDetail))} h-auto py-3`}
            />
          </Field>
        )}
      </Section>

      <Section number="06" title="Your declarations">
        <Declaration
          field="sanctionsDeclared"
          checked={form.sanctionsDeclared}
          onChange={(v) => setField("sanctionsDeclared", v)}
          text={KYC_DECLARATIONS.sanctions}
          error={errors.sanctionsDeclared}
        />
        <Declaration
          field="pepDeclared"
          checked={form.pepDeclared}
          onChange={(v) => setField("pepDeclared", v)}
          text={KYC_DECLARATIONS.pep}
          error={errors.pepDeclared}
        />
      </Section>

      {failure && (
        <p
          id="kyc-failure"
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {failure}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          By sending, you confirm the details are true and complete.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-semibold text-white transition-feedback hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 active:scale-[0.98] active:duration-0 disabled:cursor-wait disabled:bg-zinc-700 sm:w-auto"
        >
          {sending && (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          )}
          {sending ? "Sending securely…" : "Send my details"}
        </button>
      </div>
    </form>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_24px_60px_rgba(2,6,23,0.05)] sm:p-8"
    >
      <h2
        id={id}
        className="flex items-baseline gap-3 text-lg font-bold tracking-tight sm:text-xl"
      >
        <span className="font-mono text-xs font-semibold text-sky-600">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  optional,
  error,
  children,
}: {
  id: string;
  field: KycField;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-zinc-800"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-zinc-400">Optional</span>
        )}
      </label>
      {children}
      <FieldMessage id={`${id}-message`} error={error} hint={hint} />
    </div>
  );
}

function FieldMessage({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) {
  if (!error && !hint) return <span id={id} hidden />;
  return (
    <p
      id={id}
      className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-zinc-500"}`}
    >
      {error ?? hint}
    </p>
  );
}

function CountrySelect({
  id,
  field,
  value,
  onChange,
  invalid,
  autoComplete,
}: {
  id: string;
  field: KycField;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  autoComplete?: string;
}) {
  return (
    <select
      id={id}
      data-field={field}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      aria-invalid={invalid || undefined}
      aria-describedby={`${id}-message`}
      className={inputClass(invalid)}
    >
      <option value="">Choose a country</option>
      {COUNTRIES.map((c) => (
        <option key={c.n} value={c.n}>
          {c.n}
        </option>
      ))}
    </select>
  );
}

function FileDrop({
  side,
  label,
  file,
  onChange,
  error,
}: {
  side: "front" | "back";
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const inputId = `kyc-id-${side}`;
  const field: KycField = side === "front" ? "idFront" : "idBack";
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = useMemo(
    () => (file?.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const take = (list: FileList | null) => {
    const picked = list?.[0];
    if (picked) onChange(picked);
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-zinc-800">
        {label}
      </span>
      {file ? (
        <div
          className={`relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border bg-zinc-50 ${
            error ? "border-red-400" : "border-black/10"
          }`}
        >
          {preview ? (
            // biome-ignore lint/performance/noImgElement: a local object URL, nothing to optimise
            <img
              src={preview}
              alt={`Preview: ${label}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="flex flex-col items-center gap-2 px-4 text-center text-sm text-zinc-600">
              <FileText size={28} className="text-zinc-400" aria-hidden />
              {file.name}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute right-2 top-2 inline-flex h-8 items-center gap-1 rounded-full bg-white/95 px-3 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-black/10 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30"
          >
            <X size={13} aria-hidden />
            Replace
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            take(e.dataTransfer.files);
          }}
          className={`flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 text-center transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/20 ${
            error
              ? "border-red-400 bg-red-50/40"
              : dragging
                ? "border-sky-500 bg-sky-50"
                : "border-black/15 bg-zinc-50 hover:border-black/30"
          }`}
        >
          <Upload size={22} className="text-zinc-400" aria-hidden />
          <span className="text-sm font-semibold text-zinc-800">
            Take a photo or choose a file
          </span>
          <span className="text-xs text-zinc-500">JPG, PNG, WebP or PDF</span>
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        data-field={field}
        type="file"
        accept={ID_FILE_ACCEPT}
        onChange={(e) => take(e.target.files)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={`${inputId}-message`}
        aria-label={label}
        className="sr-only"
      />
      <FieldMessage id={`${inputId}-message`} error={error} />
    </div>
  );
}

function Declaration({
  field,
  checked,
  onChange,
  text,
  error,
}: {
  field: KycField;
  checked: boolean;
  onChange: (value: boolean) => void;
  text: string;
  error?: string;
}) {
  const id = `kyc-${field}`;
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/20 ${
          error
            ? "border-red-300 bg-red-50/40"
            : checked
              ? "border-black/20 bg-zinc-50"
              : "border-black/10 hover:border-black/25"
        }`}
      >
        <input
          id={id}
          data-field={field}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={`${id}-message`}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-black"
        />
        <span className="text-sm leading-relaxed text-zinc-800">{text}</span>
      </label>
      <FieldMessage id={`${id}-message`} error={error} />
    </div>
  );
}
