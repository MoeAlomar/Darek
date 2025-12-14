// src/components/NavigationHeader.tsx
import { Button } from "./ui/button";
import { User, Menu } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavigationHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const userType = user?.role;
  const currentPage = location.pathname;

  // Don't show the header on login/register pages
  if (currentPage === '/login' || currentPage === '/register') {
    return null;
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">US</span>
            </div>
            <span className="text-xl text-foreground">UniStay KSA</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/search")}
              className={`transition-colors ${currentPage === '/search' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              Find Housing
            </button>
            <button
              onClick={() => navigate("/roommates")}
              className={`transition-colors ${currentPage === '/roommates' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              Find Roommate
            </button>
            {isLoggedIn && userType === "landlord" && (
              <button
                onClick={() => navigate("/listings/dashboard")}
                className={`transition-colors ${currentPage === '/listings/dashboard' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Dashboard
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={() => navigate("/messages")}
                className={`transition-colors ${currentPage === '/messages' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Messages
              </button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-foreground"
              >
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </>
          ) : (
            <Button variant="outline" size="icon" onClick={logout}>
              <User className="w-5 h-5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}