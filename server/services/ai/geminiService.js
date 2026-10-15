import getGeminiClient from "../../configs/gemini.js";
const getModelName = () => {
  const model = process.env.GEMINI_MODEL?.trim();

  if (!model) {
    throw new Error("GEMINI_MODEL environment variable is not configured");
  }

  return model;
};

/**
 * Generate text using the configured Gemini model.
 *
 * @param {object} params
 * @param {string} params.contents - The input sent to Gemini.
 * @param {string} params.systemInstruction - Server-controlled instructions.
 * @param {object} [params.config] - Additional Gemini generation settings.
 * @returns {Promise<{text: string, usageMetadata: object | undefined}>}
 */
export const generateText = async ({
  contents,
  systemInstruction,
  config = {},
}) => {
  if (typeof contents !== "string" || !contents.trim()) {
    throw new TypeError("Gemini contents must be a non-empty string");
  }

  if (typeof systemInstruction !== "string" || !systemInstruction.trim()) {
    throw new TypeError("A system instruction is required");
  }

  const gemini = getGeminiClient();
  const startedAt = Date.now();

  try {
    const response = await gemini.models.generateContent({
      model: getModelName(),
      contents,
      config: {
        ...config,
        systemInstruction,
      },
    });

    const latencyMs = Date.now() - startedAt;
    const text = response.text?.trim();
    const usageMetadata = response.usageMetadata;

    console.info("GEMINI_REQUEST_SUCCESS", {
      model: getModelName(),
      latencyMs,
      promptTokenCount: usageMetadata?.promptTokenCount,
      candidatesTokenCount: usageMetadata?.candidatesTokenCount,
      totalTokenCount: usageMetadata?.totalTokenCount,
    });

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return {
      text,
      usageMetadata,
    };
  } catch (error) {
    console.error("GEMINI_REQUEST_FAILURE", {
      latencyMs: Date.now() - startedAt,
      status: error.status,
    });

    throw error;
  }
};
