import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  FileSpreadsheet,
  Zap,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/pos', label: 'Billing / POS', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)]
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-0 lg:w-[var(--sidebar-collapsed-width)] -translate-x-full lg:translate-x-0' : 'w-[var(--sidebar-width)] translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[var(--header-height)] border-b border-white/10 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 bg-[var(--color-primary)] rounded-xl shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white whitespace-nowrap">QuickBill</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-[var(--color-sidebar-text)] hover:bg-white/8 hover:text-white'
                }
                ${collapsed ? 'justify-center lg:justify-center' : ''}
                `
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button (desktop only) */}
        <div className="hidden lg:block px-3 pb-4">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full p-2.5 rounded-xl
              hover:bg-white/10 text-[var(--color-sidebar-text)] transition-colors cursor-pointer"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
