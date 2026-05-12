"use client";

import { useState } from "react";
import { Menu, X, ShoppingCart, User, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ProfileDropdown } from "./profile-dropdown";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  onAuthClick?: () => void;
  user?: { email?: string } | null;
  isEmailConfirmed?: boolean;
}

export function Header({ 
  cartCount = 0, 
  onCartClick, 
  onAuthClick, 
  user,
  isEmailConfirmed 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">NOM</span>
            <span className="text-2xl font-bold text-foreground">NOW</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/restaurants" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Restaurants
            </Link>
            <Link 
              href="/orders" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Orders
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button 
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* User Menu / Auth Button */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 h-10 bg-secondary text-foreground text-sm font-medium rounded-full hover:bg-secondary/80 transition-colors"
                >
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="max-w-[120px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                  {!isEmailConfirmed && (
                    <span className="w-2 h-2 bg-amber-500 rounded-full" title="Email not confirmed" />
                  )}
                </button>

                {/* Profile Dropdown */}
                <ProfileDropdown
                  email={user.email || ""}
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  isEmailConfirmed={isEmailConfirmed}
                />
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="hidden sm:flex items-center justify-center px-4 h-10 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/menu" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Menu
              </Link>
              <Link 
                href="/restaurants" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Restaurants
              </Link>
              <Link 
                href="/orders" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Orders
              </Link>
              
              {user ? (
                <>
                  <div className="mt-2 mx-4 px-3 py-2 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email}
                    </p>
                    {!isEmailConfirmed && (
                      <p className="text-xs text-amber-600 mt-1">
                        Email not confirmed
                      </p>
                    )}
                  </div>
                  <Link 
                    href="/orders"
                    className="mt-2 mx-4 flex items-center justify-center px-4 h-10 bg-secondary text-foreground text-sm font-medium rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    View Orders
                  </Link>
                </>
              ) : (
                <button 
                  onClick={onAuthClick}
                  className="mt-2 mx-4 flex items-center justify-center px-4 h-10 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
