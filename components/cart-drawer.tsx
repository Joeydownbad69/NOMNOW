"use client";

import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { MenuItem } from "./menu-item-card";
import { EmailConfirmBanner } from "./email-confirm-banner";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  user?: { email?: string } | null;
  isEmailConfirmed?: boolean;
  onSignInClick?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  user,
  isEmailConfirmed = true,
  onSignInClick,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  const canCheckout = user && isEmailConfirmed;

  return (
    <>
      {/* Backdrop - no blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Popover - small floating window */}
      <div
        className={`fixed bottom-6 right-6 w-96 max-h-[600px] bg-card border border-border rounded-2xl z-50 shadow-xl transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Cart</h3>
              {items.length > 0 && (
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-center">
                <ShoppingBag className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex gap-2 p-2 bg-secondary/50 rounded-lg text-sm"
                  >
                    {/* Image */}
                    <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">🍽️</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground text-xs line-clamp-1">
                        {item.name}
                      </h5>
                      <p className="text-xs font-semibold text-primary mt-0.5">
                        ${(item.price * quantity).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                          }
                          className="w-5 h-5 flex items-center justify-center bg-card border border-border rounded hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-4 text-center text-xs font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center bg-card border border-border rounded hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-3 border-t border-border bg-card space-y-3">
              {/* Email Confirmation Banner */}
              {user && !isEmailConfirmed && (
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-700">
                    Confirm your email to checkout
                  </p>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              {!user ? (
                <button
                  onClick={onSignInClick}
                  className="w-full h-9 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign In to Checkout
                </button>
              ) : !isEmailConfirmed ? (
                <button
                  disabled
                  className="w-full h-9 bg-muted text-muted-foreground font-medium text-sm rounded-lg cursor-not-allowed"
                >
                  Confirm Email
                </button>
              ) : (
                <button
                  onClick={onCheckout}
                  className="w-full h-9 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
