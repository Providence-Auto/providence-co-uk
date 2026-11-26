// Gemini generateContent with model fallback, shared by the Sourcing & Profit
// Analyzer and the auction-sheet translator. Server-side only: it takes the key.

// Models tried in order. gemini-2.5-flash is best but intermittently returns
// 503 (overloaded) on the free tier, and gemini-2.0-flash is quota-capped (429),
// so we fall back to the lite models, which are reliably available and still
// multimodal. All support image input + responseSchema.
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Call Gemini generateContent with the given request body, trying each model in
// turn and retrying once on a transient 503. Returns the first response's text,
// or a structured failure with the last status. Centralises the resilience so
// both extraction and the verdict survive an overloaded model.
export async function generateGeminiText(
  key: string,
  body: unknown,
): Promise<
  | { ok: true; text: string; tokens: number; model: string }
  | { ok: false; status: number; message: string }
> {
  let lastStatus = 0;
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let res: Response;
      try {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
          },
        );
      } catch (e) {
        lastStatus = 0;
        console.error(`Gemini ${model} network error:`, e);
        break; // try next model
      }

      if (res.ok) {
        const json = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
          usageMetadata?: { totalTokenCount?: number };
        };
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        // Token count is returned by the API for free — no extra cost to read.
        const tokens = json.usageMetadata?.totalTokenCount ?? 0;
        if (text) return { ok: true, text, tokens, model };
        break; // empty content — try next model
      }

      lastStatus = res.status;
      console.error(`Gemini ${model} HTTP ${res.status}`);
      // 503 = transient overload → quick retry on the same model; otherwise
      // (e.g. 429 quota) move straight to the next model.
      if (res.status === 503 && attempt === 0) {
        await sleep(700);
        continue;
      }
      break;
    }
  }
  return {
    ok: false,
    status: lastStatus,
    message: `Gemini unavailable (last status ${lastStatus}). All models busy — try again, or enter details manually.`,
  };
}
