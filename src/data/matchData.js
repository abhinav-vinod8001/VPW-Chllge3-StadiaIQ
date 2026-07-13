/* ============================================
   StadiaIQ — FIFA World Cup 2026 Match Data
   All 16 venues, schedules, traffic & maps
   ============================================ */

export const venues = {
  'metlife': {
    id: 'metlife', name: 'MetLife Stadium', city: 'East Rutherford, NJ',
    capacity: 82500, lat: 40.8128, lng: -74.0742,
    address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
    transit: ['NJ Transit Bus 160/161', 'Meadowlands Rail (event service)'],
    parking: 'Lots A-K available, $40-$60',
    image: '🏟️',
  },
  'att': {
    id: 'att', name: 'AT&T Stadium', city: 'Arlington, TX',
    capacity: 80000, lat: 32.7473, lng: -97.0945,
    address: '1 AT&T Way, Arlington, TX 76011',
    transit: ['TRE CentrePort Station + Shuttle', 'DART Orange Line to CentrePort'],
    parking: 'Lots 1-16, $20-$75',
    image: '🏟️',
  },
  'hardrock': {
    id: 'hardrock', name: 'Hard Rock Stadium', city: 'Miami Gardens, FL',
    capacity: 65326, lat: 25.9580, lng: -80.2389,
    address: '347 Don Shula Dr, Miami Gardens, FL 33056',
    transit: ['Metrorail to Northside + Shuttle', 'Express bus from Downtown'],
    parking: 'General $50, Premium $150',
    image: '🏟️',
  },
  'sofi': {
    id: 'sofi', name: 'SoFi Stadium', city: 'Inglewood, CA',
    capacity: 70240, lat: 33.9535, lng: -118.3392,
    address: '1001 Stadium Dr, Inglewood, CA 90301',
    transit: ['Metro C Line to Downtown Inglewood', 'LAX FlyAway + Shuttle'],
    parking: 'Lots Pink/Yellow/Green, $60-$100',
    image: '🏟️',
  },
  'levis': {
    id: 'levis', name: "Levi's Stadium", city: 'Santa Clara, CA',
    capacity: 68500, lat: 37.4033, lng: -121.9694,
    address: '4900 Marie P DeBartolo Way, Santa Clara, CA 95054',
    transit: ['VTA Light Rail to Great America', 'Caltrain to Santa Clara + Shuttle'],
    parking: 'Lots 1-7, $40-$60',
    image: '🏟️',
  },
  'nrg': {
    id: 'nrg', name: 'NRG Stadium', city: 'Houston, TX',
    capacity: 72220, lat: 29.6847, lng: -95.4107,
    address: 'NRG Pkwy, Houston, TX 77054',
    transit: ['METRORail Red Line to NRG Park', 'Park & Ride shuttles'],
    parking: 'Blue/Teal/Yellow lots, $30-$60',
    image: '🏟️',
  },
  'mercedesbenz': {
    id: 'mercedesbenz', name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA',
    capacity: 71000, lat: 33.7553, lng: -84.4006,
    address: '1 AMB Dr NW, Atlanta, GA 30313',
    transit: ['MARTA Vine City Station (0.3 mi walk)', 'MARTA GWCC/CNN Center Station'],
    parking: 'Marshalling Yards $40, Gulch $50',
    image: '🏟️',
  },
  'lincoln': {
    id: 'lincoln', name: 'Lincoln Financial Field', city: 'Philadelphia, PA',
    capacity: 69176, lat: 39.9008, lng: -75.1675,
    address: '1 Lincoln Financial Field Way, Philadelphia, PA 19148',
    transit: ['SEPTA Broad Street Line to NRG Station', 'Bus routes 4, 17'],
    parking: 'Lots A-M, $35-$55',
    image: '🏟️',
  },
  'lumen': {
    id: 'lumen', name: 'Lumen Field', city: 'Seattle, WA',
    capacity: 68740, lat: 47.5952, lng: -122.3316,
    address: '800 Occidental Ave S, Seattle, WA 98134',
    transit: ['Link Light Rail to Stadium Station', 'Sounder Train to King Street'],
    parking: 'Event lots $30-$50, street parking limited',
    image: '🏟️',
  },
  'gillette': {
    id: 'gillette', name: 'Gillette Stadium', city: 'Foxborough, MA',
    capacity: 65878, lat: 42.0909, lng: -71.2643,
    address: '1 Patriot Pl, Foxborough, MA 02035',
    transit: ['MBTA Commuter Rail event service from Boston', 'Shuttle from Patriot Place'],
    parking: 'Lots P1-P15, $40',
    image: '🏟️',
  },
  'boa': {
    id: 'boa', name: 'Bank of America Stadium', city: 'Charlotte, NC',
    capacity: 75523, lat: 35.2258, lng: -80.8528,
    address: '800 S Mint St, Charlotte, NC 28202',
    transit: ['LYNX Blue Line to Stonewall Station', 'CityLYNX Gold Line'],
    parking: 'Uptown decks $20-$40',
    image: '🏟️',
  },
  'azteca': {
    id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City, Mexico',
    capacity: 87523, lat: 19.3029, lng: -99.1505,
    address: 'Calz. de Tlalpan 3465, Mexico City',
    transit: ['Metro Line 2 to Tasqueña + Bus'],
    parking: 'Stadium lots available',
    image: '🏟️',
  },
  'monterrey': {
    id: 'monterrey', name: 'Estadio BBVA', city: 'Monterrey, Mexico',
    capacity: 53500, lat: 25.6667, lng: -100.2448,
    address: 'Av. Pablo Livas 2011, Monterrey',
    transit: ['Ecovia Line 1 to BBVA'],
    parking: 'Stadium lots',
    image: '🏟️',
  },
  'guadalajara': {
    id: 'guadalajara', name: 'Estadio Akron', city: 'Guadalajara, Mexico',
    capacity: 49850, lat: 20.6810, lng: -103.4625,
    address: 'Av. de las Rosas 3200, Guadalajara',
    transit: ['Mi Macro Line 3 + Shuttle'],
    parking: 'Stadium lots',
    image: '🏟️',
  },
  'bmo': {
    id: 'bmo', name: 'BMO Field', city: 'Toronto, Canada',
    capacity: 45736, lat: 43.6332, lng: -79.4186,
    address: '170 Princes Blvd, Toronto, ON',
    transit: ['TTC Line 1 to Union + Streetcar 509/511', 'GO Train to Exhibition'],
    parking: 'Exhibition Place lots $25-$40',
    image: '🏟️',
  },
  'bc_place': {
    id: 'bc_place', name: 'BC Place', city: 'Vancouver, Canada',
    capacity: 54500, lat: 49.2768, lng: -123.1118,
    address: '777 Pacific Blvd, Vancouver, BC',
    transit: ['SkyTrain to Stadium-Chinatown Station'],
    parking: 'BC Place parkade $25-$35',
    image: '🏟️',
  },
};

export const matches = [
  // Round of 16
  { id: 'R16-1', round: 'Round of 16', date: '2026-06-28', time: '17:00', venue: 'metlife', teamA: '🇦🇷 Argentina', teamB: '🇦🇺 Australia', scoreA: 3, scoreB: 1, status: 'completed' },
  { id: 'R16-2', round: 'Round of 16', date: '2026-06-28', time: '21:00', venue: 'sofi', teamA: '🇫🇷 France', teamB: '🇵🇱 Poland', scoreA: 2, scoreB: 0, status: 'completed' },
  { id: 'R16-3', round: 'Round of 16', date: '2026-06-29', time: '17:00', venue: 'att', teamA: '🇧🇷 Brazil', teamB: '🇰🇷 South Korea', scoreA: 4, scoreB: 1, status: 'completed' },
  { id: 'R16-4', round: 'Round of 16', date: '2026-06-29', time: '21:00', venue: 'hardrock', teamA: '🇪🇸 Spain', teamB: '🇲🇦 Morocco', scoreA: 1, scoreB: 0, status: 'completed' },
  { id: 'R16-5', round: 'Round of 16', date: '2026-06-30', time: '17:00', venue: 'mercedesbenz', teamA: '🇩🇪 Germany', teamB: '🇯🇵 Japan', scoreA: 2, scoreB: 2, status: 'completed', note: 'Germany wins 4-3 on penalties' },
  { id: 'R16-6', round: 'Round of 16', date: '2026-06-30', time: '21:00', venue: 'nrg', teamA: '🇬🇧 England', teamB: '🇸🇳 Senegal', scoreA: 3, scoreB: 0, status: 'completed' },
  { id: 'R16-7', round: 'Round of 16', date: '2026-07-01', time: '17:00', venue: 'lincoln', teamA: '🇳🇱 Netherlands', teamB: '🇺🇸 USA', scoreA: 2, scoreB: 3, status: 'completed' },
  { id: 'R16-8', round: 'Round of 16', date: '2026-07-01', time: '21:00', venue: 'levis', teamA: '🇵🇹 Portugal', teamB: '🇨🇭 Switzerland', scoreA: 4, scoreB: 1, status: 'completed' },

  // Quarter Finals
  { id: 'QF-1', round: 'Quarter Final', date: '2026-07-04', time: '18:00', venue: 'att', teamA: '🇦🇷 Argentina', teamB: '🇪🇸 Spain', scoreA: 2, scoreB: 1, status: 'completed' },
  { id: 'QF-2', round: 'Quarter Final', date: '2026-07-04', time: '21:00', venue: 'hardrock', teamA: '🇩🇪 Germany', teamB: '🇬🇧 England', scoreA: 1, scoreB: 2, status: 'completed' },
  { id: 'QF-3', round: 'Quarter Final', date: '2026-07-05', time: '18:00', venue: 'sofi', teamA: '🇧🇷 Brazil', teamB: '🇺🇸 USA', scoreA: null, scoreB: null, status: 'upcoming', note: 'Rescheduled' },
  { id: 'QF-4', round: 'Quarter Final', date: '2026-07-12', time: '20:00', venue: 'metlife', teamA: '🇫🇷 France', teamB: '🇵🇹 Portugal', scoreA: null, scoreB: null, status: 'live' },

  // Semi Finals & Final
  { id: 'SF-1', round: 'Semi Final', date: '2026-07-15', time: '20:00', venue: 'metlife', teamA: 'Winner QF1', teamB: 'Winner QF2', scoreA: null, scoreB: null, status: 'upcoming' },
  { id: 'SF-2', round: 'Semi Final', date: '2026-07-16', time: '20:00', venue: 'att', teamA: 'Winner QF3', teamB: 'Winner QF4', scoreA: null, scoreB: null, status: 'upcoming' },
  { id: '3RD', round: 'Third Place', date: '2026-07-18', time: '17:00', venue: 'hardrock', teamA: 'Loser SF1', teamB: 'Loser SF2', scoreA: null, scoreB: null, status: 'upcoming' },
  { id: 'F', round: 'Final', date: '2026-07-19', time: '20:00', venue: 'metlife', teamA: 'Winner SF1', teamB: 'Winner SF2', scoreA: null, scoreB: null, status: 'upcoming' },
];

export const trafficConditions = {
  metlife: [
    { road: 'NJ Route 3 (Eastbound)', status: 'heavy', delay: 25, color: 'danger' },
    { road: 'NJ Route 3 (Westbound)', status: 'moderate', delay: 12, color: 'warning' },
    { road: 'I-95 / NJ Turnpike', status: 'moderate', delay: 15, color: 'warning' },
    { road: 'Route 17 South', status: 'light', delay: 5, color: 'success' },
    { road: 'I-80 Eastbound', status: 'light', delay: 3, color: 'success' },
  ],
  att: [
    { road: 'I-30 (Eastbound)', status: 'heavy', delay: 20, color: 'danger' },
    { road: 'I-30 (Westbound)', status: 'moderate', delay: 10, color: 'warning' },
    { road: 'TX-360', status: 'light', delay: 5, color: 'success' },
    { road: 'Division Street', status: 'heavy', delay: 18, color: 'danger' },
  ],
  hardrock: [
    { road: 'I-75 Southbound', status: 'moderate', delay: 14, color: 'warning' },
    { road: 'Florida Turnpike', status: 'light', delay: 6, color: 'success' },
    { road: 'NW 199th Street', status: 'heavy', delay: 22, color: 'danger' },
    { road: 'Snake Creek Canal Rd', status: 'moderate', delay: 10, color: 'warning' },
  ],
  sofi: [
    { road: 'I-405 Northbound', status: 'heavy', delay: 30, color: 'danger' },
    { road: 'I-105 Westbound', status: 'moderate', delay: 15, color: 'warning' },
    { road: 'Prairie Ave', status: 'moderate', delay: 12, color: 'warning' },
    { road: 'Century Blvd', status: 'light', delay: 7, color: 'success' },
  ],
};

export function getVenue(venueId) {
  return venues[venueId] || null;
}

export function getAllVenues() {
  return Object.values(venues);
}

export function getLiveMatch() {
  return matches.find(m => m.status === 'live') || null;
}

export function getUpcomingMatches() {
  return matches.filter(m => m.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getTraffic(venueId) {
  return trafficConditions[venueId] || trafficConditions.metlife;
}

export function getGoogleMapsUrl(venueId) {
  const venue = venues[venueId];
  if (!venue) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}&travelmode=driving`;
}

export function getGoogleMapsTransitUrl(venueId) {
  const venue = venues[venueId];
  if (!venue) return '#';
  return `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}&travelmode=transit`;
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
