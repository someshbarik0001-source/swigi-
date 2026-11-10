import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './context/LocationContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & User Pages
import { LandingPage } from './pages/public/LandingPage';
import { RestaurantListingPage } from './pages/public/RestaurantListingPage';
import { RestaurantDetailPage } from './pages/public/RestaurantDetailPage';
import { FoodSearchPage } from './pages/public/FoodSearchPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { OrderSuccessPage } from './pages/public/OrderSuccessPage';
import { OrderTrackingPage } from './pages/user/OrderTrackingPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { WishlistPage } from './pages/user/WishlistPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { AlgorithmLabPage } from './pages/public/AlgorithmLabPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OtpVerificationPage } from './pages/auth/OtpVerificationPage';

// Admin Pages
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminOrderManagement } from './pages/admin/AdminOrderManagement';
import { AdminRestaurantManagement } from './pages/admin/AdminRestaurantManagement';
import { AdminFoodManagement } from './pages/admin/AdminFoodManagement';
import { AdminUserManagement } from './pages/admin/AdminUserManagement';
import { AdminCouponsManagement } from './pages/admin/AdminCouponsManagement';
import { AdminDeliveryManagement } from './pages/admin/AdminDeliveryManagement';
import { AdminReportsAnalytics } from './pages/admin/AdminReportsAnalytics';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// 404
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <LocationProvider>
            <NotificationProvider>
              <CartProvider>
                <WishlistProvider>
                  <OrderProvider>
                    <BrowserRouter>
                      <Routes>
                        {/* Public & Customer Experience Layout */}
                        <Route element={<MainLayout />}>
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/restaurants" element={<RestaurantListingPage />} />
                          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                          <Route path="/search" element={<FoodSearchPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                          <Route path="/track/:orderId" element={<OrderTrackingPage />} />
                          <Route path="/track" element={<OrderTrackingPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/notifications" element={<NotificationsPage />} />
                          <Route path="/algorithms" element={<AlgorithmLabPage />} />
                          <Route path="/daa-lab" element={<AlgorithmLabPage />} />
                        </Route>

                        {/* Authentication Flow Layout */}
                        <Route element={<AuthLayout />}>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignupPage />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/otp" element={<OtpVerificationPage />} />
                        </Route>

                        {/* Admin Management Dashboard Layout */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<AdminDashboardOverview />} />
                          <Route path="orders" element={<AdminOrderManagement />} />
                          <Route path="restaurants" element={<AdminRestaurantManagement />} />
                          <Route path="foods" element={<AdminFoodManagement />} />
                          <Route path="users" element={<AdminUserManagement />} />
                          <Route path="coupons" element={<AdminCouponsManagement />} />
                          <Route path="delivery" element={<AdminDeliveryManagement />} />
                          <Route path="reports" element={<AdminReportsAnalytics />} />
                          <Route path="settings" element={<AdminSettingsPage />} />
                        </Route>

                        {/* 404 Catch All */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </BrowserRouter>
                  </OrderProvider>
                </WishlistProvider>
              </CartProvider>
            </NotificationProvider>
          </LocationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

