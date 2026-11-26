"use client";

import { ExternalLink, Pencil, Plus, Search, Unlink } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createStockCarPage,
  getCarPages,
  setStockCarPage,
} from "@/actions/stock-actions";
import { StockThumb } from "@/components/stock/StockThumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { StockCarView } from "@/lib/stock";
import { rankCarPages, type StockPage } from "@/lib/stock-page";

/**
 * Links one stock car to a car page: pick one from the list, or create one.
 * Its hero image becomes the car's thumbnail on the stock list.
 */
export default function CarPagePicker({
  car,
  onClose,
  onSaved,
}: {
  car: StockCarView;
  onClose: () => void;
  onSaved: (car: StockCarView) => void;
}) {
  const [pages, setPages] = useState<StockPage[] | null>(null);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let current = true;
    getCarPages()
      .then((list) => current && setPages(list))
      .catch(() => current && setPages([]));
    return () => {
      current = false;
    };
  }, []);

  const shown = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return rankCarPages(car, pages ?? []).filter(({ page }) =>
      terms.every((t) =>
        `${page.year} ${page.title}`.toLowerCase().includes(t),
      ),
    );
  }, [car, pages, query]);

  const link = (pageId: string | null) =>
    startTransition(async () => {
      const result = await setStockCarPage(car.id, pageId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      onSaved(result.car);
      toast.success(pageId ? "Car page linked" : "Car page unlinked");
      onClose();
    });

  const create = () =>
    startTransition(async () => {
      const result = await createStockCarPage(car.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      onSaved(result.car);
      toast.success("Draft car page created and linked");
      window.location.assign(result.editPath);
    });

  const name = `${car.year} ${car.make} ${car.model}`;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Car page for the {name}</DialogTitle>
          <DialogDescription>
            The page&rsquo;s hero image becomes this car&rsquo;s thumbnail.
            Customers see it once the page is live.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {car.page && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <StockThumb src={car.page.image} alt="" />
              <p className="min-w-0 flex-1 text-sm">
                <span className="block font-semibold text-zinc-900">
                  {car.page.title}
                </span>
                <span className="text-xs text-zinc-600">
                  {car.page.live ? "Live" : "Not live yet"}
                </span>
              </p>
              <a
                href={car.page.path}
                target="_blank"
                rel="noreferrer"
                aria-label="Open the car page"
                className="rounded-md p-2 text-zinc-600 transition-feedback hover:bg-white"
              >
                <ExternalLink size={15} aria-hidden />
              </a>
              <a
                href={`/admin/specs?editId=${car.page.id}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Edit the car page"
                className="rounded-md p-2 text-zinc-600 transition-feedback hover:bg-white"
              >
                <Pencil size={15} aria-hidden />
              </a>
              <button
                type="button"
                disabled={pending}
                onClick={() => link(null)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-feedback hover:text-red-700 disabled:opacity-50"
              >
                <Unlink size={14} aria-hidden />
                Unlink
              </button>
            </div>
          )}
          <label className="relative block">
            <span className="sr-only">Search car pages</span>
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search car pages"
              className="h-10 w-full rounded-lg border border-zinc-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </label>
        </div>

        <ul className="min-h-24 divide-y divide-zinc-100 overflow-y-auto rounded-xl border border-zinc-200">
          {pages === null && (
            <li className="px-4 py-6 text-center text-sm text-zinc-500">
              Loading car pages…
            </li>
          )}
          {pages !== null && shown.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-zinc-500">
              No car page matches.
            </li>
          )}
          {shown.map(({ page, suggested }) => (
            <li key={page.id}>
              <button
                type="button"
                disabled={pending || page.id === car.page?.id}
                onClick={() => link(page.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-feedback hover:bg-zinc-50 disabled:opacity-60"
              >
                {page.image ? (
                  <StockThumb src={page.image} alt="" />
                ) : (
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] text-zinc-400">
                    No photo
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-zinc-900">
                    {page.title}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {[
                      page.year,
                      page.live ? "Live" : "Draft",
                      suggested && "Looks like this car",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="text-sm font-semibold text-sky-700">
                  {page.id === car.page?.id ? "Linked" : "Link"}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {!car.page && (
          <button
            type="button"
            disabled={pending}
            onClick={create}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-feedback hover:bg-zinc-700 active:scale-[0.98] active:duration-0 disabled:opacity-50"
          >
            <Plus size={15} aria-hidden />
            Create a car page and link it
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
