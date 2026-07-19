import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAIResponseAsync, generatePABroadcastAsync } from "./aiEngine";

describe("aiEngine", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  it("should return mock fallback if fetch fails for AI response", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await generateAIResponseAsync("Where is Gate 4?");
    expect(response).toBeDefined();
    expect(typeof response.text).toBe("string");
    expect(response.text.includes("Could not reach live telemetry API")).toBe(
      true,
    );
  });

  it("should return parsed response from Groq API", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: "Gate 4 is located at the north end." } },
        ],
      }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await generateAIResponseAsync("Where is Gate 4?");
    expect(response.text).toBe("Gate 4 is located at the north end.");
  });

  it("should return fallback if PA broadcast fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await generatePABroadcastAsync(
      { type: "Gate 4", location: "Gate 4" },
      "en",
      "metlife",
    );
    expect(response).toBeDefined();
    expect(response.isGroq).toBe(false);
    expect(response.script.includes("Gate 4")).toBe(true);
  });

  it("should return generated PA broadcast from Groq API", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: "Attention fans, please proceed to Gate 4." } },
        ],
      }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await generatePABroadcastAsync(
      { type: "Gate 4", location: "Gate 4" },
      "en",
      "metlife",
    );
    expect(response).toBeDefined();
    expect(response.isGroq).toBe(true);
    expect(response.script).toBe("Attention fans, please proceed to Gate 4.");
  });
});
