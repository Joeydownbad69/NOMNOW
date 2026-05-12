"use client";

import { useState } from "react";

const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "burger", name: "Burgers", icon: "🍔" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "sushi", name: "Sushi", icon: "🍣" },
  { id: "mexican", name: "Mexican", icon: "🌮" },
  { id: "chinese", name: "Chinese", icon: "🥡" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "salad", name: "Salads", icon: "🥗" },
  { id: "dessert", name: "Desserts", icon: "🍰" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
];

interface CategoryBarProps {
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryBar({ onCategoryChange }: CategoryBarProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <section className="py-6 bg-card border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
