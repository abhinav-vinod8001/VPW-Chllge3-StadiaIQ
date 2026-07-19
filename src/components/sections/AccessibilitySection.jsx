import React, { useState } from "react";
import { Accessibility, Check, Navigation } from "lucide-react";

export default function AccessibilitySection() {
  const [from, setFrom] = useState("Gate 1 (North Entrance)");
  const [to, setTo] = useState("Section 108 (Wheelchair Seating)");
  const [plannedRoute, setPlannedRoute] = useState(null);

  const features = [
    {
      icon: "♿",
      title: "Step-Free Wheelchair Access",
      items: [
        "Dedicated step-free entry lanes at Gates 1, 2, and 4",
        "High-capacity priority elevators in all 4 stadium corners",
        "Designated wheelchair platforms in Sections 108, 130, and 131",
        "Companion seating directly alongside all accessible bays",
        "Accessible restrooms on every concourse level with auto-doors",
      ],
    },
    {
      icon: "👁️",
      title: "Visual & Audio Assistance",
      items: [
        "Live audio descriptive commentary on headset channel 2",
        "Braille and high-contrast tactile signage throughout all rings",
        "Tactile guide paths connecting main transit gates to concourses",
        "Large-print tournament guides at Concierge Desk Level 1",
        "Certified guide and service animals welcome across all sectors",
      ],
    },
    {
      icon: "🧠",
      title: "Sensory Rooms & Quiet Zones",
      items: [
        "Sound-insulated Sensory Room located near Gate 1, Level 1",
        "Low-stimulation viewing lounge with adjustable lighting",
        "Complimentary sensory bags (noise-canceling headphones, fidget tools)",
        "Visual communication boards available at all assistance points",
        "Trained accessibility stewards stationed every 50 meters",
      ],
    },
    {
      icon: "👂",
      title: "Hearing & Deaf Assistance",
      items: [
        "Inductive hearing loop systems installed across all seating tiers",
        "Sign language interpreters available upon request at Gate 1",
        "Synchronized visual alerts and closed captions on giant LED screens",
        "Real-time text assistance via the StadiaIQ AI Assistant",
        "Dedicated video phone booths at Concourse North",
      ],
    },
  ];

  const handlePlanRoute = (e) => {
    e.preventDefault();
    setPlannedRoute({
      from,
      to,
      distance: "~140 meters (Step-free path)",
      time: "4 minutes",
      steps: [
        `Enter via ${from} priority step-free accessibility lane.`,
        "Follow the high-contrast yellow tactile path along Concourse North (~90m).",
        "Board Priority Elevator Corner NW to Concourse Level 1.",
        `Turn right toward ${to} — friendly steward assistance on standby.`,
        "Arrive at designated step-free viewing bay with adjacent companion seating.",
      ],
    });
  };

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title">
          <Accessibility style={{ color: "var(--color-primary-light)" }} />{" "}
          Accessibility Concierge & Step-Free Routing
        </h2>
        <p className="section__description">
          Comprehensive accessibility guides for fans of all abilities. Plan
          100% step-free routes between entry gates and seating tiers, or locate
          sensory rooms and assistance desks.
        </p>
      </div>

      <div
        className="content-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        {features.map((f, idx) => (
          <div key={idx} className="card hover-lift">
            <div className="card__header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <span style={{ fontSize: "1.5rem" }}>{f.icon}</span>
                <span className="card__title" style={{ fontSize: "1.1rem" }}>
                  {f.title}
                </span>
              </div>
            </div>
            <div className="card__body">
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {f.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Check
                      size={16}
                      style={{
                        color: "var(--color-success)",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* AI Step-Free Route Planner */}
      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <div className="card__header">
          <span className="card__title">
            <Navigation
              size={18}
              style={{ color: "var(--color-primary-light)" }}
            />{" "}
            AI Accessible Route Planner
          </span>
          <span className="badge badge--info">
            100% Step-Free Path Verified
          </span>
        </div>
        <div className="card__body">
          <form
            onSubmit={handlePlanRoute}
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1, minWidth: "220px" }}>
              <label
                className="text-xs text-muted font-bold"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                STARTING POINT
              </label>
              <select
                className="select"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                <option>Gate 1 (North Entrance)</option>
                <option>Gate 2 (East Entrance)</option>
                <option>Gate 3 (South Entrance)</option>
                <option>Gate 4 (West Entrance)</option>
                <option>Meadowlands Rail Platform</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <label
                className="text-xs text-muted font-bold"
                style={{ display: "block", marginBottom: "0.4rem" }}
              >
                DESTINATION
              </label>
              <select
                className="select"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option>Section 108 (Wheelchair Seating)</option>
                <option>Section 130 (VIP Wheelchair Suite)</option>
                <option>Section 131 (VIP Wheelchair Suite)</option>
                <option>Sensory Room Level 1</option>
                <option>Accessible Restroom Concourse North</option>
                <option>First Aid Station West</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              style={{ height: "42px", padding: "0 1.5rem" }}
            >
              Generate Step-Free Route
            </button>
          </form>

          {plannedRoute && (
            <div
              className="alert alert--success"
              style={{ marginTop: "1.5rem" }}
            >
              <span className="alert__icon">♿</span>
              <div className="alert__content">
                <div className="alert__title">
                  Step-Free Route Generated: {plannedRoute.from} →{" "}
                  {plannedRoute.to}
                </div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      marginBottom: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    <span>📏 Distance: {plannedRoute.distance}</span>
                    <span>⏱️ Est. Time: {plannedRoute.time}</span>
                  </div>
                  <ol
                    style={{
                      paddingLeft: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      listStyle: "decimal",
                    }}
                  >
                    {plannedRoute.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
