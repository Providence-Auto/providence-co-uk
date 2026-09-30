"use client";

import { AlertCircle, ChevronDown, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DualRangeSlider from "@/components/DualRangeSlider";
import Combobox from "@/components/dealer/Combobox";
import { Chip, Field, inputClass, Segmented } from "@/components/dealer/fields";
import {
  budgetDigits,
  budgetDisplayValue,
  currencyOptions,
  formatBudget,
  getCurrency,
} from "@/lib/currencies";
import type { DealerCarInput, FieldErrors } from "@/lib/dealer-inquiry";
import {
  CAR_MAKES,
  conditionLabel,
  fetchModelsForMake,
  formatMileage,
  IMPORT_TIMELINES,
  MILEAGE_MAX,
  MILEAGE_MIN,
  MILEAGE_STEP,
  YEAR_PRESETS,
} from "@/lib/vehicle-inquiry";

const MAKE_OPTIONS = CAR_MAKES.map((make) => ({ value: make, label: make }));

/** One line that says which car this is, for the collapsed card. */
function carSummary(car: DealerCarInput): string {
  const title = [car.make, car.model].filter(Boolean).join(" ");
  const parts = [
    title,
    conditionLabel(car.condition),
    car.condition === "Used" ? car.yearRange : "",
    car.budgetAmount
      ? formatBudget(Number(car.budgetAmount), car.budgetCurrency)
      : "",
  ].filter(Boolean);
  return parts.join(" · ");
}

/**
 * One car in a dealer's request — the same questions the B2C form asks about a
 * car, laid out as a card that collapses to a one-line summary so a request
 * for five cars stays readable.
 */
export default function DealerCarCard({
  index,
  car,
  errors,
  open,
  canRemove,
  preferredCurrency,
  onToggle,
  onChange,
  onRemove,
}: {
  index: number;
  car: DealerCarInput;
  errors: FieldErrors;
  open: boolean;
  canRemove: boolean;
  /** The dealer's own country's currency, floated to the top of the picker. */
  preferredCurrency: string;
  onToggle: () => void;
  onChange: (patch: Partial<DealerCarInput>) => void;
  onRemove: () => void;
}) {
  const prefix = `car-${index}`;

  // Model names for the chosen make. Best effort: when the lookup fails the
  // model box still takes whatever the dealer types.
  //
  // The list is stored with the make it was fetched for, and only shown while
  // that is still the car's make. Otherwise, after switching Toyota → Nissan,
  // the Toyota list would sit in the model box until Nissan's arrived — and a
  // "Nissan Corolla" could be picked from it.
  const [lookup, setLookup] = useState<{
    make: string;
    models: string[];
  } | null>(null);
  const models = lookup && lookup.make === car.make ? lookup.models : [];
  const loadingModels = Boolean(car.make) && lookup?.make !== car.make;

  useEffect(() => {
    if (!car.make) return;
    const make = car.make;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const found = await fetchModelsForMake(make);
        if (!cancelled) setLookup({ make, models: found });
      } catch {
        if (!cancelled) setLookup({ make, models: [] });
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [car.make]);

  const modelOptions = useMemo(
    () => models.map((model) => ({ value: model, label: model })),
    [models],
  );
  const currencyChoices = useMemo(
    () => currencyOptions(preferredCurrency),
    [preferredCurrency],
  );

  const hasErrors = Object.keys(errors).length > 0;
  const summary = carSummary(car);
  const symbol = getCurrency(car.budgetCurrency)?.symbol ?? "";

  return (
    <div
      className={`rounded-[1.5rem] border bg-white transition-[border-color,box-shadow] ${
        hasErrors
          ? "border-red-300"
          : open
            ? "border-black/10 shadow-[0_18px_40px_rgba(2,6,23,0.07)]"
            : "border-black/10"
      }`}
    >
      <div className="flex items-center gap-2 p-2 pl-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${prefix}-body`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-black">
              Car {index + 1}
            </span>
            <span className="block truncate text-sm text-zinc-500">
              {summary || "Make, model and budget"}
            </span>
          </span>
          {hasErrors && !open && (
            <AlertCircle
              size={18}
              className="shrink-0 text-red-500"
              aria-label="This car needs attention"
            />
          )}
          <ChevronDown
            size={18}
            aria-hidden
            className={`shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove car ${index + 1}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>

      {open && (
        <div
          id={`${prefix}-body`}
          className="space-y-6 border-t border-black/5 p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id={`${prefix}-make`} label="Make" error={errors.make}>
              <Combobox
                id={`${prefix}-make`}
                labelledBy={`${prefix}-make-label`}
                options={MAKE_OPTIONS}
                value={car.make}
                onChange={(make) =>
                  onChange(make === car.make ? { make } : { make, model: "" })
                }
                placeholder="Search makes"
                invalid={Boolean(errors.make)}
                describedBy={errors.make ? `${prefix}-make-message` : undefined}
                allowCustom
              />
            </Field>
            <Field
              id={`${prefix}-model`}
              label="Model"
              error={errors.model}
              hint={
                car.make && !loadingModels && models.length === 0
                  ? "Type the model name as you know it."
                  : undefined
              }
            >
              <Combobox
                id={`${prefix}-model`}
                labelledBy={`${prefix}-model-label`}
                options={modelOptions}
                value={car.model}
                onChange={(model) => onChange({ model })}
                placeholder={
                  car.make ? "Search or type a model" : "Pick a make first"
                }
                disabled={!car.make}
                loading={loadingModels}
                invalid={Boolean(errors.model)}
                describedBy={`${prefix}-model-message`}
                emptyText="Type the model name"
                allowCustom
              />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-800">
              Condition
            </legend>
            <Segmented
              name={`${prefix}-condition`}
              options={[
                { value: "New", label: "Brand New" },
                { value: "Used", label: "Pre-Owned" },
              ]}
              value={
                car.condition === "New" || car.condition === "Used"
                  ? car.condition
                  : null
              }
              onChange={(condition) => onChange({ condition })}
              invalid={Boolean(errors.condition)}
            />
            {errors.condition && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {errors.condition}
              </p>
            )}
          </fieldset>

          {car.condition === "Used" && (
            <div className="grid grid-cols-1 gap-6 rounded-2xl bg-zinc-50/80 p-4 sm:p-5">
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-zinc-800">
                  Model year
                </legend>
                <div className="flex flex-wrap gap-2">
                  {YEAR_PRESETS.map((preset) => (
                    <Chip
                      key={preset.label}
                      selected={car.yearRange === preset.label}
                      onClick={() => onChange({ yearRange: preset.label })}
                    >
                      {preset.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              <div>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-800">Mileage</p>
                  <p className="text-sm tabular-nums text-zinc-600">
                    {formatMileage(car.mileageMin)} –{" "}
                    {formatMileage(car.mileageMax)} mi
                  </p>
                </div>
                <DualRangeSlider
                  min={MILEAGE_MIN}
                  max={MILEAGE_MAX}
                  step={MILEAGE_STEP}
                  valueMin={car.mileageMin}
                  valueMax={car.mileageMax}
                  onChange={(mileageMin, mileageMax) =>
                    onChange({ mileageMin, mileageMax })
                  }
                  minLabel={`Car ${index + 1} minimum mileage`}
                  maxLabel={`Car ${index + 1} maximum mileage`}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id={`${prefix}-exterior`}
              label="Exterior colour"
              optional
              error={errors.exteriorColor}
            >
              <input
                id={`${prefix}-exterior`}
                value={car.exteriorColor}
                onChange={(e) => onChange({ exteriorColor: e.target.value })}
                placeholder="e.g. Pearl white"
                maxLength={80}
                className={inputClass(Boolean(errors.exteriorColor), "h-13")}
              />
            </Field>
            <Field
              id={`${prefix}-interior`}
              label="Interior colour"
              optional
              error={errors.interiorColor}
            >
              <input
                id={`${prefix}-interior`}
                value={car.interiorColor}
                onChange={(e) => onChange({ interiorColor: e.target.value })}
                placeholder="e.g. Black leather"
                maxLength={80}
                className={inputClass(Boolean(errors.interiorColor), "h-13")}
              />
            </Field>
          </div>

          <div>
            <p
              id={`${prefix}-budget-label`}
              className="mb-2 text-sm font-medium text-zinc-800"
            >
              Your budget for this car
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <Combobox
                id={`${prefix}-currency`}
                labelledBy={`${prefix}-budget-label`}
                options={currencyChoices}
                value={car.budgetCurrency}
                onChange={(budgetCurrency) => onChange({ budgetCurrency })}
                placeholder="Currency"
                invalid={Boolean(errors.budgetCurrency)}
              />
              <div className="relative">
                {symbol && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-zinc-500"
                  >
                    {symbol}
                  </span>
                )}
                <input
                  id={`${prefix}-budget`}
                  aria-labelledby={`${prefix}-budget-label`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={budgetDisplayValue(car.budgetAmount)}
                  onChange={(e) =>
                    onChange({ budgetAmount: budgetDigits(e.target.value) })
                  }
                  placeholder="e.g. 25,000"
                  aria-invalid={Boolean(errors.budgetAmount) || undefined}
                  className={inputClass(
                    Boolean(errors.budgetAmount),
                    `h-13 tabular-nums ${symbol ? "pl-9" : ""}`,
                  )}
                />
              </div>
            </div>
            {(errors.budgetCurrency || errors.budgetAmount) && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {errors.budgetAmount || errors.budgetCurrency}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-zinc-800">
              When do you want to import it?
            </legend>
            <div className="flex flex-wrap gap-2">
              {IMPORT_TIMELINES.map((option) => (
                <Chip
                  key={option}
                  selected={car.importTimeline === option}
                  onClick={() => onChange({ importTimeline: option })}
                >
                  {option}
                </Chip>
              ))}
            </div>
            {errors.importTimeline && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {errors.importTimeline}
              </p>
            )}
          </fieldset>

          <Field
            id={`${prefix}-specs`}
            label="Specification requests"
            optional
            error={errors.specs}
          >
            <textarea
              id={`${prefix}-specs`}
              value={car.specs}
              onChange={(e) => onChange({ specs: e.target.value })}
              placeholder="e.g. Hybrid, 7 seats, sunroof, grade 4.5 or better"
              rows={3}
              maxLength={1000}
              className={inputClass(Boolean(errors.specs), "resize-none py-3")}
            />
          </Field>
        </div>
      )}
    </div>
  );
}
