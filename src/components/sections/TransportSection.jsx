import React from "react";
import { Train, Bot, Clock, Leaf } from "lucide-react";

export default function TransportSection() {
  const departures = [
    {
      mode: "🚇 Metro Rail Express",
      route: "Green Line to Meadowlands Junction",
      platform: "Platform 2",
      time: "In 3 min",
      status: "On Time",
      badge: "success",
    },
    {
      mode: "🚇 Metro Rail Express",
      route: "Green Line to Downtown Central",
      platform: "Platform 1",
      time: "In 7 min",
      status: "On Time",
      badge: "success",
    },
    {
      mode: "🚌 FIFA Fan Shuttle",
      route: "Route A — Midtown Manhattan Hub",
      platform: "Bay 4",
      time: "In 10 min",
      status: "Boarding Now",
      badge: "info",
    },
    {
      mode: "🚌 FIFA Fan Shuttle",
      route: "Route B — Newark Penn Station",
      platform: "Bay 6",
      time: "In 14 min",
      status: "On Time",
      badge: "success",
    },
    {
      mode: "🚆 Regional Commuter",
      route: "NJ Transit Northeast Corridor",
      platform: "Track 3",
      time: "In 22 min",
      status: "Delayed (+4m)",
      badge: "warning",
    },
    {
      mode: "🚕 Rideshare / Taxis",
      route: "Designated East Lot Drop/Pick Zone",
      platform: "Lot E",
      time: "Continuous",
      status: "Surge 2.4x",
      badge: "danger",
    },
  ];

  const modes = [
    {
      icon: "🚇",
      name: "Meadowlands Rail Express",
      time: "28 min",
      wait: "3 min",
      carbon: "0.3 kg CO₂",
      note: "Fastest egress from stadium. Direct walkway from Gate 4.",
    },
    {
      icon: "🚌",
      name: "Official FIFA Fan Shuttle",
      time: "40 min",
      wait: "10 min",
      carbon: "0.5 kg CO₂",
      note: "Complimentary shuttle for all ticket holders. Air conditioned.",
    },
    {
      icon: "🚗",
      name: "Personal Driving / Parking Lot",
      time: "55 min",
      wait: "25 min",
      carbon: "2.4 kg CO₂",
      note: "Expect severe bottleneck upon exiting lots A through K.",
    },
  ];

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title">
          <Train style={{ color: "var(--color-primary-light)" }} /> Smart
          Transport Hub & Departures
        </h2>
        <p className="section__description">
          Live departure schedules from venue transit hubs. Our AI analyzes
          real-time train capacities and road congestion to recommend the
          fastest egress path post-match.
        </p>
      </div>

      <div
        className="alert alert--info"
        style={{ marginBottom: "var(--space-6)" }}
      >
        <span className="alert__icon">
          <Bot size={22} />
        </span>
        <div className="alert__content">
          <div className="alert__title">
            StadiaIQ Post-Match Egress Strategy
          </div>
          Take the <strong>Meadowlands Rail Express (Green Line)</strong> from
          Stadium North platform. Exit via Gate 4 (West Stand) 5 minutes before
          full time to beat the main concourse rush and save 25+ minutes.
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        {modes.map((m, idx) => (
          <div key={idx} className="card hover-lift">
            <div className="card__body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{m.icon}</span>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--color-primary-light)",
                    }}
                  >
                    {m.time}
                  </div>
                  <div className="text-xs text-muted">Wait: {m.wait}</div>
                </div>
              </div>
              <h4 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>
                {m.name}
              </h4>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                {m.note}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--color-gray-200)",
                  paddingTop: "0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-success)",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Leaf size={14} /> Carbon Footprint
                </span>
                <span>{m.carbon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <div className="card__header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="card__title">
              <Clock
                size={18}
                style={{ color: "var(--color-primary-light)" }}
              />{" "}
              Live Departure Board
            </span>
            <span className="live-dot"></span>
          </div>
          <span className="badge badge--success">
            Synced with Regional Transit
          </span>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Transit Service</th>
                  <th>Destination / Route</th>
                  <th>Boarding Bay</th>
                  <th>Departure Time</th>
                  <th>Live Status</th>
                </tr>
              </thead>
              <tbody>
                {departures.map((dep, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{dep.mode}</td>
                    <td>{dep.route}</td>
                    <td>
                      <span className="badge badge--secondary">
                        {dep.platform}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: "var(--color-primary-light)",
                      }}
                    >
                      {dep.time}
                    </td>
                    <td>
                      <span className={`badge badge--${dep.badge}`}>
                        <span className="badge__dot"></span> {dep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
