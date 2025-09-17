import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, MapPin, Calendar, Users, Camera, MessageCircle, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { name: 'Explore', href: '/explore', icon: MapPin },
    { name: 'Itinerary', href: '/itinerary', icon: Calendar },
    { name: 'Culture', href: '/culture', icon: Users },
    { name: 'Community', href: '/community', icon: Camera },
    { name: 'Assistant', href: '/assistant', icon: MessageCircle },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center"
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-playfair font-bold text-gradient-hero">
              Jharkhand Tourism
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Theme Toggle, Sign Out & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-md"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors justify-start"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};