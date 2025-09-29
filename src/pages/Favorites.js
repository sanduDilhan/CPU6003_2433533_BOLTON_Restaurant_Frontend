import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Favorites = () => {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      if (!user || !user.id) {
        setError('Please login to view your favorites');
        return;
      }

      const response = await userAPI.getUserFavorites(user.id);
      
      if (response.success) {
        setRestaurants(response.favorites || []);
        setFavorites(response.favorites?.map(r => r.id) || []);
      } else {
        setError(response.error || 'Failed to load favorites');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (restaurantId) => {
    try {
      if (!user || !user.id) {
        setError('Please login to manage favorites');
        return;
      }

      const isCurrentlyFavorite = favorites.includes(restaurantId);
      let response;
      
      if (isCurrentlyFavorite) {
        console.log('Favorites: Removing from favorites for user:', user.id, 'restaurant:', restaurantId);
        response = await userAPI.removeFromFavorites(user.id, restaurantId);
      } else {
        console.log('Favorites: Adding to favorites for user:', user.id, 'restaurant:', restaurantId);
        response = await userAPI.addToFavorites(user.id, restaurantId);
      }
      
      if (response.success) {
        setRestaurants(response.favorites || []);
        setFavorites(response.favorites?.map(r => r.id) || []);
        
        // Update user in auth context
        const updatedUser = { ...user, favorites: response.favorites?.map(r => r.id) || [] };
        updateUser(updatedUser);
      } else {
        setError(response.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your favorites...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h2 className="mb-4">My Favorite Restaurants</h2>
          
          {restaurants.length === 0 ? (
            <Alert variant="info">
              You don't have any favorite restaurants yet. <a href="/restaurants">Browse restaurants</a> to add some to your favorites!
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
  );
};

export default Favorites;


