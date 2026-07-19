import React, { useEffect, useRef } from "react";
import { Users, Activity, ShieldAlert, Sparkles } from "lucide-react";

export default function CrowdSection() {
  const canvasRef = useRef(null);
  
  const busiestZone = "Gate 2 (East Concourse)";
  const quietestZone = "Gate 4 (West Stand)";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth || 800;
    const height = Math.max(420, width * 0.58);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const drawHeatmap = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      // Concourse outline
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9, 16);
      ctx.stroke();

      // Pitch
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(
        width * 0.28,
        height * 0.28,
        width * 0.44,
        height * 0.44,
        8,
      );
      ctx.fill();

      // Simulated density blobs
      const blobs = [
        { x: 0.9, y: 0.5, r: 0.18, color: "rgba(220, 38, 38, 0.55)" }, // Gate 2 High
        { x: 0.5, y: 0.08, r: 0.15, color: "rgba(234, 88, 12, 0.5)" }, // Gate 1 Moderate
        { x: 0.5, y: 0.92, r: 0.15, color: "rgba(234, 140, 0, 0.45)" }, // Gate 3 Moderate
        { x: 0.1, y: 0.5, r: 0.14, color: "rgba(22, 163, 74, 0.45)" }, // Gate 4 Low
        { x: 0.75, y: 0.25, r: 0.12, color: "rgba(234, 88, 12, 0.5)" }, // NE Concourse
        { x: 0.25, y: 0.75, r: 0.12, color: "rgba(22, 163, 74, 0.4)" }, // SW Concourse
      ];

      blobs.forEach((b) => {
        const grad = ctx.createRadialGradient(
          b.x * width,
          b.y * height,
          0,
          b.x * width,
          b.y * height,
          b.r * width,
        );
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x * width, b.y * height, b.r * width, 0, Math.PI * 2);
        ctx.fill();
      });

      // Labels
      ctx.fillStyle = "#0f172a";
      ctx.font = "700 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "🔴 Gate 2 (High Density - 14 min wait)",
        width * 0.85,
        height * 0.5,
      );
      ctx.fillText(
        "🟡 Gate 1 (Moderate - 6 min wait)",
        width * 0.5,
        height * 0.12,
      );
      ctx.fillText(
        "🟡 Gate 3 (Moderate - 5 min wait)",
        width * 0.5,
        height * 0.88,
      );
      ctx.fillText(
        "🟢 Gate 4 (Express Entry - 2 min wait)",
        width * 0.18,
        height * 0.5,
      );

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 14px Inter, sans-serif";
      ctx.fillText("PITCH ZONE (RESTRICTED)", width * 0.5, height * 0.5);
    };

    drawHeatmap();
    const interval = setInterval(drawHeatmap, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section active">
      <div className="section__header">
        <h2 className="section__title">
          <Activity style={{ color: "var(--color-primary-light)" }} /> Real-Time
          Crowd Density Heatmap
        </h2>
        <p className="section__description">
          Monitor live fan telemetry across all stadium concourses. AI flow
          sensors predict queue bottlenecks 15 minutes before they happen,
          allowing smart ingress and egress routing.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--primary">
              <Users size={22} />
            </div>
          </div>
          <div className="stat-card__value">62,400</div>
          <div className="stat-card__label">Total Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--primary">
              <Activity size={22} />
            </div>
          </div>
          <div className="stat-card__value">78%</div>
          <div className="stat-card__label">Overall Stadium Capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--danger">
              <ShieldAlert size={22} />
            </div>
          </div>
          <div className="stat-card__value" style={{ fontSize: "1.2rem" }}>
            {busiestZone}
          </div>
          <div className="stat-card__label">Busiest Bottleneck Zone</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--success">
              <Sparkles size={22} />
            </div>
          </div>
          <div className="stat-card__value" style={{ fontSize: "1.2rem" }}>
            {quietestZone}
          </div>
          <div className="stat-card__label">AI Recommended Entry Gate</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        <div className="card__header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="card__title">
              Concourse Thermal & Flow Telemetry
            </span>
            <span className="live-dot"></span>
            <span className="text-xs text-success" style={{ fontWeight: 600 }}>
              Live Telemetry (Updates every 5s)
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              fontSize: "0.75rem",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#16a34a",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>{" "}
              Low
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#ea8c00",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>{" "}
              Moderate
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#dc2626",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>{" "}
              Critical Bottleneck
            </span>
          </div>
        </div>
        <div className="card__body">
          <div className="canvas-container">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
