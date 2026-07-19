import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, MessageSquare, Ticket, UserCheck } from "lucide-react";
import {
  getVenue,
  getMatchById,
  getMatchStatusDisplay,
} from "../data/matchData";
import { fetchLiveWeather } from "../data/liveWeather";
import { useLiveTelemetry } from "../data/telemetryBus";

export default function Header({
  activeSection,
  onToggleSidebar,
  onToggleChat,
  onOpenSetupModal,
  selectedVenueId = "metlife",
  selectedMatchId = null,
}) {
  const liveVenue = getVenue(selectedVenueId) || getVenue("metlife");
  const activeMatch = selectedMatchId ? getMatchById(selectedMatchId) : null;
  const matchStatus = activeMatch ? getMatchStatusDisplay(activeMatch) : null;
  const telemetry = useLiveTelemetry();
  const [weather, setWeather] = useState({
    temp: 24,
    condition: "Clear Sky",
    icon: "☀️",
  });
  const [userPrefs, setUserPrefs] = useState({
    language: "en",
    isStaff: false,
    section: "114",
    row: "12",
  });

  useEffect(() => {
    fetchLiveWeather(liveVenue.id).then((res) => setWeather(res));
    const checkState = () => {
      setUserPrefs({
        language: localStorage.getItem("stadiaiq_lang") || "en",
        isStaff: localStorage.getItem("stadiaiq_is_staff") === "true",
        section: localStorage.getItem("stadiaiq_sec") || "—",
        row: localStorage.getItem("stadiaiq_row") || "—",
      });
    };
    checkState();
    const interval = setInterval(checkState, 3000);
    return () => clearInterval(interval);
  }, [liveVenue.id]);

  const flags = { en: "🇺🇸", es: "🇲🇽", fr: "🇫🇷", pt: "🇧🇷" };

  const sectionLabels = {
    home: "Home",
    matches: "Matches & Venues",
    route: "Route & Traffic",
    navigation: "Stadium Map",
    crowd: "Crowd Heatmap",
    transport: "Transport Hub",
    accessibility: "Accessibility Concierge",
    sustainability: "Sustainability Tracker",
    operations: "Operational Intelligence",
  };

  return (
    <header className="main__header">
      <div className="header__left">
        <button
          className="btn btn--icon"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
        <div className="main__breadcrumb">
          StadiaIQ / <span>{sectionLabels[activeSection] || "Home"}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        {/* Live Match Context Badge */}
        {activeMatch && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.7rem",
              background:
                activeMatch.status === "live"
                  ? "rgba(239, 68, 68, 0.08)"
                  : "rgba(37, 99, 235, 0.06)",
              border: `1px solid ${activeMatch.status === "live" ? "#fca5a5" : "var(--color-gray-200)"}`,
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            {activeMatch.status === "live" && (
              <span className="live-dot" style={{ width: 6, height: 6 }}></span>
            )}
            <span>
              {activeMatch.teamA.split(" ").pop()} vs{" "}
              {activeMatch.teamB.split(" ").pop()}
            </span>
            <span
              className={`badge badge--${matchStatus.color}`}
              style={{ fontSize: "0.6rem", padding: "1px 5px" }}
            >
              {matchStatus.label}
            </span>
          </div>
        )}

        {/* Weather */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.3rem 0.6rem",
            background: "var(--color-gray-100)",
            borderRadius: "9999px",
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            border: "1px solid var(--color-gray-200)",
          }}
        >
          <span>{weather.icon}</span>
          <span>{weather.temp}°C</span>
          <span style={{ opacity: 0.6 }}>({liveVenue.city.split(",")[0]})</span>
        </div>

        {/* Attendance */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.3rem 0.6rem",
            background: "var(--color-success-bg)",
            borderRadius: "9999px",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--color-success)",
            border: "1px solid #bbf7d0",
          }}
        >
          <span className="live-dot" style={{ width: 6, height: 6 }}></span>
          <span>{telemetry.attendance.toLocaleString()}</span>
        </div>

        {/* Fan Pass Badge */}
        <button
          onClick={onOpenSetupModal}
          title="Change match, seat, or language"
          aria-label="Fan Settings and Check In"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.65rem",
            background:
              "linear-gradient(135deg, rgba(30,58,138,0.08), rgba(37,99,235,0.12))",
            color: "var(--color-primary-dark)",
            border: "1px solid var(--color-primary-light)",
            borderRadius: "8px",
            fontSize: "0.72rem",
            fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {userPrefs.isStaff ? (
            <UserCheck size={13} aria-hidden="true" />
          ) : (
            <Ticket size={13} style={{ color: "#f59e0b" }} aria-hidden="true" />
          )}
          <span>
            {flags[userPrefs.language] || "🇺🇸"}{" "}
            {userPrefs.isStaff ? "Staff" : `Sec ${userPrefs.section}`}
          </span>
        </button>

        {/* AI Assistant */}
        <button
          className="btn btn--primary"
          onClick={onToggleChat}
          aria-label="Open AI Operations Assistant"
        >
          <MessageSquare size={18} aria-hidden="true" />
          <span className="hidden-mobile">AI Co-Pilot</span>
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  activeSection: PropTypes.string,
  onToggleSidebar: PropTypes.func.isRequired,
  onToggleChat: PropTypes.func,
  onOpenSetupModal: PropTypes.func.isRequired,
  selectedVenueId: PropTypes.string,
  selectedMatchId: PropTypes.string,
};
