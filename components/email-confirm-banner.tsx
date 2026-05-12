"use client";

import { useState } from "react";
import { Mail, X, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EmailConfirmBannerProps {
  email: string;
  onDismiss?: () => void;
}

export function EmailConfirmBanner({ email, onDismiss }: EmailConfirmBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setResendSuccess(false);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    });

    setIsResending(false);

    if (error) {
      setError(error.message);
    } else {
      setResendSuccess(true);
    }
  };

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">Confirm your email</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Please confirm your email address to proceed to checkout. Check your inbox for a confirmation link.
          </p>
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
          
          {resendSuccess ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Confirmation email sent!</span>
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="mt-3 text-sm font-medium text-primary hover:underline disabled:opacity-50 flex items-center gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend confirmation email"
              )}
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
