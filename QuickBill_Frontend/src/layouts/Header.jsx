import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, User, ChevronDown, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick, sidebarCollapsed }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="h-[var(--header-height)] bg-white border-b border-[var(--color-border)]
        flex items-center justify-between px-4 md:px-6 sticky top-0 z-30"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]
            transition-colors cursor-pointer"
          id="sidebar-toggle-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo (mobile only, when sidebar hidden) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-primary)] rounded-lg">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[var(--color-text-primary)]">QuickBill</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <button
          className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)]
            text-[var(--color-text-secondary)] transition-colors cursor-pointer"
          id="notification-btn"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-[var(--color-surface-hover)]
              transition-colors cursor-pointer"
            id="profile-dropdown-btn"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[var(--color-text-primary)]">
              {user?.fullName || 'Admin'}
            </span>
            <ChevronDown className={`hidden sm:block w-4 h-4 text-[var(--color-text-muted)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--color-border)] py-1 animate-slide-down z-50">
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user?.fullName}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--color-danger)]
                  hover:bg-red-50 transition-colors cursor-pointer"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
