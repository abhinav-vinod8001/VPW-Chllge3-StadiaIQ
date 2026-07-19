import React from "react";
import {
  Home,
  Trophy,
  MapPin,
  Compass,
  Users,
  Train,
  Accessibility,
  Leaf,
  BarChart3,
  Moon,
  Sun,
  Download,
} from "lucide-react";

export default function Sidebar({
  activeSection,
  onNavigate,
  sidebarOpen,
  onCloseSidebar,
}) {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("stadiaiq_theme") || "light"
  );
  const [installPrompt, setInstallPrompt] = React.useState(null);

  React.useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("stadiaiq_theme", theme);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, [theme]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={18} /> },
    { id: "matches", label: "Matches & Venues", icon: <Trophy size={18} /> },
    { id: "route", label: "Route & Traffic", icon: <MapPin size={18} /> },
    { id: "navigation", label: "Stadium Map", icon: <Compass size={18} /> },
    { id: "crowd", label: "Crowd Heatmap", icon: <Users size={18} /> },
    { id: "transport", label: "Transport Hub", icon: <Train size={18} /> },
    {
      id: "accessibility",
      label: "Accessibility",
      icon: <Accessibility size={18} />,
    },
    { id: "sustainability", label: "Sustainability", icon: <Leaf size={18} /> },
    {
      id: "operations",
      label: "Operations Intelligence",
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">⚽</div>
        <div>
          <div className="sidebar__title">StadiaIQ</div>
          <div className="sidebar__subtitle">FIFA World Cup 2026™</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => {
              onNavigate(item.id);
              if (onCloseSidebar) onCloseSidebar();
            }}
            aria-label={`Navigate to ${item.label}`}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              font: "inherit",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem", justifyContent: "center" }}>
          <button
            onClick={toggleTheme}
            className="btn btn--secondary btn--sm"
            aria-label="Toggle Theme"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            style={{ padding: "0.4rem" }}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          
          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="btn btn--primary btn--sm"
              aria-label="Install App"
              style={{ padding: "0.4rem 0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Download size={14} /> Install
            </button>
          )}
        </div>
        © 2026 StadiaIQ™ • Built for Virtual Prompt Wars Challenge 3
      </div>
    </aside>
  );
}
