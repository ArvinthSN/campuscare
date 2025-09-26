import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  HomeIcon,
  GamepadIcon,
  MessageCircleIcon,
  UserIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const { darkMode, toggleDarkMode, profile } = useApp();

  const navItems = [
    { id: 'sanctuary', label: 'Sanctuary', icon: HomeIcon },
    { id: 'games', label: 'Mind Games', icon: GamepadIcon },
    { id: 'oracle', label: 'Oracle Chat', icon: MessageCircleIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4">
      {/* Top row: logo, nav items, user */}
      <div className="max-w-full mx-auto flex items-center gap-3">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-wellness rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl">
            C
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
              CampusCare
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Mental Wellness Hub</p>
          </div>
        </div>

        {/* CENTER: Desktop nav */}
        <div className="flex-1 min-w-0 mx-3">
          <div className="hidden md:flex items-center gap-4 overflow-x-auto whitespace-nowrap px-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="md"
                  onClick={() => setActiveSection(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-gradient-wellness text-white shadow-lg'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: User info + theme toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:flex flex-col">
            <p className="text-sm sm:text-base font-medium">{profile.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {profile.xp.toLocaleString()} XP
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-purple-pink rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="p-1 sm:p-2"
          >
            {darkMode
              ? <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              : <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border p-2 sm:p-3">
        <div className="flex justify-around gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-wellness text-white'
                    : 'hover:bg-primary/10'
                }`}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[10px] sm:text-xs mt-1">{item.label}</span>
              </Button>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg"
          >
            {darkMode
              ? <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              : <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            <span className="text-[10px] sm:text-xs mt-1">Theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
