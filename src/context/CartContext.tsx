import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FoodItem, CartItem, CartItemOptionChoice, Coupon, CartRestaurantGroup } from '../types';
import { STORAGE_KEYS, TAX_RATE, BASE_DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../utils/constants';
import { mockCoupons } from '../data/mockCoupons';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantIds: string[];
  restaurantNames: string[];
  restaurantsInCart: { id: string; name: string; image?: string }[];
  restaurantGroups: CartRestaurantGroup[];
  isMultiRestaurant: boolean;
  coupon: Coupon | null;
  isCartDrawerOpen: boolean;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (food: FoodItem, options?: CartItemOptionChoice[], quantity?: number) => void;
  removeItem: (itemId: string) => void;
  removeRestaurantItems: (restaurantId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPON);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { success, error, info } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(STORAGE_KEYS.COUPON);
    }
  }, [coupon]);

  // Compute restaurant groups and multi-restaurant state
  const restaurantGroups = useMemo<CartRestaurantGroup[]>(() => {
    const groupMap = new Map<string, CartRestaurantGroup>();

    items.forEach((item) => {
      const restId = item.food.restaurantId;
      if (!groupMap.has(restId)) {
        groupMap.set(restId, {
          restaurantId: restId,
          restaurantName: item.food.restaurantName || 'Campus Eatery',
          restaurantImage: item.food.image,
          items: [],
          subtotal: 0,
          itemCount: 0,
        });
      }
      const group = groupMap.get(restId)!;
      group.items.push(item);
      group.subtotal += item.totalPrice;
      group.itemCount += item.quantity;
    });

    return Array.from(groupMap.values());
  }, [items]);

  const restaurantsInCart = useMemo(() => {
    return restaurantGroups.map((g) => ({
      id: g.restaurantId,
      name: g.restaurantName,
      image: g.restaurantImage,
    }));
  }, [restaurantGroups]);

  const restaurantIds = useMemo(() => {
    return restaurantsInCart.map((r) => r.id);
  }, [restaurantsInCart]);

  const restaurantNames = useMemo(() => {
    return restaurantsInCart.map((r) => r.name);
  }, [restaurantsInCart]);

  const isMultiRestaurant = restaurantIds.length > 1;

  const restaurantId = restaurantsInCart.length > 0 ? restaurantsInCart[0].id : null;
  const restaurantName = useMemo(() => {
    if (restaurantsInCart.length === 0) return null;
    if (restaurantsInCart.length === 1) return restaurantsInCart[0].name;
    return restaurantsInCart.map((r) => r.name).join(' & ');
  }, [restaurantsInCart]);

  const cartCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [items]);

  // Delivery fee logic: free over threshold or coupon 'FREEDEL'
  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    if (coupon?.code === 'FREEDEL') return 0;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
    return BASE_DELIVERY_FEE;
  }, [items.length, coupon, subtotal]);

  // Discount calculation based on coupon
  const discount = useMemo(() => {
    if (!coupon || items.length === 0) return 0;
    if (subtotal < coupon.minOrder) return 0;

    if (coupon.discountType === 'percentage') {
      const calculated = (subtotal * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    } else if (coupon.discountType === 'flat') {
      if (coupon.code === 'FREEDEL') return 0; // Handled in delivery fee
      return Math.min(coupon.discountValue, subtotal);
    }
    return 0;
  }, [coupon, subtotal, items.length]);

  const tax = useMemo(() => {
    return items.length > 0 ? Number((Math.max(0, subtotal - discount) * TAX_RATE).toFixed(2)) : 0;
  }, [subtotal, discount, items.length]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Number((Math.max(0, subtotal - discount) + deliveryFee + tax).toFixed(2));
  }, [subtotal, discount, deliveryFee, tax, items.length]);

  const addItem = (food: FoodItem, options: CartItemOptionChoice[] = [], quantity = 1) => {
    const isNewRestaurant = items.length > 0 && !items.some((i) => i.food.restaurantId === food.restaurantId);

    const optionsKey = options
      .map((o) => `${o.groupName}:${o.choiceName}`)
      .sort()
      .join('|');
    const itemId = `${food.id}_${optionsKey || 'standard'}`;

    const extraPrice = options.reduce((sum, o) => sum + o.extraPrice, 0);
    const unitPrice = food.price + extraPrice;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              totalPrice: Number((unitPrice * newQty).toFixed(2)),
            };
          }
          return item;
        });
      }

      return [
        ...prev,
        {
          id: itemId,
          food,
          quantity,
          selectedOptions: options,
          itemPrice: unitPrice,
          totalPrice: Number((unitPrice * quantity).toFixed(2)),
        },
      ];
    });

    if (isNewRestaurant) {
      success(`Added ${food.name} from ${food.restaurantName}! Multi-restaurant campus order active 🚀`);
    } else {
      success(`Added ${food.name} to cart`);
    }
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    info('Item removed from cart');
  };

  const removeRestaurantItems = (targetRestaurantId: string) => {
    const targetGroup = restaurantGroups.find((g) => g.restaurantId === targetRestaurantId);
    setItems((prev) => prev.filter((i) => i.food.restaurantId !== targetRestaurantId));
    info(`Removed items from ${targetGroup?.restaurantName || 'restaurant'}`);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: Number((item.itemPrice * newQuantity).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const foundCoupon = mockCoupons.find((c) => c.code === cleanCode && c.isActive);

    if (!foundCoupon) {
      error(`Coupon code "${cleanCode}" is invalid.`, 'Invalid Promo Code');
      return false;
    }

    if (subtotal < foundCoupon.minOrder) {
      error(
        `This promo requires a minimum order of ₹${foundCoupon.minOrder.toFixed(2)}.`,
        'Minimum Order Not Met'
      );
      return false;
    }

    setCoupon(foundCoupon);
    success(`Promo code "${cleanCode}" applied!`, 'Discount Added');
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    info('Promo code removed');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        restaurantId,
        restaurantName,
        restaurantIds,
        restaurantNames,
        restaurantsInCart,
        restaurantGroups,
        isMultiRestaurant,
        coupon,
        isCartDrawerOpen,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        addItem,
        removeItem,
        removeRestaurantItems,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
