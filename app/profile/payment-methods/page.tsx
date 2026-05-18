"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Plus, Trash2, Loader2, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PaymentMethod {
  id: string;
  card_last_four: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form state for adding new card
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }

      setUserId(user.id);

      // Fetch payment methods
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (data) {
        setPaymentMethods(data);
      }

      setLoading(false);
    };

    fetchPaymentMethods();
  }, [router]);

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳 Visa";
      case "mastercard":
        return "💳 Mastercard";
      case "amex":
        return "💳 Amex";
      default:
        return "💳 Card";
    }
  };

  const detectCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    return "Card";
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ").slice(0, 19) : "";
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const cleanedNumber = cardNumber.replace(/\s/g, "");
    
    if (cleanedNumber.length < 15) {
      setError("Invalid card number");
      setSaving(false);
      return;
    }

    const supabase = createClient();

    try {
      const brand = detectCardBrand(cleanedNumber);
      const lastFour = cleanedNumber.slice(-4);
      const isFirstCard = paymentMethods.length === 0;

      const { error } = await supabase.from("payment_methods").insert({
        user_id: userId,
        card_last_four: lastFour,
        card_brand: brand,
        expiry_month: parseInt(expiryMonth),
        expiry_year: parseInt(expiryYear),
        is_default: isFirstCard,
      });

      if (error) throw error;

      // Refresh payment methods
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });

      if (data) {
        setPaymentMethods(data);
      }

      // Reset form
      setCardNumber("");
      setExpiryMonth("");
      setExpiryYear("");
      setCvv("");
      setShowAddForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add card";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    const supabase = createClient();

    try {
      await supabase.from("payment_methods").delete().eq("id", id);
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  };

  const handleSetDefault = async (id: string) => {
    const supabase = createClient();

    try {
      // First, unset all as default
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", userId);

      // Then set the selected one as default
      await supabase
        .from("payment_methods")
        .update({ is_default: true })
        .eq("id", id);

      // Update local state
      setPaymentMethods(
        paymentMethods.map((pm) => ({
          ...pm,
          is_default: pm.id === id,
        }))
      );
    } catch (err) {
      console.error("Failed to set default:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Payment Methods</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Payment Methods List */}
        {paymentMethods.length > 0 && (
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${
                  pm.is_default ? "border-primary" : "border-border"
                }`}
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {getCardIcon(pm.card_brand)} **** {pm.card_last_four}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {pm.expiry_month.toString().padStart(2, "0")}/{pm.expiry_year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pm.is_default ? (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(pm.id)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Delete card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {paymentMethods.length === 0 && !showAddForm && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No payment methods</h2>
            <p className="text-muted-foreground mt-1 mb-6">
              Add a card to make checkout faster
            </p>
          </div>
        )}

        {/* Add Card Form */}
        {showAddForm ? (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Add New Card</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength={19}
                    className="w-full h-12 pl-10 pr-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="expiryMonth" className="block text-sm font-medium text-foreground mb-1.5">
                    Month
                  </label>
                  <select
                    id="expiryMonth"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {(i + 1).toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="expiryYear" className="block text-sm font-medium text-foreground mb-1.5">
                    Year
                  </label>
                  <select
                    id="expiryYear"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    required
                    className="w-full h-12 px-4 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">YY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-1.5">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    required
                    maxLength={4}
                    className="w-full h-12 px-4 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Add Card
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full h-14 bg-card border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Payment Method
          </button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Your card information is securely stored. We never store your full card number.
        </p>
      </main>
    </div>
  );
}
