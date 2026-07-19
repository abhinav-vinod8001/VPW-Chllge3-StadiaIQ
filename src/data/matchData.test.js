import { describe, it, expect } from 'vitest';
import { 
  getMatchById, getTodaysMatches, getVenue, getUpcomingMatches, 
  getLiveMatches, getMatchStatusDisplay, formatDate, matches
} from './matchData';

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
  
  it('should return null for invalid match ID', () => {
    const match = getMatchById('invalid-id');
    expect(match).toBeNull();
  });

  it('should get matches for a specific date', () => {
    const todays = getTodaysMatches('2026-06-11');
    expect(todays.length).toBeGreaterThan(0);
    expect(todays[0].id).toBe('GS-01');
  });

  it('should get upcoming matches', () => {
    const upcoming = getUpcomingMatches();
    expect(upcoming).toBeDefined();
    expect(Array.isArray(upcoming)).toBe(true);
  });

  it('should get live matches', () => {
    const live = getLiveMatches();
    expect(live).toBeDefined();
    expect(Array.isArray(live)).toBe(true);
  });

  it('should format match status correctly', () => {
    expect(getMatchStatusDisplay({ status: 'upcoming', time: '14:00' }).label).toBe('14:00 ET');
    expect(getMatchStatusDisplay({ status: 'live', note: '🔴 LIVE' }).label).toBe('🔴 LIVE');
    expect(getMatchStatusDisplay({ status: 'completed', scoreA: 2, scoreB: 1 }).label).toBe('FT: 2-1');
    expect(getMatchStatusDisplay(null).label).toBe('Unknown');
  });

  it('should format date correctly', () => {
    const formatted = formatDate('2026-06-11');
    expect(typeof formatted).toBe('string');
    expect(formatted.includes('Jun') || formatted.includes('June')).toBe(true);
    
    expect(formatDate(null)).toBe('Invalid Date');
  });
});
