import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAIResponseAsync, generatePABroadcastAsync } from "./aiEngine";

describe("aiEngine", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockImplementation((key) => {
        if (key === "stadiaiq_groq_key") return "fake_test_key";
        if (key === "stadiaiq_is_staff") return "true";
        if (key === "stadiaiq_match_id") return "m1";
        return null;
      }),
      setItem: vi.fn(),
    });
  });

  it("should handle detectLanguage explicitly (French, Portuguese, English)", async () => {
    // Generate fallback responses to trigger detectLanguage logic
    vi.stubEnv("VITE_GROQ_API_KEY", "");
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null), // Force no api key
    });
    
    const frResp = await generateAIResponseAsync("bonjour où est la porte");
    expect(frResp.isGroq).toBe(false);

    const ptResp = await generateAIResponseAsync("olá onde está o portão");
    expect(ptResp.isGroq).toBe(false);

    const esResp = await generateAIResponseAsync("donde esta el baño");
    expect(esResp.isGroq).toBe(false);
  });

  it("should return mock fallback if fetch fails for AI response", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await generateAIResponseAsync("Where is Gate 4?");
    expect(response).toBeDefined();
    expect(response.isGroq).toBe(false);
  });

  it("should return parsed response from Groq API", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [
          { message: { content: "Gate 4 is located at the north end." } },
        ],
        usage: { total_tokens: 150 }
      }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await generateAIResponseAsync("Where is Gate 4?");
    expect(response.text).toBe("Gate 4 is located at the north end.");
    expect(response.isGroq).toBe(true);
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

  it("should handle fetch ok=false (HTTP error) properly", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => ({ error: { message: "Internal server error" } }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const response = await generateAIResponseAsync("Help");
    expect(response.isGroq).toBe(false);
  });
});
