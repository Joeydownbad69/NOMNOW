"use client";

import { useState } from "react";
import { LogOut, Settings, History, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ProfileDropdownProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  isEmailConfirmed?: boolean;
}

export function ProfileDropdown({
  email,
  isOpen,
  onClose,
  isEmailConfirmed = false,
}: ProfileDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - no blur */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground truncate">
            {email}
          </p>
          {!isEmailConfirmed && (
            <p className="text-xs text-amber-600 mt-1">
              Email not confirmed
            </p>
          )}
        </div>

        {/* Menu Items */}
        <div className="p-1">
          {/* Settings */}
          <Link
            href="/settings"
            className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors group"
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* Order History */}
          <Link
            href="/orders"
            className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors group"
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              <span>Order History</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* Payment Methods */}
          <Link
            href="/payment-methods"
            className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors group"
            onClick={onClose}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              <span>Payment Methods</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* Divider */}
          <div className="my-1 h-px bg-border" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
