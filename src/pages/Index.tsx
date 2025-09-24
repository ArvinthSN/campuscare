import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import LandingPage from '@/components/dpis/LandingPage';
import DPISNavigation from '@/components/dpis/DPISNavigation';
import Dashboard from '@/components/dpis/Dashboard';
import OracleChat from '@/components/OracleChat';
import Profile from '@/components/Profile';
import  MindGames from '@/components/MindGames'; // Correct import

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { darkMode, toggleDarkMode } = useApp();

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} />;
      case 'chatbot':
        return <OracleChat />;
      case 'games': // Add this new case
        return <MindGames />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DPISNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main>
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default Index;