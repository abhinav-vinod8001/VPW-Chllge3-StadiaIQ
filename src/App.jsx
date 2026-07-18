import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatOverlay from './components/ChatOverlay';
import WelcomeSetupModal from './components/WelcomeSetupModal';

// Sections
import HomeSection from './components/sections/HomeSection';
import MatchesSection from './components/sections/MatchesSection';
import RouteSection from './components/sections/RouteSection';
import StadiumMapSection from './components/sections/StadiumMapSection';
import CrowdSection from './components/sections/CrowdSection';
import TransportSection from './components/sections/TransportSection';
import AccessibilitySection from './components/sections/AccessibilitySection';
import SustainabilitySection from './components/sections/SustainabilitySection';
import OperationsSection from './components/sections/OperationsSection';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState('metlife');
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  useEffect(() => {
    const completed = localStorage.getItem('stadiaiq_setup_completed');
    if (!completed) {
      setSetupModalOpen(true);
    } else {
      const storedVenue = localStorage.getItem('stadiaiq_venue');
      const storedMatch = localStorage.getItem('stadiaiq_match_id');
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
      case 'home':
        return <HomeSection onNavigate={setActiveSection} onOpenChat={() => setChatOpen(true)} selectedVenueId={selectedVenueId} selectedMatchId={selectedMatchId} />;
      case 'matches':
        return <MatchesSection onNavigate={setActiveSection} onSelectVenue={setSelectedVenueId} />;
      case 'route':
        return <RouteSection selectedVenueId={selectedVenueId} onSelectVenue={setSelectedVenueId} />;
      case 'navigation':
        return <StadiumMapSection />;
      case 'crowd':
        return <CrowdSection />;
      case 'transport':
        return <TransportSection />;
      case 'accessibility':
        return <AccessibilitySection />;
      case 'sustainability':
        return <SustainabilitySection />;
      case 'operations':
        return <OperationsSection selectedVenueId={selectedVenueId} />;
      default:
        return <HomeSection onNavigate={setActiveSection} onOpenChat={() => setChatOpen(true)} selectedVenueId={selectedVenueId} selectedMatchId={selectedMatchId} />;
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
          {renderSection()}
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
