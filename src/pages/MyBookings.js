import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUsers, FaComment, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        setError('Please login to view your bookings');
        return;
      }

      const response = await api.get(`/bookings/user/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending' },
      CONFIRMED: { variant: 'success', text: 'Confirmed' },
      CANCELLED: { variant: 'danger', text: 'Cancelled' },
      COMPLETED: { variant: 'info', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your bookings...</p>
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
          <h2 className="mb-4">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <Alert variant="info">
              You don't have any bookings yet. <Link to="/restaurants">Browse restaurants</Link> to make your first booking!
            </Alert>
          ) : (
            <Row>
              {bookings.map(booking => (
                <Col key={booking.id} lg={6} className="mb-4">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title">Booking #{booking.id}</h5>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mb-3">
                        <p className="mb-2">
                          <FaCalendarAlt className="me-2 text-primary" />
                          <strong>Date:</strong> {formatDate(booking.date)}
                        </p>
                        <p className="mb-2">
                          <FaClock className="me-2 text-primary" />
                          <strong>Time:</strong> {formatTime(booking.time)}
                        </p>
                        <p className="mb-2">
                          <FaUsers className="me-2 text-primary" />
                          <strong>Party Size:</strong> {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}
                        </p>
                        {booking.specialRequests && (
                          <p className="mb-2">
                            <FaComment className="me-2 text-primary" />
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </p>
                        )}
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Button 
                          as={Link} 
                          to={`/restaurants/${booking.restaurantId}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          <FaEye className="me-1" />
                          View Restaurant
                        </Button>
                        {booking.status === 'PENDING' && (
                          <Button variant="outline-danger" size="sm">
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyBookings;

