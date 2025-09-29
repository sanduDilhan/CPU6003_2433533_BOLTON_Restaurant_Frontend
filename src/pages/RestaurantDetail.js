import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaPhone, FaClock, FaHeart, FaUtensils } from 'react-icons/fa';
import api from '../services/api';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadRestaurant();
    loadReviews();
    checkFavorite();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error loading restaurant:', error);
      setError('Failed to load restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.get(`/reviews/restaurant/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const checkFavorite = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = user.favorites || [];
    setIsFavorite(favorites.includes(parseInt(id)));
  };

  const handleToggleFavorite = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please login to add favorites');
      return;
    }

    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to update favorites
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
          <p className="mt-3">Loading restaurant details...</p>
        </div>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Restaurant not found'}
        </Alert>
        <Button as={Link} to="/restaurants" variant="primary">
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <div className="position-relative">
              <Card.Img 
                variant="top" 
                src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
                style={{ height: '400px', objectFit: 'cover' }}
                alt={restaurant.name}
              />
              <Button
                variant={isFavorite ? "danger" : "outline-danger"}
                className="position-absolute top-0 end-0 m-3"
                onClick={handleToggleFavorite}
              >
                <FaHeart />
              </Button>
            </div>
            
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title className="h2">{restaurant.name}</Card.Title>
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(restaurant.rating || 0)}
                    <span className="ms-2">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                    <Badge bg="secondary" className="ms-3">{restaurant.priceRange}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-muted mb-2">
                  <FaUtensils className="me-2" />
                  {restaurant.cuisine}
                </p>
                <p className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  {restaurant.address}, {restaurant.city}
                </p>
                {restaurant.phone && (
                  <p className="text-muted mb-2">
                    <FaPhone className="me-2" />
                    {restaurant.phone}
                  </p>
                )}
              </div>
              
              <p>{restaurant.description}</p>
              
              <div className="mb-3">
                <h6>Amenities:</h6>
                {restaurant.amenities?.map((amenity, index) => (
                  <Badge key={index} bg="light" text="dark" className="amenity-badge me-2">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          <Tabs defaultActiveKey="reviews" className="mb-4">
            <Tab eventKey="reviews" title="Reviews">
              <div className="mt-3">
                {reviews.length === 0 ? (
                  <p>No reviews yet. Be the first to review this restaurant!</p>
                ) : (
                  reviews.map(review => (
                    <Card key={review.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>User {review.userId}</h6>
                            <div className="d-flex align-items-center mb-2">
                              {renderStars(review.rating)}
                              <span className="ms-2">{review.rating}/5</span>
                            </div>
                          </div>
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
            
            <Tab eventKey="hours" title="Opening Hours">
              <div className="mt-3">
                {restaurant.openingHours && (
                  <div className="row">
                    {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                      <div key={day} className="col-md-6 mb-2">
                        <div className="d-flex justify-content-between">
                          <strong className="text-capitalize">{day}:</strong>
                          <span>{hours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Col>
        
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <h5>Make a Reservation</h5>
              <p className="text-muted">Book your table at {restaurant.name}</p>
              <Button as={Link} to={`/book/${restaurant.id}`} variant="primary" size="lg" className="w-100">
                Book Table
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantDetail;



