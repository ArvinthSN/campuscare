import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Settings, 
  User, 
  Bell,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDPIS } from '@/hooks/useDPIS';

const DPISNavigation = ({
  activeSection,
  setActiveSection,
  darkMode,
  toggleDarkMode,
  onLogout
}) => {
  const { user, getActiveChallenges } = useDPIS();
  const activeChallenges = getActiveChallenges();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'chatbot',
      label: 'AI Support',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: 'AI'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'community',
      label: 'Peer Support',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    }
  ];

  const getHouseColor = (house) => {
    const colors = {
      serenity: 'text-house-serenity',
      mindful: 'text-house-mindful', 
      harmony: 'text-house-harmony',
      balance: 'text-house-balance'
    };
    return colors[house] || 'text-primary';
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">DPIS</h1>
              <p className="text-xs text-muted-foreground">Mental Wellness</p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`relative h-10 px-4 transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-primary text-primary-foreground shadow-wellness' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  <span className="ml-2 hidden lg:inline">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 px-1.5 py-0.5 text-xs bg-accent text-accent-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="sm"
                className="relative hover:bg-muted"
              >
                <Bell className="w-5 h-5" />
                {activeChallenges.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeChallenges.length}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="hover:bg-muted"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </motion.div>

            {/* User Profile */}
            {user && (
              <motion.div 
                className="flex items-center space-x-3 pl-3 border-l border-border"
                whileHover={{ scale: 1.02 }}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{user.nickname}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs ${getHouseColor(user.house)}`}>
                      House {user.house}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Level {user.level}
                    </span>
                  </div>
                </div>
                
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className={`text-xs font-medium ${getHouseColor(user.house)}`}>
                    {user.nickname.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* XP Badge */}
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="bg-game-gold/20 text-game-gold px-2 py-1 rounded-full text-xs font-medium">
                    {user.xp} XP
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection('settings')}
                className="hover:bg-muted"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Logout */}
            {onLogout && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 4).map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  className={`relative ${
                    activeSection === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : ''
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DPISNavigation;
