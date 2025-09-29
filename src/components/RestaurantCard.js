import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaHeart, FaUtensils } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant, onToggleFavorite, isFavorite }) => {
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

  return (
    <Card className="restaurant-card h-100">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} 
          className="restaurant-image"
          alt={restaurant.name}
        />
        <Button
          variant={isFavorite ? "danger" : "outline-danger"}
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={() => onToggleFavorite(restaurant.id)}
        >
          <FaHeart />
        </Button>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{restaurant.name}</span>
          <Badge bg="secondary">{restaurant.priceRange}</Badge>
        </Card.Title>
        
        <Card.Text className="text-muted mb-2">
          <FaUtensils className="me-1" />
          {restaurant.cuisine}
        </Card.Text>
        
        <Card.Text className="text-muted mb-2">
          <FaMapMarkerAlt className="me-1" />
          {restaurant.city}
        </Card.Text>
        
        <div className="mb-2">
          <div className="d-flex align-items-center">
            {renderStars(restaurant.rating || 0)}
            <span className="ms-2">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        
        <Card.Text className="flex-grow-1">
          {restaurant.description?.substring(0, 100)}...
        </Card.Text>
        
        <div className="mb-3">
          {restaurant.amenities?.slice(0, 3).map((amenity, index) => (
            <Badge key={index} bg="light" text="dark" className="amenity-badge">
              {amenity}
            </Badge>
          ))}
        </div>
        
        <div className="d-grid gap-2">
          <Button as={Link} to={`/restaurants/${restaurant.id}`} variant="primary">
            View Details
          </Button>
          <Button as={Link} to={`/book/${restaurant.id}`} variant="outline-primary">
            Book Table
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard;

