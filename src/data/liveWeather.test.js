import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchLiveWeather } from "./liveWeather";

describe("liveWeather", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch live weather successfully", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 25,
          weather_code: 1,
          wind_speed_10m: 10,
          relative_humidity_2m: 60,
        },
      }),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const weather = await fetchLiveWeather("metlife");
    expect(weather).toBeDefined();
    expect(weather.temp).toBe(25);
    expect(weather.condition).toBe("Mainly Clear");
    expect(weather.windSpeed).toBe(10);
    expect(weather.humidity).toBe(60);
    expect(weather.isLive).toBe(true);
  });

  it("should fallback to default weather if fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const weather = await fetchLiveWeather("sofi");
    expect(weather).toBeDefined();
    expect(weather.temp).toBe(24);
    expect(weather.isLive).toBe(false);
  });
});
