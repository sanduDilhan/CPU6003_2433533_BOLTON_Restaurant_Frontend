import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUsers, FaComment, FaEye, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      if (!user || !user.id) {
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

  const handleCancelBooking = (booking) => {
    setCancellingBooking(booking);
    setCancelError(null);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancellingBooking || !user || !user.id) {
      setCancelError('Invalid booking or user information');
      return;
    }

    try {
      console.log(`Cancelling booking ${cancellingBooking.id} for user ${user.id}`);
      
      const response = await fetch(`http://localhost:8080/api/bookings/${cancellingBooking.id}/cancel/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`Response Status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('Booking cancelled successfully');
        
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking.id === cancellingBooking.id 
            ? { ...booking, status: 'CANCELLED', updatedAt: new Date().toISOString() }
            : booking
        ));
        
        setSuccessMessage(`Booking #${cancellingBooking.id} cancelled successfully!`);
        setShowCancelModal(false);
        setCancellingBooking(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setCancelError(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setCancelError('Failed to cancel booking. Please try again.');
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancellingBooking(null);
    setCancelError(null);
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
          
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
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
                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            <FaTimes className="me-1" />
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

      {/* Cancel Booking Confirmation Modal */}
      <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancellingBooking && (
            <>
              <p>Are you sure you want to cancel this booking?</p>
              <div className="bg-light p-3 rounded mb-3">
                <h6>Booking #{cancellingBooking.id}</h6>
                <p className="mb-1">
                  <strong>Date:</strong> {formatDate(cancellingBooking.date)}
                </p>
                <p className="mb-1">
                  <strong>Time:</strong> {formatTime(cancellingBooking.time)}
                </p>
                <p className="mb-0">
                  <strong>Party Size:</strong> {cancellingBooking.partySize} {cancellingBooking.partySize === 1 ? 'person' : 'people'}
                </p>
              </div>
              <p className="text-muted">
                <small>This action cannot be undone.</small>
              </p>
            </>
          )}
          
          {cancelError && (
            <Alert variant="danger" className="mt-3">
              {cancelError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCancelModal}>
            Keep Booking
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmCancelBooking}
          >
            <FaTimes className="me-1" />
            Yes, Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyBookings;


