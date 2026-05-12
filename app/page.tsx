"use client";

import { useState } from "react";
import useSWR from "swr";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { CategoryBar } from "@/components/category-bar";
import { MenuGrid } from "@/components/menu-grid";
import { CartDrawer, CartItem } from "@/components/cart-drawer";
import { AuthModal } from "@/components/auth-modal";
import { Footer } from "@/components/footer";
import { MenuItem } from "@/components/menu-item-card";
import { useUser } from "@/hooks/use-user";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Sample menu items for demo when API is empty
const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, and our special sauce",
    price: 12.99,
    rating: 4.8,
    prep_time: "15-20 min",
    restaurants: { name: "Burger Palace", slug: "burger-palace" },
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomatoes, and basil on a crispy thin crust",
    price: 16.99,
    rating: 4.9,
    prep_time: "20-25 min",
    restaurants: { name: "Pizza Heaven", slug: "pizza-heaven" },
  },
  {
    id: "3",
    name: "Spicy Tuna Roll",
    description: "Fresh tuna with spicy mayo, cucumber, and avocado wrapped in seaweed",
    price: 14.99,
    rating: 4.7,
    prep_time: "10-15 min",
    restaurants: { name: "Sushi Master", slug: "sushi-master" },
  },
  {
    id: "4",
    name: "Chicken Tacos",
    description: "Three soft tacos with grilled chicken, salsa verde, and fresh cilantro",
    price: 11.99,
    rating: 4.6,
    prep_time: "15-20 min",
    restaurants: { name: "Taco Fiesta", slug: "taco-fiesta" },
  },
  {
    id: "5",
    name: "Pad Thai",
    description: "Rice noodles stir-fried with shrimp, eggs, peanuts, and tamarind sauce",
    price: 13.99,
    rating: 4.8,
    prep_time: "20-25 min",
    restaurants: { name: "Thai Orchid", slug: "thai-orchid" },
  },
  {
    id: "6",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing",
    price: 9.99,
    rating: 4.5,
    prep_time: "5-10 min",
    restaurants: { name: "Green Garden", slug: "green-garden" },
  },
  {
    id: "7",
    name: "Chicken Tikka Masala",
    description: "Tender chicken in a rich, creamy tomato curry sauce with basmati rice",
    price: 15.99,
    rating: 4.9,
    prep_time: "25-30 min",
    restaurants: { name: "Spice Route", slug: "spice-route" },
  },
  {
    id: "8",
    name: "BBQ Bacon Burger",
    description: "Smoky BBQ sauce, crispy bacon, onion rings, and cheddar on a brioche bun",
    price: 14.99,
    rating: 4.7,
    prep_time: "15-20 min",
    restaurants: { name: "Burger Palace", slug: "burger-palace" },
  },
];

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("all");

  const { user, isEmailConfirmed } = useUser();
  const { data, isLoading } = useSWR("/api/menu", fetcher);
  
  // Use API data if available, otherwise use sample items
  const menuItems: MenuItem[] = data?.length > 0 ? data : sampleMenuItems;

  const filteredItems = category === "all" 
    ? menuItems 
    : menuItems.filter(item => 
        item.categories?.name?.toLowerCase().includes(category) ||
        item.name.toLowerCase().includes(category)
      );

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity } : ci
        )
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleCheckout = () => {
    // Check if user is authenticated, if not show auth modal
    setAuthOpen(true);
  };

  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthOpen(true)}
        user={user}
        isEmailConfirmed={isEmailConfirmed}
      />
      
      <main className="flex-1">
        <Hero />
        <CategoryBar onCategoryChange={setCategory} />
        <MenuGrid 
          items={filteredItems}
          title="Popular Near You"
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        
        {/* Featured Section */}
        <section className="py-12 bg-accent/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promo Card 1 */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8">
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-primary-foreground/20 text-primary-foreground text-xs font-medium rounded-full mb-3">
                    Limited Time
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                    Free Delivery
                  </h3>
                  <p className="mt-2 text-primary-foreground/80 max-w-xs">
                    On your first order. Use code WELCOME at checkout.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-primary-foreground text-primary font-medium rounded-full hover:bg-primary-foreground/90 transition-colors">
                    Order Now
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-20">
                  🚀
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-6 sm:p-8">
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-background/20 text-background text-xs font-medium rounded-full mb-3">
                    New Feature
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-background">
                    Group Ordering
                  </h3>
                  <p className="mt-2 text-background/80 max-w-xs">
                    Split the bill easily with friends and family.
                  </p>
                  <button className="mt-4 px-6 py-2 bg-background text-foreground font-medium rounded-full hover:bg-background/90 transition-colors">
                    Learn More
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-20">
                  👥
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Getting your favorite food has never been easier
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Choose Restaurant",
                  description: "Browse local restaurants and explore their menus",
                  icon: "🏪",
                },
                {
                  step: "2",
                  title: "Place Your Order",
                  description: "Add items to cart and checkout securely",
                  icon: "🛒",
                },
                {
                  step: "3",
                  title: "Fast Delivery",
                  description: "Track your order and enjoy your meal",
                  icon: "🚴",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-20 h-20 mx-auto bg-accent/50 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        user={user}
        isEmailConfirmed={isEmailConfirmed}
        onSignInClick={() => setAuthOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
        }}
      />
    </div>
  );
}
