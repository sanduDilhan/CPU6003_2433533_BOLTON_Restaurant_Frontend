import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUtensils, FaSearch } from 'react-icons/fa';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilters from '../components/SearchFilters';
import api from '../services/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
    loadFavorites();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
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
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.minRating) params.append('minRating', filters.minRating);

      const response = await api.get(`/restaurants?${params.toString()}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    }
  };

  const topRestaurants = restaurants
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center">
        <Container>
          <h1 className="display-4 mb-4">Discover Amazing Restaurants</h1>
          <p className="lead mb-4">
            Find and book tables at the best restaurants in Sri Lanka
          </p>
          <Button as={Link} to="/restaurants" variant="light" size="lg">
            <FaSearch className="me-2" />
            Explore Restaurants
          </Button>
        </Container>
      </section>

      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Featured Restaurants */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Featured Restaurants</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row>
              {topRestaurants.map(restaurant => (
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
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3">
                <FaSearch size={48} className="text-primary" />
              </div>
              <h4>Easy Search</h4>
              <p>Find restaurants by location, cuisine, or rating</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3">
                <FaUtensils size={48} className="text-primary" />
              </div>
              <h4>Diverse Cuisines</h4>
              <p>From local Sri Lankan to international cuisines</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="mb-3">
                <FaStar size={48} className="text-primary" />
              </div>
              <h4>Top Rated</h4>
              <p>Only the best restaurants with great reviews</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

