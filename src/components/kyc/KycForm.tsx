"use client";

// The client KYC form at /kyc — the full application (business instruction
// 2026-11-23), for individuals and companies, one step at a time so it works
// on a phone. The questions, rules and stored shape live in
// src/lib/kyc-application.ts; this file is only the form.
//
// Files go up one at a time as they are added (uploadKycFile), so a set of
// company documents never has to fit into one request, and the answers are
// sent last (submitKyc). The draft — answers and the keys of files already
// uploaded, never the files — is kept in sessionStorage, so a phone that
// reloads the tab after the camera opens does not lose the form.

import {
  Camera,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitKyc, uploadKycFile } from "@/actions/kyc-actions";
import { fireConfetti } from "@/lib/confetti";
import { COUNTRIES } from "@/lib/countries";
import {
  ID_DOCUMENT_TYPES,
  ID_FILE_ACCEPT,
  LIMITS,
  needsBack,
} from "@/lib/kyc";
import {
  COMPLIANCE_QUESTIONS,
  docPresence,
  emptyOwner,
  FUNDS_SOURCES,
  KYC_APPLICATION_DECLARATIONS,
  KYC_DOCUMENTS,
  type KycApplicationErrors,
  type KycApplicationInput,
  type KycDocPresence,
  type KycDocType,
  type KycStepId,
  type KycStoredDoc,
  MAX_FILES_PER_DOC,
  mergeKycApplication,
  OWNER_ROLES,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
  SHIPPING_TERMS,
  SOURCING_MARKETS,
  stepOfFirstError,
  VEHICLE_CONDITIONS,
  VEHICLE_PURPOSES,
  validateKycStep,
  visibleKycSteps,
} from "@/lib/kyc-application";

export interface KycFormPrefill {
  token: string;
  firstName: string;
  updating: boolean;
  application: Partial<KycApplicationInput>;
  onFile: KycDocPresence;
}

interface UploadedDoc extends KycStoredDoc {
  uid: string;
  /** A local preview, for images added in this tab only. */
  preview?: string;
}

const STORE_KEY = "providence-kyc-draft-v2";

const DIAL_CODES = Array.from(new Set(COUNTRIES.map((c) => c.c))).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1)),
);

const inputClass = (invalid: boolean) =>
  `block h-12 w-full rounded-xl border px-4 text-base text-black placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] focus:outline-none ${
    invalid ? "border-red-400 bg-red-50/40" : "border-black/10 bg-white"
  }`;

// ── Paths into the application ─────────────────────────────────────────────

function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]),
      obj,
    );
}

function setPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const source = (obj ?? {}) as Record<string, unknown>;
  const copy = (Array.isArray(obj) ? [...obj] : { ...source }) as Record<
    string,
    unknown
  >;
  copy[head] = rest.length
    ? setPath(source[head], rest.join("."), value)
    : value;
  return copy as T;
}

const withoutKey = (errors: KycApplicationErrors, key: string) => {
  if (!(key in errors)) return errors;
  const { [key]: _gone, ...rest } = errors;
  return rest;
};

// ── Images are made smaller before they go up ──────────────────────────────

async function shrinkImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const k = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    if (k === 1 && file.size < 2_500_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * k);
    canvas.height = Math.round(bitmap.height * k);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", 0.85),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

const newUid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

// ── The form ───────────────────────────────────────────────────────────────

export default function KycForm({
  prefill,
}: {
  prefill?: KycFormPrefill | null;
}) {
  const [app, setApp] = useState<KycApplicationInput>(() =>
    mergeKycApplication(prefill?.application),
  );
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [draftId, setDraftId] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<KycApplicationErrors>({});
  const [uploads, setUploads] = useState<
    Record<string, { busy: boolean; error: string | null }>
  >({});
  const [signature, setSignature] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const restored = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const token = prefill?.token ?? null;

  // Restore a draft from this tab, or start a new one.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (
        saved &&
        typeof saved.draftId === "string" &&
        (saved.token ?? null) === token
      ) {
        setDraftId(saved.draftId);
        setApp(mergeKycApplication(saved.app));
        setDocs(Array.isArray(saved.docs) ? saved.docs : []);
        setStepIndex(Number(saved.step) || 0);
        return;
      }
    } catch {
      // No storage (a private window): the form still works, it just won't
      // survive a reload.
    }
    setDraftId(newUid());
  }, [token]);

  useEffect(() => {
    if (!draftId || reference) return;
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          draftId,
          token,
          app,
          docs: docs.map(({ preview: _preview, ...d }) => d),
          step: stepIndex,
        }),
      );
    } catch {
      // Storage full or blocked — nothing to do.
    }
  }, [draftId, app, docs, stepIndex, reference, token]);

  const steps = useMemo(
    () => visibleKycSteps(app.customerType),
    [app.customerType],
  );
  const index = Math.min(stepIndex, steps.length - 1);
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const company = app.customerType === "company";

  const presence = useMemo<KycDocPresence>(() => {
    const p = docPresence(docs);
    const onFile = prefill?.onFile;
    if (onFile) {
      for (const [t, n] of Object.entries(onFile.byType)) {
        const type = t as KycDocType;
        p.byType[type] = (p.byType[type] ?? 0) + (n ?? 0);
      }
      for (const [i, n] of Object.entries(onFile.ownerPassports)) {
        p.ownerPassports[Number(i)] = (p.ownerPassports[Number(i)] ?? 0) + n;
      }
    }
    p.signature = Boolean(signature);
    return p;
  }, [docs, prefill?.onFile, signature]);

  const set = useCallback((path: string, value: unknown) => {
    setApp((prev) => {
      const next = setPath(prev, path, value);
      // The country of residence sets the dial code until one is chosen.
      if (path === "country" && !prev.phoneDial) {
        const dial = COUNTRIES.find((c) => c.n === value)?.c;
        if (dial) return { ...next, phoneDial: dial };
      }
      return next;
    });
    setErrors((prev) =>
      withoutKey(withoutKey(prev, path), path.replace(/\.answer$/, "")),
    );
  }, []);

  const focusFirstError = (e: KycApplicationErrors) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(
        `[data-field="${CSS.escape(first)}"]`,
      );
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center" });
    });
  };

  const goTo = (i: number) => {
    setStepIndex(i);
    setErrors({});
    setFailure(null);
    topRef.current?.scrollIntoView({ block: "start" });
  };

  // ── Files ──

  const slotKey = (type: KycDocType, ownerIndex?: number) =>
    `${type}#${ownerIndex ?? ""}`;

  const addFiles = async (
    type: KycDocType,
    files: File[],
    ownerIndex?: number,
  ) => {
    const slot = slotKey(type, ownerIndex);
    const single = type === "ID_FRONT" || type === "ID_BACK";
    const setSlot = (busy: boolean, error: string | null) =>
      setUploads((u) => ({ ...u, [slot]: { busy, error } }));

    for (const file of files) {
      if (file.size > LIMITS.fileBytes) {
        setSlot(false, "Files must be 10 MB or smaller");
        continue;
      }
      setSlot(true, null);
      try {
        const blob = await shrinkImage(file);
        const data = new FormData();
        data.set("draftId", draftId);
        data.set("type", type);
        if (ownerIndex !== undefined)
          data.set("ownerIndex", String(ownerIndex));
        data.set(
          "file",
          blob,
          blob === file ? file.name : file.name.replace(/\.\w+$/, ".jpg"),
        );
        const result = await uploadKycFile(data);
        if (!result.ok) {
          setSlot(false, result.message);
          continue;
        }
        const preview = blob.type.startsWith("image/")
          ? URL.createObjectURL(blob)
          : undefined;
        setDocs((prev) => [
          ...(single
            ? prev.filter(
                (d) => !(d.type === type && d.ownerIndex === ownerIndex),
              )
            : prev),
          { ...result.doc, uid: newUid(), preview },
        ]);
        setErrors((prev) =>
          withoutKey(
            prev,
            type === "OWNER_PASSPORT" ? `owners.${ownerIndex}.passport` : type,
          ),
        );
        setSlot(false, null);
      } catch {
        setSlot(
          false,
          "That file could not be sent. Check your connection and try again.",
        );
      }
    }
  };

  const removeDoc = (uid: string) =>
    setDocs((prev) => prev.filter((d) => d.uid !== uid));

  const removeOwner = (i: number) => {
    set(
      "owners",
      app.owners.filter((_, j) => j !== i),
    );
    setDocs((prev) =>
      prev
        .filter((d) => !(d.type === "OWNER_PASSPORT" && d.ownerIndex === i))
        .map((d) =>
          d.type === "OWNER_PASSPORT" &&
          typeof d.ownerIndex === "number" &&
          d.ownerIndex > i
            ? { ...d, ownerIndex: d.ownerIndex - 1 }
            : d,
        ),
    );
  };

  // ── Navigation and submit ──

  const next = async () => {
    if (sending) return;
    const e = validateKycStep(step.id, app, presence);
    if (Object.keys(e).length) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    if (!isLast) {
      // A company always starts with one person to fill in.
      if (steps[index + 1]?.id === "owners" && app.owners.length === 0) {
        set("owners", [emptyOwner()]);
      }
      // The signatory starts as the customer, or the company's contact.
      if (steps[index + 1]?.id === "sign" && !app.signatoryName.trim()) {
        set("signatoryName", company ? app.contactPerson : app.fullName);
      }
      goTo(index + 1);
      return;
    }
    await submit();
  };

  const submit = async () => {
    const firstBad = stepOfFirstError(app, presence);
    if (firstBad) {
      goTo(steps.findIndex((s) => s.id === firstBad));
      const e = validateKycStep(firstBad, app, presence);
      setErrors(e);
      setFailure(
        "Some details need another look — check the fields marked in red.",
      );
      focusFirstError(e);
      return;
    }
    setFailure(null);
    try {
      let all: KycStoredDoc[] = docs.map(
        ({ uid: _uid, preview: _preview, ...d }) => d,
      );
      if (signature) {
        setSending("Saving your signature…");
        const blob = await (await fetch(signature)).blob();
        const data = new FormData();
        data.set("draftId", draftId);
        data.set("type", "SIGNATURE");
        data.set("file", blob, "signature.png");
        const sig = await uploadKycFile(data);
        if (!sig.ok) throw new Error(sig.message);
        all = [...all.filter((d) => d.type !== "SIGNATURE"), sig.doc];
      }
      setSending("Sending securely…");
      const result = await submitKyc({
        draftId,
        token,
        application: app,
        documents: all,
      });
      if (result.ok) {
        setReference(result.reference);
        try {
          sessionStorage.removeItem(STORE_KEY);
        } catch {
          // ignore
        }
        topRef.current?.scrollIntoView({ block: "start" });
        // The sale is confirmed and the paperwork is in: a moment of colour.
        requestAnimationFrame(() => fireConfetti());
        return;
      }
      if (result.errors && Object.keys(result.errors).length) {
        const keys = Object.keys(result.errors);
        const bad = steps.findIndex((s) =>
          Object.keys(validateKycStep(s.id, app, presence)).some((k) =>
            keys.includes(k),
          ),
        );
        if (bad >= 0) goTo(bad);
        setErrors(result.errors);
        focusFirstError(result.errors);
      }
      setFailure(
        result.message ??
          "Some details need another look — check the fields marked in red.",
      );
    } catch (error) {
      setFailure(
        error instanceof Error && error.message
          ? error.message
          : "Your details could not be sent. Check your connection and try again.",
      );
    } finally {
      setSending(null);
    }
  };

  if (reference) {
    return (
      <div
        ref={topRef}
        className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-[0_24px_60px_rgba(2,6,23,0.06)] sm:p-12"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Thank you, your details are with us.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-500">
          Your reference is{" "}
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-sm font-semibold text-zinc-800">
            {reference}
          </span>
          . Your consultant will confirm once your details are approved, and
          your proforma invoice follows.
        </p>
      </div>
    );
  }

  const field = (
    path: string,
    label: string,
    opts: {
      optional?: boolean;
      type?: string;
      placeholder?: string;
      autoComplete?: string;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      hint?: string;
    } = {},
  ) => (
    <TextField
      path={path}
      label={label}
      value={String(getPath(app, path) ?? "")}
      onChange={(v) => set(path, v)}
      error={errors[path]}
      {...opts}
    />
  );

  const countryField = (path: string, label: string) => (
    <Labelled id={`kyc-${path}`} label={label} error={errors[path]}>
      <CountrySelect
        id={`kyc-${path}`}
        path={path}
        value={String(getPath(app, path) ?? "")}
        onChange={(v) => set(path, v)}
        invalid={Boolean(errors[path])}
      />
    </Labelled>
  );

  const chips = (
    path: string,
    options: readonly string[],
    multi: boolean,
    label: string,
    optional = true,
  ) => {
    const value = getPath(app, path);
    return (
      <Chips
        path={path}
        label={label}
        optional={optional}
        options={options}
        multi={multi}
        value={multi ? ((value as string[]) ?? []) : String(value ?? "")}
        onChange={(v) => set(path, v)}
        error={errors[path]}
      />
    );
  };

  const docBox = (
    type: KycDocType,
    label: string,
    help: string,
    required: boolean,
    ownerIndex?: number,
  ) => {
    const slot = slotKey(type, ownerIndex);
    const errorKey =
      type === "OWNER_PASSPORT" ? `owners.${ownerIndex}.passport` : type;
    return (
      <DocBox
        key={slot}
        field={errorKey}
        label={label}
        help={help}
        required={required}
        files={docs.filter(
          (d) => d.type === type && d.ownerIndex === ownerIndex,
        )}
        onFile={
          type === "OWNER_PASSPORT"
            ? (prefill?.onFile.ownerPassports[ownerIndex ?? -1] ?? 0)
            : (prefill?.onFile.byType[type] ?? 0)
        }
        single={type === "ID_FRONT" || type === "ID_BACK"}
        busy={Boolean(uploads[slot]?.busy)}
        uploadError={uploads[slot]?.error ?? null}
        error={errors[errorKey]}
        disabled={!draftId}
        onAdd={(files) => addFiles(type, files, ownerIndex)}
        onRemove={removeDoc}
      />
    );
  };

  const addressFields = (
    <>
      {field("addressLine1", "Street address", {
        autoComplete: "address-line1",
      })}
      {field("addressLine2", "Address line 2", {
        optional: true,
        autoComplete: "address-line2",
      })}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("city", "Town or city", { autoComplete: "address-level2" })}
        {field("region", "County, state or region", {
          optional: true,
          autoComplete: "address-level1",
        })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("postcode", "Postcode", {
          optional: true,
          autoComplete: "postal-code",
        })}
        {countryField("country", "Country")}
      </div>
    </>
  );

  const phoneField = (
    <PhoneField
      dial={app.phoneDial}
      phone={app.phone}
      onDial={(v) => set("phoneDial", v)}
      onPhone={(v) => set("phone", v)}
      error={errors.phone}
      label="Mobile / WhatsApp"
    />
  );

  return (
    <div ref={topRef} className="scroll-mt-6">
      <Progress steps={steps} index={index} />

      {prefill && index === 0 && (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          {prefill.updating
            ? `Welcome back${prefill.firstName ? `, ${prefill.firstName}` : ""}. We've kept everything you sent before — check each step, answer the new questions and add the documents still missing.`
            : `Welcome${prefill.firstName ? `, ${prefill.firstName}` : ""}. Your sale is confirmed; these details let us issue your proforma invoice.`}
        </div>
      )}

      <div className="space-y-6">
        {step.id === "start" && (
          <Card title="Who is this KYC for?">
            <div
              className="grid gap-3 sm:grid-cols-2"
              data-field="customerType"
              tabIndex={-1}
            >
              {(
                [
                  [
                    "individual",
                    "An individual",
                    "A personal import, or a sole trader",
                  ],
                  [
                    "company",
                    "A company",
                    "A dealer, importer, fleet or other business",
                  ],
                ] as const
              ).map(([value, title, sub]) => {
                const on = app.customerType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("customerType", value)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-feedback active:scale-[0.98] active:duration-0 ${
                      on
                        ? "border-black bg-zinc-50 ring-1 ring-black"
                        : "border-black/10 hover:border-black/30"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        on
                          ? "border-black bg-black text-white"
                          : "border-black/20"
                      }`}
                      aria-hidden
                    >
                      {on && <Check size={12} />}
                    </span>
                    <span>
                      <span className="block font-semibold text-zinc-900">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm text-zinc-500">
                        {sub}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.customerType && (
              <p className="text-sm text-red-600">{errors.customerType}</p>
            )}
            {field("customerRef", "Customer reference", {
              optional: true,
              hint: "If your consultant gave you one.",
            })}
            <p className="text-sm text-zinc-500">
              It takes about ten minutes. Have your{" "}
              {company ? "company certificate" : "passport or ID"} and a recent
              utility bill or bank statement ready — photos are fine.
            </p>
          </Card>
        )}

        {step.id === "id" &&
          (company ? (
            <Card title="Your company certificate">
              {docBox(
                "CERTIFICATE_OF_INCORPORATION",
                "Certificate of incorporation",
                "Or business registration certificate. Lay it flat in good light.",
                true,
              )}
            </Card>
          ) : (
            <Card title="Your ID document">
              <Chips
                path="idDocumentType"
                label="Which ID are you uploading?"
                options={ID_DOCUMENT_TYPES.map((d) => d.label)}
                multi={false}
                value={
                  ID_DOCUMENT_TYPES.find((d) => d.value === app.idDocumentType)
                    ?.label ?? ""
                }
                onChange={(label) =>
                  set(
                    "idDocumentType",
                    ID_DOCUMENT_TYPES.find((d) => d.label === label)?.value ??
                      "",
                  )
                }
                error={errors.idDocumentType}
              />
              {app.idDocumentType && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {docBox(
                    "ID_FRONT",
                    app.idDocumentType === "passport" ? "Photo page" : "Front",
                    "All four corners visible, no glare",
                    true,
                  )}
                  {needsBack(app.idDocumentType) &&
                    docBox("ID_BACK", "Back", "All four corners visible", true)}
                </div>
              )}
            </Card>
          ))}

        {step.id === "details" &&
          (company ? (
            <>
              <Card title="Company details">
                {field("fullName", "Company name", {
                  autoComplete: "organization",
                })}
                <div className="grid gap-5 sm:grid-cols-2">
                  {field("documentNumber", "Company registration number")}
                  {countryField("nationality", "Country of incorporation")}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field("dateOfBirth", "Date of incorporation", {
                    type: "date",
                    optional: true,
                  })}
                  {field("nationalIdOrTaxNo", "Tax ID / VAT number", {
                    optional: true,
                  })}
                </div>
                {field("occupationOrBusiness", "Nature of business", {
                  optional: true,
                  placeholder: "e.g. Vehicle import and retail",
                })}
              </Card>
              <Card title="Contact">
                {field("contactPerson", "Contact person", {
                  autoComplete: "name",
                })}
                {phoneField}
                {field("email", "Email", {
                  type: "email",
                  inputMode: "email",
                  autoComplete: "email",
                })}
                {field("website", "Website", {
                  optional: true,
                  inputMode: "url",
                })}
              </Card>
              <Card title="Registered address">{addressFields}</Card>
            </>
          ) : (
            <>
              <Card title="Your details">
                {field("fullName", "Full legal name", {
                  autoComplete: "name",
                  hint: "Exactly as it appears on your ID.",
                })}
                <div className="grid gap-5 sm:grid-cols-2">
                  {countryField("nationality", "Nationality")}
                  {field("dateOfBirth", "Date of birth", {
                    type: "date",
                    autoComplete: "bday",
                  })}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field(
                    "documentNumber",
                    `${idLabel(app.idDocumentType)} number`,
                  )}
                  {field(
                    "documentExpiry",
                    `${idLabel(app.idDocumentType)} expiry date`,
                    { type: "date" },
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field("nationalIdOrTaxNo", "National ID / tax number", {
                    optional: true,
                  })}
                  {field("occupationOrBusiness", "Occupation", {
                    optional: true,
                  })}
                </div>
              </Card>
              <Card title="Contact">
                {phoneField}
                {field("email", "Email", {
                  type: "email",
                  inputMode: "email",
                  autoComplete: "email",
                })}
              </Card>
              <Card title="Your current residential address">
                {addressFields}
              </Card>
            </>
          ))}

        {step.id === "owners" && (
          <>
            <p className="text-zinc-600">
              Add every director, the person signing, and anyone who owns 25% or
              more of the company.
            </p>
            {errors.owners && (
              <p className="text-sm text-red-600">{errors.owners}</p>
            )}
            {app.owners.map((o, i) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: owners have no id; the index is their identity in the form and in the files
                key={i}
                title={`Person ${i + 1}`}
                action={
                  app.owners.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeOwner(i)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                    >
                      <Trash2 size={14} aria-hidden />
                      Remove
                    </button>
                  ) : null
                }
              >
                {docBox(
                  "OWNER_PASSPORT",
                  "Passport photo page",
                  "All four corners visible, no glare",
                  true,
                  i,
                )}
                {field(`owners.${i}.fullName`, "Full name")}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Labelled
                    id={`kyc-owners.${i}.role`}
                    label="Role"
                    error={errors[`owners.${i}.role`]}
                  >
                    <select
                      id={`kyc-owners.${i}.role`}
                      data-field={`owners.${i}.role`}
                      value={o.role}
                      onChange={(e) => set(`owners.${i}.role`, e.target.value)}
                      className={inputClass(
                        Boolean(errors[`owners.${i}.role`]),
                      )}
                    >
                      {OWNER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </Labelled>
                  {countryField(`owners.${i}.nationality`, "Nationality")}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {field(`owners.${i}.idNumber`, "Passport number")}
                  {field(`owners.${i}.ownershipPercent`, "% owned", {
                    optional: true,
                    inputMode: "decimal",
                  })}
                </div>
                <YesNo
                  path={`owners.${i}.isPep`}
                  question="Is this person a politically exposed person (PEP)?"
                  value={o.isPep}
                  onChange={(v) => set(`owners.${i}.isPep`, v)}
                />
              </Card>
            ))}
            <button
              type="button"
              onClick={() => set("owners", [...app.owners, emptyOwner()])}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white text-sm font-semibold text-zinc-800 transition-feedback hover:border-black/30 active:scale-[0.98] active:duration-0"
            >
              <Plus size={16} aria-hidden />
              Add another person
            </button>
          </>
        )}

        {step.id === "trade" && (
          <>
            <Card title="Vehicles">
              {chips(
                "trade.sourcingMarkets",
                SOURCING_MARKETS,
                true,
                "Preferred sourcing markets",
              )}
              {app.trade.sourcingMarkets.includes("Other") &&
                field("trade.sourcingMarketOther", "Which other country?")}
              {field("trade.vehicleTypes", "Vehicle types (make and model)", {
                placeholder: "e.g. Toyota Land Cruiser, Prius",
              })}
              {chips("trade.condition", VEHICLE_CONDITIONS, true, "Condition")}
              <div className="grid gap-5 sm:grid-cols-2">
                {field(
                  "trade.expectedUnitsPerYear",
                  "Expected units per year",
                  {
                    optional: true,
                    inputMode: "numeric",
                  },
                )}
                {field(
                  "trade.estimatedAnnualValueUsd",
                  "Estimated annual value (USD)",
                  { optional: true, inputMode: "numeric" },
                )}
              </div>
              {chips("trade.purpose", VEHICLE_PURPOSES, true, "Purpose")}
            </Card>
            <Card title="Shipping">
              {countryField("trade.destinationCountry", "Destination country")}
              {field("trade.portOfDischarge", "Port of discharge", {
                optional: true,
                placeholder: "e.g. Mombasa, Colombo, Dublin",
              })}
              {chips(
                "trade.shippingMethod",
                SHIPPING_METHODS,
                true,
                "Shipping method",
              )}
              {chips(
                "trade.preferredTerms",
                SHIPPING_TERMS,
                true,
                "Preferred terms",
              )}
              {field("trade.consigneeName", "Consignee name, if not you", {
                optional: true,
              })}
              {field("trade.consigneeAddress", "Consignee address", {
                optional: true,
              })}
            </Card>
          </>
        )}

        {step.id === "payment" && (
          <>
            <Card title="How you'll pay">
              {chips(
                "payment.method",
                PAYMENT_METHODS,
                false,
                "Payment method",
                false,
              )}
              {app.payment.method === "Other" &&
                field("payment.methodOther", "Please specify")}
              <div className="grid gap-5 sm:grid-cols-2">
                {field("bankName", "Paying bank")}
                {countryField("paymentCountry", "Bank country")}
              </div>
              {field("payment.accountHolderName", "Account holder name")}
              <div className="grid gap-5 sm:grid-cols-2">
                {field("payment.accountNumber", "Account number / IBAN")}
                {field("payment.swiftCode", "SWIFT / BIC code", {
                  placeholder: "e.g. BARCGB22",
                })}
              </div>
            </Card>
            <Card title="Where the money comes from">
              {chips(
                "sourcesOfFunds",
                FUNDS_SOURCES,
                true,
                "Source of funds — choose all that apply",
                false,
              )}
              {app.sourcesOfFunds.includes("Other") &&
                field(
                  "sourceOfFundsDetail",
                  "Tell us where the funds come from",
                )}
            </Card>
            <Card title="Will someone else pay on your behalf?">
              <YesNo
                path="payment.thirdParty"
                question="Will someone else pay on your behalf?"
                hideQuestion
                value={app.payment.thirdParty}
                onChange={(v) => set("payment.thirdParty", v)}
              />
              {app.payment.thirdParty === "yes" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  {field("payment.thirdPartyName", "Their name")}
                  {field(
                    "payment.thirdPartyRelationship",
                    "Relationship to you",
                  )}
                </div>
              )}
            </Card>
          </>
        )}

        {step.id === "compliance" && (
          <Card title="Most customers answer No to all five of these questions.">
            {COMPLIANCE_QUESTIONS.map((q) => {
              const ans = app.compliance[q.key];
              return (
                <div
                  key={q.key}
                  className={`rounded-2xl border p-4 ${
                    errors[`compliance.${q.key}`]
                      ? "border-red-300 bg-red-50/40"
                      : ans.answer === "yes"
                        ? "border-amber-300 bg-amber-50/40"
                        : "border-black/10"
                  }`}
                >
                  <YesNo
                    path={`compliance.${q.key}`}
                    question={q.text}
                    value={ans.answer}
                    onChange={(v) => set(`compliance.${q.key}.answer`, v)}
                    error={errors[`compliance.${q.key}`]}
                  />
                  {ans.answer === "yes" && (
                    <div className="mt-4">
                      {field(
                        `compliance.${q.key}.details`,
                        "Please give details",
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}

        {step.id === "documents" && app.customerType && (
          <Card title="Add the documents that confirm your details.">
            <p className="-mt-2 text-sm text-zinc-500">
              Photos are fine; make sure the text is sharp and nothing is cut
              off. Documents not in English need a certified translation.
            </p>
            {KYC_DOCUMENTS[app.customerType].map((d) =>
              docBox(d.type, d.label, d.help, d.required),
            )}
          </Card>
        )}

        {step.id === "sign" && (
          <>
            <Card title="Check your details">
              <Summary app={app} docs={presence} />
            </Card>
            <Card title="Declaration">
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
                {KYC_APPLICATION_DECLARATIONS.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
              <label
                className={`flex cursor-pointer gap-3 rounded-2xl border p-4 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/20 ${
                  errors.declarationAccepted
                    ? "border-red-300 bg-red-50/40"
                    : app.declarationAccepted
                      ? "border-black/20 bg-zinc-50"
                      : "border-black/10"
                }`}
              >
                <input
                  type="checkbox"
                  data-field="declarationAccepted"
                  checked={app.declarationAccepted}
                  onChange={(e) => set("declarationAccepted", e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-black"
                />
                <span className="text-sm font-semibold text-zinc-900">
                  I confirm all of the above
                  {company ? " on behalf of the company" : ""}.
                </span>
              </label>
              {errors.declarationAccepted && (
                <p className="text-sm text-red-600">
                  {errors.declarationAccepted}
                </p>
              )}
            </Card>
            <Card title="Sign">
              {field(
                "signatoryName",
                company ? "Name of authorised signatory" : "Your full name",
                { autoComplete: "name" },
              )}
              <SignaturePad
                value={signature}
                onChange={(v) => {
                  setSignature(v);
                  if (v) setErrors((prev) => withoutKey(prev, "signature"));
                }}
                error={errors.signature}
              />
            </Card>
            <p className="flex items-start gap-2 text-sm text-zinc-500">
              <Lock size={15} className="mt-0.5 shrink-0" aria-hidden />
              Your details are seen only by the Providence Auto team, handled
              under UK GDPR and the Data Protection Act 2018, and used only to
              verify your account.
            </p>
          </>
        )}
      </div>

      {failure && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {failure}
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-black/5 bg-zinc-50/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex gap-3">
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={Boolean(sending)}
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-sm font-semibold text-zinc-800 transition-feedback hover:border-black/30 active:scale-[0.98] active:duration-0 disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={Boolean(sending) || !draftId}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-black px-8 text-sm font-semibold text-white transition-feedback hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 active:scale-[0.98] active:duration-0 disabled:cursor-wait disabled:bg-zinc-700 sm:flex-none"
          >
            {sending && (
              <Loader2 size={16} className="animate-spin" aria-hidden />
            )}
            {sending ?? (isLast ? "Send my details" : "Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}

function idLabel(type: string): string {
  return (
    ID_DOCUMENT_TYPES.find((d) => d.value === type)?.label ?? "ID document"
  );
}

// ── Pieces ─────────────────────────────────────────────────────────────────

function Progress({
  steps,
  index,
}: {
  steps: { id: KycStepId; title: string }[];
  index: number;
}) {
  const pct = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0;
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-zinc-900">
          {steps[index]?.title}
        </span>
        <span className="text-zinc-500">
          Step {index + 1} of {steps.length}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={index + 1}
        aria-label="Progress"
      >
        <div
          className="h-full origin-left rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
          style={{ transform: `scaleX(${Math.max(pct, 4) / 100})` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_24px_60px_rgba(2,6,23,0.05)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        {action}
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function Labelled({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
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
      {(error || hint) && (
        <p
          id={`${id}-message`}
          className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-zinc-500"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function TextField({
  path,
  label,
  value,
  onChange,
  error,
  optional,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  hint,
}: {
  path: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  hint?: string;
}) {
  const id = `kyc-${path}`;
  return (
    <Labelled
      id={id}
      label={label}
      optional={optional}
      hint={hint}
      error={error}
    >
      <input
        id={id}
        data-field={path}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={type === "date" ? undefined : LIMITS.detail}
        min={type === "date" ? "1900-01-01" : undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || hint ? `${id}-message` : undefined}
        className={inputClass(Boolean(error))}
      />
    </Labelled>
  );
}

function CountrySelect({
  id,
  path,
  value,
  onChange,
  invalid,
}: {
  id: string;
  path: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
}) {
  return (
    <select
      id={id}
      data-field={path}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid || undefined}
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

function PhoneField({
  dial,
  phone,
  onDial,
  onPhone,
  error,
  label,
}: {
  dial: string;
  phone: string;
  onDial: (v: string) => void;
  onPhone: (v: string) => void;
  error?: string;
  label: string;
}) {
  return (
    <Labelled id="kyc-phone" label={label} error={error}>
      <div
        className={`flex h-12 overflow-hidden rounded-xl border transition-[border-color,box-shadow] focus-within:border-sky-500 focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)] ${
          error ? "border-red-400 bg-red-50/40" : "border-black/10 bg-white"
        }`}
      >
        <select
          aria-label="Country code"
          value={dial}
          onChange={(e) => onDial(e.target.value)}
          className="shrink-0 cursor-pointer border-r border-black/10 bg-zinc-50 px-3 text-sm font-semibold text-zinc-700 focus:outline-none"
        >
          <option value="">Code</option>
          {DIAL_CODES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          id="kyc-phone"
          data-field="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          maxLength={LIMITS.phone}
          aria-invalid={Boolean(error) || undefined}
          className="w-0 min-w-0 flex-1 bg-transparent px-4 text-base text-black focus:outline-none"
        />
      </div>
    </Labelled>
  );
}

function Chips({
  path,
  label,
  optional,
  options,
  multi,
  value,
  onChange,
  error,
}: {
  path: string;
  label: string;
  optional?: boolean;
  options: readonly string[];
  multi: boolean;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  error?: string;
}) {
  const selected = (o: string) =>
    multi ? (value as string[]).includes(o) : value === o;
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-zinc-800">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-zinc-400">Optional</span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2" data-field={path} tabIndex={-1}>
        {options.map((o) => {
          const on = selected(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => {
                if (!multi) return onChange(o);
                const list = value as string[];
                onChange(on ? list.filter((x) => x !== o) : [...list, o]);
              }}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-feedback active:scale-[0.97] active:duration-0 ${
                on
                  ? "border-black bg-black text-white"
                  : error
                    ? "border-red-300 bg-white text-zinc-700"
                    : "border-black/10 bg-white text-zinc-700 hover:border-black/30"
              }`}
            >
              {on && <Check size={14} aria-hidden />}
              {o}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

function YesNo({
  path,
  question,
  value,
  onChange,
  error,
  hideQuestion,
}: {
  path: string;
  question: string;
  value: string;
  onChange: (v: "yes" | "no") => void;
  error?: string;
  hideQuestion?: boolean;
}) {
  return (
    <fieldset>
      <legend
        className={
          hideQuestion
            ? "sr-only"
            : "mb-3 text-sm font-medium leading-relaxed text-zinc-900"
        }
      >
        {question}
      </legend>
      <div className="flex gap-2" data-field={path} tabIndex={-1}>
        {(["no", "yes"] as const).map((v) => {
          const on = value === v;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(v)}
              className={`inline-flex h-10 min-w-20 items-center justify-center rounded-full border px-5 text-sm font-semibold transition-feedback active:scale-[0.97] active:duration-0 ${
                on
                  ? v === "yes"
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-black bg-black text-white"
                  : "border-black/10 bg-white text-zinc-700 hover:border-black/30"
              }`}
            >
              {v === "no" ? "No" : "Yes"}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

function DocBox({
  field,
  label,
  help,
  required,
  files,
  onFile,
  single,
  busy,
  uploadError,
  error,
  disabled,
  onAdd,
  onRemove,
}: {
  field: string;
  label: string;
  help: string;
  required: boolean;
  files: UploadedDoc[];
  onFile: number;
  single: boolean;
  busy: boolean;
  uploadError: string | null;
  error?: string;
  disabled: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (uid: string) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const has = files.length > 0 || onFile > 0;
  const full = single ? files.length >= 1 : files.length >= MAX_FILES_PER_DOC;
  const pick = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (picked.length) onAdd(single ? picked.slice(0, 1) : picked);
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };
  const off = disabled || busy ? "pointer-events-none opacity-60" : "";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        error
          ? "border-red-300 bg-red-50/40"
          : has
            ? "border-emerald-200 bg-emerald-50/30"
            : "border-black/10"
      }`}
      data-field={field}
      tabIndex={-1}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{label}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{help}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            has
              ? "bg-emerald-100 text-emerald-700"
              : required
                ? "bg-sky-100 text-sky-700"
                : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {has ? "Added" : required ? "Required" : "Optional"}
        </span>
      </div>

      {onFile > 0 && files.length === 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-700">
          <CheckCircle2 size={15} aria-hidden />
          Already received. Add a new one only if it has changed.
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {files.map((f) => (
            <li
              key={f.uid}
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-zinc-50"
            >
              {f.preview ? (
                // biome-ignore lint/performance/noImgElement: a local object URL, nothing to optimise
                <img
                  src={f.preview}
                  alt={label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-1 px-1 text-center text-[10px] text-zinc-600">
                  <FileText size={18} className="text-zinc-400" aria-hidden />
                  <span className="line-clamp-2 break-all">{f.name}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(f.uid)}
                aria-label={`Remove ${f.name}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-sm ring-1 ring-black/10"
              >
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label
            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-black px-4 text-sm font-semibold text-white transition-feedback hover:bg-zinc-800 active:scale-[0.97] active:duration-0 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/30 sm:hidden ${off}`}
          >
            <Camera size={15} aria-hidden />
            Take photo
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => pick(e.target.files)}
            />
          </label>
          <label
            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-zinc-800 transition-feedback hover:border-black/30 active:scale-[0.97] active:duration-0 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-500/30 ${off}`}
          >
            <Upload size={15} aria-hidden />
            {files.length || onFile ? "Add another" : "Upload"}
            <input
              ref={fileRef}
              type="file"
              accept={ID_FILE_ACCEPT}
              multiple={!single}
              className="sr-only"
              aria-label={label}
              onChange={(e) => pick(e.target.files)}
            />
          </label>
          {busy && (
            <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
              <Loader2 size={15} className="animate-spin" aria-hidden />
              Uploading…
            </span>
          )}
        </div>
      )}
      <p className="mt-2 text-xs text-zinc-400">
        JPG, PNG, WebP or PDF, up to 10 MB
      </p>
      {(uploadError || error) && (
        <p className="mt-1.5 text-sm text-red-600">{uploadError ?? error}</p>
      )}
    </div>
  );
}

function SignaturePad({
  value,
  onChange,
  error,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  error?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<[number, number] | null>(null);
  const initial = useRef(value);

  // Size the canvas to its box (DPR capped at 2) and redraw what was signed.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0b2545";
    if (initial.current) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, box.width, box.height);
      img.src = initial.current;
    }
  }, []);

  const point = (
    e: React.PointerEvent<HTMLCanvasElement>,
  ): [number, number] => {
    const box = e.currentTarget.getBoundingClientRect();
    return [e.clientX - box.left, e.clientY - box.top];
  };

  return (
    <div data-field="signature" tabIndex={-1}>
      <span className="mb-2 block text-sm font-medium text-zinc-800">
        Signature
      </span>
      <div
        className={`relative h-44 overflow-hidden rounded-2xl border bg-white ${
          error ? "border-red-400" : "border-black/15"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-6 bottom-10 border-b border-dashed border-black/15" />
        {!value && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
            Sign here with your finger or mouse
          </span>
        )}
        <canvas
          ref={canvasRef}
          aria-label="Signature pad"
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={(e) => {
            drawing.current = true;
            last.current = point(e);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drawing.current || !last.current) return;
            const ctx = e.currentTarget.getContext("2d");
            const p = point(e);
            ctx?.beginPath();
            ctx?.moveTo(...last.current);
            ctx?.lineTo(...p);
            ctx?.stroke();
            last.current = p;
          }}
          onPointerUp={(e) => {
            if (!drawing.current) return;
            drawing.current = false;
            onChange(e.currentTarget.toDataURL("image/png"));
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const c = canvasRef.current;
            const ctx = c?.getContext("2d");
            if (c && ctx) {
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(0, 0, c.width, c.height);
              ctx.restore();
            }
            onChange(null);
          }}
          className="text-sm font-medium text-zinc-600 hover:underline"
        >
          Clear signature
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function Summary({
  app,
  docs,
}: {
  app: KycApplicationInput;
  docs: KycDocPresence;
}) {
  const company = app.customerType === "company";
  const fileCount =
    Object.values(docs.byType).reduce((a, b) => a + (b ?? 0), 0) +
    Object.values(docs.ownerPassports).reduce((a, b) => a + b, 0);
  const rows: [string, string][] = [
    [company ? "Company" : "Name", app.fullName],
    [company ? "Registration no." : "Document no.", app.documentNumber],
    [company ? "Incorporated in" : "Nationality", app.nationality],
    ["Mobile", `${app.phoneDial} ${app.phone}`.trim()],
    ["Email", app.email],
    [
      "Address",
      [app.addressLine1, app.city, app.country].filter(Boolean).join(", "),
    ],
    ...(company
      ? ([
          [
            "Directors & owners",
            app.owners
              .map((o) => o.fullName)
              .filter(Boolean)
              .join(", "),
          ],
        ] as [string, string][])
      : []),
    ["Vehicles", app.trade.vehicleTypes],
    [
      "Destination",
      [app.trade.portOfDischarge, app.trade.destinationCountry]
        .filter(Boolean)
        .join(", "),
    ],
    [
      "Paying bank",
      [app.bankName, app.paymentCountry].filter(Boolean).join(", "),
    ],
    [
      "Account no.",
      app.payment.accountNumber
        ? `•••• ${app.payment.accountNumber.replace(/\s/g, "").slice(-4)}`
        : "",
    ],
    ["Documents", `${fileCount} file${fileCount === 1 ? "" : "s"}`],
  ];
  return (
    <dl className="divide-y divide-black/5 text-sm">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[120px_1fr] gap-3 py-2 sm:grid-cols-[160px_1fr]"
        >
          <dt className="text-zinc-500">{k}</dt>
          <dd className="break-words font-medium text-zinc-900">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
