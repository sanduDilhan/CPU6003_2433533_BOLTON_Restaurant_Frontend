import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilters from '../components/SearchFilters';
import api from '../services/api';

const RestaurantList = () => {
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

  const loadFavorites = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFavorites(user.favorites || []);
  };

  const handleToggleFavorite = (restaurantId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please login to add favorites');
      return;
    }

    const isFavorite = favorites.includes(restaurantId);
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== restaurantId));
    } else {
      setFavorites([...favorites, restaurantId]);
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

