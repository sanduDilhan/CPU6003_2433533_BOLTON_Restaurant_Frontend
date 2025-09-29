import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRedirect from './components/AdminRedirect';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';
import FavoritesDebug from './components/FavoritesDebug';
import FavoriteClickTest from './components/FavoriteClickTest';
import BookingTest from './components/BookingTest';
import CancelBookingTest from './components/CancelBookingTest';
import CancelBookingDemo from './components/CancelBookingDemo';
import CancelBookingButton from './components/CancelBookingButton';
import MyBookingsTest from './components/MyBookingsTest';
import Error403Test from './components/Error403Test';
import ReviewTest from './components/ReviewTest';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <AdminRedirect>
                  <Home />
                </AdminRedirect>
              } />
              <Route path="/restaurants" element={
                <AdminRedirect>
                  <RestaurantList />
                </AdminRedirect>
              } />
              <Route path="/restaurants/:id" element={
                <AdminRedirect>
                  <RestaurantDetail />
                </AdminRedirect>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User-only routes (hidden from admin) */}
              <Route path="/book/:restaurantId" element={
                <ProtectedRoute requireUser>
                  <BookingForm />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute requireUser>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute requireUser>
                  <Favorites />
                </ProtectedRoute>
              } />
              
              {/* Admin-only routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requireAdmin>
                  <Analytics />
                </ProtectedRoute>
              } />
            <Route path="/debug-favorites" element={<FavoritesDebug />} />
            <Route path="/test-favorite-click" element={<FavoriteClickTest />} />
            <Route path="/test-booking" element={<BookingTest />} />
            <Route path="/test-cancel-booking" element={<CancelBookingTest />} />
            <Route path="/cancel-booking-demo" element={<CancelBookingDemo />} />
            <Route path="/test-my-bookings" element={<MyBookingsTest />} />
            <Route path="/test-403-error" element={<Error403Test />} />
            <Route path="/test-reviews" element={<ReviewTest />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


