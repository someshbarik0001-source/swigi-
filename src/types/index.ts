export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  landmark?: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi';
  title: string;
  details: string; // e.g., '•••• 4242' or 'user@okaxis'
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  savedAddresses: Address[];
  paymentMethods: SavedPaymentMethod[];
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string;
  bannerImage: string;
  rating: number;
  reviewsCount: number;
  cuisines: string[];
  deliveryTime: number; // in minutes, e.g. 25
  deliveryFee: number;
  minOrder: number;
  address: string;
  phone: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  isFeatured: boolean;
  isPromoted: boolean;
  discountText?: string;
  isOpen: boolean;
  tags: string[];
  distanceKm: number;
  // Excel Sheet Metadata
  areaZone?: string;
  serviceModes?: string;
  menuCollectionStatus?: string;
  sourceOrVerificationNote?: string;
}

export interface FoodCustomizationOption {
  name: string;
  choices: {
    name: string;
    extraPrice: number;
  }[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  categoryName: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  calories?: number;
  preparationTime?: number; // minutes
  ingredients?: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  options?: FoodCustomizationOption[];
  // Excel Sheet Metadata
  dietType?: 'Veg' | 'Non-veg';
  source?: string;
  publicationStatus?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItemOptionChoice {
  groupName: string;
  choiceName: string;
  extraPrice: number;
}

export interface CartItem {
  id: string; // unique item id (foodId + options hash)
  food: FoodItem;
  quantity: number;
  selectedOptions?: CartItemOptionChoice[];
  itemPrice: number; // unit price with options
  totalPrice: number; // itemPrice * quantity
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  current?: boolean;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  photo: string;
  vehicleNumber: string;
  rating: number;
  currentLocationName: string;
  estimatedMinutes: number;
}

export interface CartRestaurantGroup {
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
  restaurantIds?: string[];
  restaurantNames?: string[];
  isMultiRestaurant?: boolean;
  items: CartItem[];
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: 'cod' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'completed' | 'failed';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  specialInstructions?: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryPartner?: DeliveryPartner;
  timeline: OrderTimelineEvent[];
}

export interface Review {
  id: string;
  restaurantId?: string;
  foodId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  validTill: string;
  description: string;
  usageCount: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface RestaurantFilterState {
  searchQuery: string;
  cuisine: string;
  zone?: string;
  minRating: number;
  maxDeliveryTime: number;
  sortBy: 'recommended' | 'rating' | 'deliveryTime' | 'costLow' | 'costHigh';
  pureVeg: boolean;
  offersOnly: boolean;
}

export interface FoodFilterState {
  searchQuery: string;
  category: string;
  isVegOnly: boolean;
  priceRange: [number, number];
  sortBy: 'popular' | 'priceLow' | 'priceHigh' | 'rating';
  isBestsellerOnly: boolean;
}

