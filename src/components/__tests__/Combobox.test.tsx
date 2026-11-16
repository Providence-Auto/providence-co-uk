// The dealer form's combobox: what happens to typed text when the dealer
// leaves the field, which is where free-text entries used to be lost.

import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Combobox from "@/components/dealer/Combobox";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const OPTIONS = [
  { value: "Corolla", label: "Corolla" },
  { value: "Prius", label: "Prius" },
];

let container: HTMLDivElement;
let root: Root;
let chosen: string;

function Harness({ allowCustom }: { allowCustom: boolean }) {
  const [value, setValue] = useState("");
  chosen = value;
  return (
    <div>
      <Combobox
        id="model"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        placeholder="Model"
        allowCustom={allowCustom}
      />
      <input id="next-field" />
    </div>
  );
}

const input = () => container.querySelector<HTMLInputElement>("#model");
const listbox = () => container.querySelector('[role="listbox"]');

async function mount(allowCustom: boolean) {
  await act(async () => root.render(<Harness allowCustom={allowCustom} />));
}

async function type(text: string) {
  const el = input();
  if (!el) throw new Error("no input");
  await act(async () => {
    el.focus();
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(el, text);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  chosen = "";
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("Combobox — leaving the field", () => {
  it("keeps a typed model on Tab when free text is allowed", async () => {
    await mount(true);
    await type("Aqua G");
    await act(async () => {
      input()?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
    });
    expect(chosen).toBe("Aqua G");
    expect(listbox()).toBeNull();
  });

  it("keeps it on a press elsewhere on the page", async () => {
    await mount(true);
    await type("Note e-Power");
    await act(async () => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });
    expect(chosen).toBe("Note e-Power");
  });

  it("uses the listed spelling when the typed text matches an option", async () => {
    await mount(true);
    await type("prius");
    await act(async () => {
      input()?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
    });
    expect(chosen).toBe("Prius");
  });

  it("closes when focus moves to another field without a Tab", async () => {
    await mount(true);
    await type("Hilux");
    const next = container.querySelector<HTMLInputElement>("#next-field");
    await act(async () => {
      input()?.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: next }),
      );
    });
    expect(listbox()).toBeNull();
    expect(chosen).toBe("Hilux");
  });

  it("discards a half-typed search in a strict picker", async () => {
    await mount(false);
    await type("Coro");
    await act(async () => {
      input()?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
    });
    expect(chosen).toBe("");
  });
});
