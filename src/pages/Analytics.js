import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { FaStar, FaCalendarAlt, FaUtensils } from 'react-icons/fa';
import api from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    topRated: [],
    mostBooked: [],
    totalRestaurants: 0,
    totalBookings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminAccess();
    loadAnalytics();
  }, []);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'ADMIN') {
      window.location.href = '/';
    }
  };

  const loadAnalytics = async () => {
    try {
      const [restaurantsRes, bookingsRes, topRatedRes] = await Promise.all([
        api.get('/restaurants'),
        api.get('/bookings'),
        api.get('/restaurants/top-rated')
      ]);

      const restaurants = restaurantsRes.data;
      const bookings = bookingsRes.data;
      const topRated = topRatedRes.data;

      // Calculate most booked restaurants
      const bookingCounts = {};
      bookings.forEach(booking => {
        const restaurantId = booking.restaurantId;
        bookingCounts[restaurantId] = (bookingCounts[restaurantId] || 0) + 1;
      });

      const mostBooked = Object.entries(bookingCounts)
        .map(([restaurantId, count]) => {
          const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
          return restaurant ? { ...restaurant, bookingCount: count } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);

      // Calculate average rating
      const totalRating = restaurants.reduce((sum, r) => sum + (r.rating || 0), 0);
      const averageRating = restaurants.length > 0 ? totalRating / restaurants.length : 0;

      setAnalytics({
        topRated: topRated.slice(0, 5),
        mostBooked,
        totalRestaurants: restaurants.length,
        totalBookings: bookings.length,
        averageRating
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="rating-stars" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="rating-stars" style={{ opacity: 0.5 }} />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading analytics...</p>
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
          <h2 className="mb-4">Analytics Dashboard</h2>
          
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaUtensils size={48} className="text-primary mb-3" />
                  <h4>{analytics.totalRestaurants}</h4>
                  <p className="text-muted">Total Restaurants</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCalendarAlt size={48} className="text-success mb-3" />
                  <h4>{analytics.totalBookings}</h4>
                  <p className="text-muted">Total Bookings</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaStar size={48} className="text-warning mb-3" />
                  <h4>{analytics.averageRating.toFixed(1)}</h4>
                  <p className="text-muted">Average Rating</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <div className="text-info mb-3">
                    <i className="fas fa-chart-line" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4>{analytics.mostBooked.length > 0 ? analytics.mostBooked[0].bookingCount : 0}</h4>
                  <p className="text-muted">Most Booked</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Top Rated Restaurants */}
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Top Rated Restaurants</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Restaurant</th>
                        <th>Rating</th>
                        <th>Cuisine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topRated.map((restaurant, index) => (
                        <tr key={restaurant.id}>
                          <td>
                            <div>
                              <strong>{restaurant.name}</strong>
                              <br />
                              <small className="text-muted">{restaurant.city}</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {renderStars(restaurant.rating || 0)}
                              <span className="ms-2">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </td>
                          <td>{restaurant.cuisine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Most Booked Restaurants */}
            <Col lg={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Most Booked Restaurants</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Restaurant</th>
                        <th>Bookings</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.mostBooked.map((restaurant, index) => (
                        <tr key={restaurant.id}>
                          <td>
                            <div>
                              <strong>{restaurant.name}</strong>
                              <br />
                              <small className="text-muted">{restaurant.city}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary">{restaurant.bookingCount}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {renderStars(restaurant.rating || 0)}
                              <span className="ms-2">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;



