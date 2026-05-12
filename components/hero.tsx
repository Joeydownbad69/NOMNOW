"use client";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";

interface HeroProps {
  onSearch?: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-accent/30 via-background to-background py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Delicious food,
            <span className="text-primary"> delivered </span>
            to your door
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty">
            Order from your favorite local restaurants and enjoy fresh, hot meals in minutes. Fast delivery, easy ordering.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your delivery address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Find Food</span>
            </button>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl">🍔</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Restaurants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">30 min</p>
                <p className="text-sm text-muted-foreground">Avg. Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-8 lg:right-16 hidden lg:block">
        <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
