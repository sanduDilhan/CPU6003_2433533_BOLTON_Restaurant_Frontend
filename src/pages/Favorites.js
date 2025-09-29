import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import api from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        setError('Please login to view your favorites');
        return;
      }

      setFavorites(user.favorites || []);
      
      if (user.favorites && user.favorites.length > 0) {
        const favoriteRestaurants = [];
        for (const restaurantId of user.favorites) {
          try {
            const response = await api.get(`/restaurants/${restaurantId}`);
            favoriteRestaurants.push(response.data);
          } catch (error) {
            console.error(`Error loading restaurant ${restaurantId}:`, error);
          }
        }
        setRestaurants(favoriteRestaurants);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (restaurantId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isFavorite = favorites.includes(restaurantId);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== restaurantId);
      setFavorites(newFavorites);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
      
      // Update user in localStorage
      const updatedUser = { ...user, favorites: newFavorites };
      localStorage.setItem('user', JSON.stringify(updatedUser));
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

