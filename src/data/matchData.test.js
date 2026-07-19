import { describe, it, expect } from 'vitest';
import { getMatchById, getTodaysMatches, getVenue } from './matchData';

describe('matchData Utilities', () => {
  it('should return the correct venue by ID', () => {
    const venue = getVenue('metlife');
    expect(venue).toBeDefined();
    expect(venue.name).toBe('MetLife Stadium');
  });

  it('should return null for invalid venue ID', () => {
    const venue = getVenue('invalid-id');
    expect(venue).toBeNull();
  });

  it('should return a specific match by ID', () => {
    const match = getMatchById('GS-01');
    expect(match).toBeDefined();
    expect(match.teamA).toContain('Mexico');
  });

  it('should get matches for a specific date', () => {
    // Testing the current simulated active date
    const matches = getTodaysMatches('2026-06-11');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].id).toBe('GS-01');
  });
});
