import React, { useState } from "react";
import PropTypes from "prop-types";
import { Search, Trophy, MapPin, Compass } from "lucide-react";
import { matches, getVenue, formatDate } from "../../data/matchData";

export default function MatchesSection({ onNavigate, onSelectVenue }) {
  const [query, setQuery] = useState("");
  const [roundFilter, setRoundFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = matches.filter((m) => {
    const venue = getVenue(m.venue);
    const textMatch =
      !query ||
      m.teamA.toLowerCase().includes(query.toLowerCase()) ||
      m.teamB.toLowerCase().includes(query.toLowerCase()) ||
      m.round.toLowerCase().includes(query.toLowerCase()) ||
      (venue && venue.name.toLowerCase().includes(query.toLowerCase())) ||
      (venue && venue.city.toLowerCase().includes(query.toLowerCase()));

    const roundMatch = !roundFilter || m.round === roundFilter;
    const statusMatch = !statusFilter || m.status === statusFilter;

    return textMatch && roundMatch && statusMatch;
  });

  const order = { live: 0, upcoming: 1, completed: 2 };
  filtered.sort(
    (a, b) =>
      (order[a.status] ?? 3) - (order[b.status] ?? 3) ||
      new Date(a.date) - new Date(b.date),
  );

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title">
          <Trophy style={{ color: "var(--color-gold)" }} /> FIFA World Cup 2026™
          Schedule & Venues
        </h2>
        <p className="section__description">
          Browse all knockout matches across the 16 host venues in the United
          States, Mexico, and Canada. Select a match to view directions,
          real-time traffic, or interactive seating maps.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: "var(--space-6)" }}>
        <div className="card__body">
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div className="input-group" style={{ flex: 1, minWidth: "250px" }}>
              <span className="input-group__icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="input"
                placeholder='Search by team, round, or venue (e.g. "Brazil", "MetLife", "Quarter Final")...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="select"
              style={{ width: "200px" }}
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
            >
              <option value="">All Rounds</option>
              <option value="Group A">Group A</option>
              <option value="Group B">Group B</option>
              <option value="Group C">Group C</option>
              <option value="Group D">Group D</option>
              <option value="Group E">Group E</option>
              <option value="Group F">Group F</option>
              <option value="Round of 16">Round of 16</option>
              <option value="Quarter Final">Quarter Final</option>
              <option value="Semi Final">Semi Final</option>
              <option value="Third Place">Third Place</option>
              <option value="Final">Final</option>
            </select>
            <select
              className="select"
              style={{ width: "180px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="live">Live Now</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ marginBottom: "0.5rem" }}>No Matches Found</h3>
          <p>Try adjusting your search criteria or filters above.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((match) => {
            const venue = getVenue(match.venue);
            const isLive = match.status === "live";
            const isCompleted = match.status === "completed";

            return (
              <div
                key={match.id}
                className="card hover-lift"
                style={{
                  borderLeft: isLive
                    ? "5px solid var(--color-danger)"
                    : isCompleted
                      ? "5px solid var(--color-success)"
                      : "1px solid var(--color-gray-200)",
                }}
              >
                <div
                  className="card__body"
                  style={{ padding: "1.25rem 1.5rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.4rem",
                        }}
                      >
                        <span
                          className={`badge badge--${isLive ? "danger" : isCompleted ? "success" : "info"}`}
                        >
                          {isLive && <span className="badge__dot"></span>}
                          {match.round}
                        </span>
                        <span className="text-xs text-muted">
                          {formatDate(match.date)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                        }}
                      >
                        {match.teamA}{" "}
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "1rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {isCompleted
                            ? `${match.scoreA} - ${match.scoreB}`
                            : isLive
                              ? "vs"
                              : `${match.time} ET`}
                        </span>{" "}
                        {match.teamB}
                      </div>
                      {match.note && (
                        <div
                          className="text-xs text-muted"
                          style={{ marginTop: "0.25rem" }}
                        >
                          📝 {match.note}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "right", minWidth: "200px" }}>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "var(--color-primary-light)",
                        }}
                      >
                        {venue ? venue.name : "TBD"}
                      </div>
                      <div className="text-xs text-secondary">
                        {venue ? venue.city : ""}
                      </div>
                      {venue && (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.75rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            className="btn btn--sm btn--outline"
                            onClick={() => {
                              if (onSelectVenue) onSelectVenue(match.venue);
                              onNavigate("route");
                            }}
                          >
                            <MapPin size={14} /> Directions
                          </button>
                          {isLive && (
                            <button
                              className="btn btn--sm btn--primary"
                              onClick={() => onNavigate("navigation")}
                            >
                              <Compass size={14} /> Stadium Map
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

MatchesSection.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onSelectVenue: PropTypes.func.isRequired,
};
