import React, { useState, useEffect, Suspense, lazy } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatOverlay from "./components/ChatOverlay";
import WelcomeSetupModal from "./components/WelcomeSetupModal";

// Lazy Loaded Sections for Code Splitting (Efficiency Optimization)
const HomeSection = lazy(() => import("./components/sections/HomeSection"));
const MatchesSection = lazy(() => import("./components/sections/MatchesSection"));
const RouteSection = lazy(() => import("./components/sections/RouteSection"));
const StadiumMapSection = lazy(() => import("./components/sections/StadiumMapSection"));
const CrowdSection = lazy(() => import("./components/sections/CrowdSection"));
const TransportSection = lazy(() => import("./components/sections/TransportSection"));
const AccessibilitySection = lazy(() => import("./components/sections/AccessibilitySection"));
const SustainabilitySection = lazy(() => import("./components/sections/SustainabilitySection"));
const OperationsSection = lazy(() => import("./components/sections/OperationsSection"));

const SectionLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)' }}>
    <div className="spinner"></div>
    <span style={{ marginLeft: '10px' }}>Loading module...</span>
  </div>
);

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState("metlife");
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  useEffect(() => {
    const completed = localStorage.getItem("stadiaiq_setup_completed");
    if (!completed) {
      setSetupModalOpen(true);
    } else {
      const storedVenue = localStorage.getItem("stadiaiq_venue");
      const storedMatch = localStorage.getItem("stadiaiq_match_id");
      if (storedVenue) setSelectedVenueId(storedVenue);
      if (storedMatch) setSelectedMatchId(storedMatch);
    }
  }, []);

  const handleSavePreferences = (prefs) => {
    if (prefs?.venueId) setSelectedVenueId(prefs.venueId);
    if (prefs?.matchId) setSelectedMatchId(prefs.matchId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <HomeSection
            onNavigate={setActiveSection}
            onOpenChat={() => setChatOpen(true)}
            selectedVenueId={selectedVenueId}
            selectedMatchId={selectedMatchId}
          />
        );
      case "matches":
        return (
          <MatchesSection
            onNavigate={setActiveSection}
            onSelectVenue={setSelectedVenueId}
          />
        );
      case "route":
        return (
          <RouteSection
            selectedVenueId={selectedVenueId}
            onSelectVenue={setSelectedVenueId}
          />
        );
      case "navigation":
        return <StadiumMapSection />;
      case "crowd":
        return <CrowdSection />;
      case "transport":
        return <TransportSection />;
      case "accessibility":
        return <AccessibilitySection />;
      case "sustainability":
        return <SustainabilitySection />;
      case "operations":
        return <OperationsSection selectedVenueId={selectedVenueId} />;
      default:
        return (
          <HomeSection
            onNavigate={setActiveSection}
            onOpenChat={() => setChatOpen(true)}
            selectedVenueId={selectedVenueId}
            selectedMatchId={selectedMatchId}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <div className="main">
        <Header
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleChat={() => setChatOpen(!chatOpen)}
          onOpenSetupModal={() => setSetupModalOpen(true)}
          selectedVenueId={selectedVenueId}
          selectedMatchId={selectedMatchId}
        />

        <main className="main__content">
          <Suspense fallback={<SectionLoader />}>
            {renderSection()}
          </Suspense>
        </main>
      </div>

      <ChatOverlay
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeSection={activeSection}
        selectedVenueId={selectedVenueId}
      />

      <WelcomeSetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSavePreferences={handleSavePreferences}
      />
    </div>
  );
}
