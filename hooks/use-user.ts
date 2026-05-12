"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface UserState {
  user: User | null;
  isLoading: boolean;
  isEmailConfirmed: boolean;
}

export function useUser(): UserState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if email is confirmed
  // Supabase sets email_confirmed_at when the user confirms their email
  const isEmailConfirmed = user?.email_confirmed_at != null;

  return { user, isLoading, isEmailConfirmed };
}
