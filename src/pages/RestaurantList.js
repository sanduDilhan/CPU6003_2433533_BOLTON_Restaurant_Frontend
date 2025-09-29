import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilters from '../components/SearchFilters';
import api from '../services/api';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const RestaurantList = () => {
  const { user, updateUser } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRestaurants();
    loadFavorites();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user || !user.id) {
      setFavorites([]);
      return;
    }

    try {
      const response = await userAPI.getUserFavorites(user.id);
      if (response.success) {
        setFavorites(response.favorites?.map(r => r.id) || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleToggleFavorite = async (restaurantId) => {
    console.log('RestaurantList: handleToggleFavorite called for restaurant:', restaurantId);
    console.log('RestaurantList: User:', user);
    
    if (!user || !user.id) {
      console.log('RestaurantList: User not authenticated');
      alert('Please login to add favorites');
      return;
    }

    const isCurrentlyFavorite = favorites.includes(restaurantId);
    console.log('RestaurantList: Current favorite status:', isCurrentlyFavorite);

    try {
      let response;
      if (isCurrentlyFavorite) {
        console.log('RestaurantList: Removing from favorites for user:', user.id, 'restaurant:', restaurantId);
        response = await userAPI.removeFromFavorites(user.id, restaurantId);
      } else {
        console.log('RestaurantList: Adding to favorites for user:', user.id, 'restaurant:', restaurantId);
        response = await userAPI.addToFavorites(user.id, restaurantId);
      }
      
      console.log('RestaurantList: API response:', response);
      
      if (response.success) {
        const newFavorites = response.favorites?.map(r => r.id) || [];
        console.log('RestaurantList: Setting favorites to:', newFavorites);
        setFavorites(newFavorites);
        
        // Update user in auth context
        const updatedUser = { ...user, favorites: newFavorites };
        updateUser(updatedUser);
        
        console.log('RestaurantList: Favorites updated successfully');
      } else {
        console.error('RestaurantList: API failed:', response.error);
        alert(response.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('RestaurantList: Error updating favorite:', error);
      console.error('RestaurantList: Error details:', error.response?.data);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.minRating) params.append('minRating', filters.minRating);

      const response = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(response.data);
      setError(null);
    } catch (error) {
      console.error('Error searching restaurants:', error);
      setError('Failed to search restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchFilters onSearch={handleSearch} />
      
      <Container className="py-5">
        <Row>
          <Col>
            <h2 className="mb-4">All Restaurants</h2>
            
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading restaurants...</p>
              </div>
            ) : restaurants.length === 0 ? (
              <Alert variant="info">
                No restaurants found. Try adjusting your search criteria.
              </Alert>
            ) : (
              <Row>
                {restaurants.map(restaurant => (
                  <Col key={restaurant.id} lg={4} md={6} className="mb-4">
                    <RestaurantCard
                      restaurant={restaurant}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(restaurant.id)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RestaurantList;


