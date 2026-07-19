import { describe, it, expect } from "vitest";
import {
  getMatchById,
  getTodaysMatches,
  getVenue,
  getUpcomingMatches,
  getLiveMatches,
  getMatchStatusDisplay,
  formatDate,
  getMatchesByVenue,
  getGoogleMapsUrl,
  getGoogleMapsTransitUrl
} from "./matchData";

describe("matchData Utilities", () => {
  it("should return the correct venue by ID", () => {
    const venue = getVenue("metlife");
    expect(venue).toBeDefined();
    expect(venue.name).toBe("MetLife Stadium");
  });

  it("should return null for invalid venue ID", () => {
    const venue = getVenue("invalid-id");
    expect(venue).toBeNull();
  });

  it("should return a specific match by ID", () => {
    const match = getMatchById("GS-01");
    expect(match).toBeDefined();
    expect(match.teamA).toContain("Mexico");
  });

  it("should return null for invalid match ID", () => {
    const match = getMatchById("invalid-id");
    expect(match).toBeNull();
  });

  it("should get matches for a specific date", () => {
    const todays = getTodaysMatches("2026-06-11");
    expect(todays.length).toBeGreaterThan(0);
    expect(todays[0].id).toBe("GS-01");
  });

  it("should get matches by venue", () => {
    const metlifeMatches = getMatchesByVenue("metlife");
    expect(metlifeMatches.length).toBeGreaterThan(0);
    expect(metlifeMatches.every((m) => m.venue === "metlife")).toBe(true);
  });

  it("should get upcoming matches", () => {
    const upcoming = getUpcomingMatches();
    expect(upcoming).toBeDefined();
    expect(Array.isArray(upcoming)).toBe(true);
  });

  it("should get live matches", () => {
    const live = getLiveMatches();
    expect(live).toBeDefined();
    expect(Array.isArray(live)).toBe(true);
  });

  describe("getMatchStatusDisplay", () => {
    it("should return UI config for live match", () => {
      const result = getMatchStatusDisplay({ status: "live", note: "45' + 2" });
      expect(result.label).toBe("45' + 2");
      expect(result.color).toBe("danger");
    });
    
    it("should return UI config for live match without note", () => {
      const result = getMatchStatusDisplay({ status: "live" });
      expect(result.label).toBe("🔴 LIVE");
      expect(result.color).toBe("danger");
    });

    it("should return UI config for completed match", () => {
      const result = getMatchStatusDisplay({
        status: "completed",
        scoreA: 2,
        scoreB: 1,
      });
      expect(result.label).toBe("FT: 2-1");
      expect(result.color).toBe("secondary");
    });

    it("should return UI config for upcoming match", () => {
      const result = getMatchStatusDisplay({
        status: "upcoming",
        time: "15:00",
      });
      expect(result.label).toBe("15:00 ET");
      expect(result.color).toBe("info");
    });

    it("should return fallback UI config for unknown status", () => {
      const result = getMatchStatusDisplay({ status: "delayed" });
      expect(result.label).toBe("delayed");
      expect(result.color).toBe("secondary");
    });

    it("should handle null match gracefully", () => {
      const result = getMatchStatusDisplay(null);
      expect(result.label).toBe("Unknown");
      expect(result.color).toBe("secondary");
    });
  });
  
  describe("Google Maps URLs", () => {
    it("should generate valid driving URL", () => {
      const url = getGoogleMapsUrl("metlife");
      expect(url).toContain("destination=40.8128,-74.0742");
      expect(url).toContain("driving");
    });

    it("should return # for invalid driving venue", () => {
      expect(getGoogleMapsUrl("invalid")).toBe("#");
    });

    it("should generate valid transit URL", () => {
      const url = getGoogleMapsTransitUrl("metlife");
      expect(url).toContain("transit");
    });

    it("should return # for invalid transit venue", () => {
      expect(getGoogleMapsTransitUrl("invalid")).toBe("#");
    });
  });

  it("should format date correctly", () => {
    const formatted = formatDate("2026-06-11");
    expect(typeof formatted).toBe("string");
    expect(formatted.includes("Jun") || formatted.includes("June")).toBe(true);

    expect(formatDate(null)).toBe("Invalid Date");
  });
});
