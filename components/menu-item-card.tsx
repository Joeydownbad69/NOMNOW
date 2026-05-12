"use client";

import { Plus, Star } from "lucide-react";
import Image from "next/image";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  rating?: number;
  prep_time?: string;
  categories?: { name: string };
  restaurants?: { name: string; slug: string };
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/50 to-primary/20">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-card/90 backdrop-blur-sm rounded-full">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-medium text-foreground">{item.rating}</span>
          </div>
        )}

        {/* Quick Add Button */}
        <button
          onClick={() => onAddToCart?.(item)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary/90 shadow-lg"
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Restaurant Name */}
        {item.restaurants?.name && (
          <p className="text-xs font-medium text-primary mb-1">
            {item.restaurants.name}
          </p>
        )}

        {/* Item Name */}
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">
            ${item.price.toFixed(2)}
          </p>
          {item.prep_time && (
            <p className="text-xs text-muted-foreground">
              {item.prep_time}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
