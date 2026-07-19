/* ============================================
   StadiaIQ — Real-Time Live Telemetry Bus
   Simulates & manages live venue streams (WebSockets/SSE equivalent)
   ============================================ */

import { useState, useEffect } from "react";

// Global single-source-of-truth telemetry state
let globalTelemetryState = {
  attendance: 62418,
  capacityPercentage: 78,
  gateWaitTimes: {
    gate1: 5,
    gate2: 16,
    gate3: 6,
    gate4: 2,
  },
  concessionWaits: {
    stand12_north: 4,
    stand24_east: 12, // Bottleneck
    stand08_west: 2,
  },
  restroomQueues: {
    sec112_mens: 2,
    sec114_womens: 8, // Bottleneck
    sec118_family: 1,
  },
  activeBottlenecks: "Gate 2 East Concourse (16m wait)",
  recommendedGate: "Gate 4 West Stand (2m express wait)",
  transitCountdowns: {
    metroGreen: 180, // seconds
    fanShuttle: 420,
    commuterRail: 900,
  },
  liveAlerts: [
    {
      id: "ALT-1",
      road: "NJ Route 3 (Eastbound)",
      status: "heavy",
      delay: 25,
      color: "danger",
      time: "19:42 ET",
    },
    {
      id: "ALT-2",
      road: "I-95 / NJ Turnpike Exit 16W",
      status: "moderate",
      delay: 14,
      color: "warning",
      time: "19:48 ET",
    },
  ],
  incidents: [
    {
      id: "INC-109",
      time: "19:42 ET",
      type: "Medical Assist Required",
      location: "Section 114 (Concourse Level 1)",
      status: "Dispatched",
      priority: "High",
      color: "danger",
    },
    {
      id: "INC-110",
      time: "19:48 ET",
      type: "Turnstile Scanner Sync Delay",
      location: "Gate 2 (East Concourse Bay 4)",
      status: "Resolving",
      priority: "Medium",
      color: "warning",
    },
    {
      id: "INC-111",
      time: "19:55 ET",
      type: "Concession Stock Replenishment",
      location: "Food Court North (Stand 12)",
      status: "Restocked",
      priority: "Low",
      color: "success",
    },
  ],
  lastTick: Date.now(),
};

const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener(globalTelemetryState));
}

// Start live ticker loop (runs once when module is loaded)
if (typeof window !== "undefined") {
  setInterval(() => {
    // 1. Tick transit countdowns
    const newMetro =
      globalTelemetryState.transitCountdowns.metroGreen <= 0
        ? 240
        : globalTelemetryState.transitCountdowns.metroGreen - 3;
    const newShuttle =
      globalTelemetryState.transitCountdowns.fanShuttle <= 0
        ? 600
        : globalTelemetryState.transitCountdowns.fanShuttle - 3;
    const newCommuter =
      globalTelemetryState.transitCountdowns.commuterRail <= 0
        ? 1200
        : globalTelemetryState.transitCountdowns.commuterRail - 3;

    // 2. Micro-fluctuations in attendance (real-time turnstile entries)
    const delta = Math.floor(Math.random() * 7) - 1; // -1 to +5 fans
    const newAttendance = Math.min(
      82500,
      Math.max(60000, globalTelemetryState.attendance + delta),
    );

    // 3. Dynamic gate wait time adjustments
    const gate2Change =
      Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newGate2 = Math.min(
      25,
      Math.max(10, globalTelemetryState.gateWaitTimes.gate2 + gate2Change),
    );

    const concessionChange =
      Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newConcession = Math.min(
      20,
      Math.max(
        5,
        globalTelemetryState.concessionWaits.stand24_east + concessionChange,
      ),
    );

    globalTelemetryState = {
      ...globalTelemetryState,
      attendance: newAttendance,
      gateWaitTimes: {
        ...globalTelemetryState.gateWaitTimes,
        gate2: newGate2,
      },
      concessionWaits: {
        ...globalTelemetryState.concessionWaits,
        stand24_east: newConcession,
      },
      activeBottlenecks: `Gate 2 East Concourse (${newGate2}m wait)`,
      transitCountdowns: {
        metroGreen: newMetro,
        fanShuttle: newShuttle,
        commuterRail: newCommuter,
      },
      lastTick: Date.now(),
    };

    notifyListeners();
  }, 3000);
}

export function useLiveTelemetry() {
  const [state, setState] = useState(globalTelemetryState);

  useEffect(() => {
    const handler = (newState) => setState({ ...newState });
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return state;
}

export function getGlobalTelemetry() {
  return globalTelemetryState;
}

export function resolveIncidentGlobal(incidentId) {
  globalTelemetryState = {
    ...globalTelemetryState,
    incidents: globalTelemetryState.incidents.map((inc) =>
      inc.id === incidentId
        ? { ...inc, status: "Resolved", color: "success" }
        : inc,
    ),
  };
  notifyListeners();
}

export function addIncidentGlobal(newIncident) {
  globalTelemetryState = {
    ...globalTelemetryState,
    incidents: [newIncident, ...globalTelemetryState.incidents],
  };
  notifyListeners();
}
