import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import api from '../services/api';

const AdminPanel = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    city: '',
    address: '',
    phone: '',
    rating: '',
    priceRange: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    checkAdminAccess();
    loadData();
  }, []);

  const checkAdminAccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'ADMIN') {
      window.location.href = '/';
    }
  };

  const loadData = async () => {
    try {
      const [restaurantsRes, bookingsRes] = await Promise.all([
        api.get('/restaurants'),
        api.get('/bookings')
      ]);
      
      setRestaurants(restaurantsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await api.put(`/restaurants/${editingRestaurant.id}`, formData);
      } else {
        await api.post('/restaurants', formData);
      }
      
      setShowModal(false);
      setEditingRestaurant(null);
      setFormData({
        name: '',
        cuisine: '',
        city: '',
        address: '',
        phone: '',
        rating: '',
        priceRange: '',
        description: '',
        imageUrl: ''
      });
      loadData();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setError('Failed to save restaurant. Please try again.');
    }
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name || '',
      cuisine: restaurant.cuisine || '',
      city: restaurant.city || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      rating: restaurant.rating || '',
      priceRange: restaurant.priceRange || '',
      description: restaurant.description || '',
      imageUrl: restaurant.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await api.delete(`/restaurants/${id}`);
        loadData();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        setError('Failed to delete restaurant. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    setFormData({
      name: '',
      cuisine: '',
      city: '',
      address: '',
      phone: '',
      rating: '',
      priceRange: '',
      description: '',
      imageUrl: ''
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading admin panel...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h2 className="mb-4">Admin Panel</h2>
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Restaurants</h5>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    <FaPlus className="me-1" />
                    Add Restaurant
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Cuisine</th>
                        <th>City</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.map(restaurant => (
                        <tr key={restaurant.id}>
                          <td>{restaurant.name}</td>
                          <td>{restaurant.cuisine}</td>
                          <td>{restaurant.city}</td>
                          <td>{restaurant.rating?.toFixed(1) || 'N/A'}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(restaurant)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(restaurant.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Quick Stats</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Total Restaurants:</strong> {restaurants.length}
                  </div>
                  <div className="mb-3">
                    <strong>Total Bookings:</strong> {bookings.length}
                  </div>
                  <div className="mb-3">
                    <strong>Confirmed Bookings:</strong> {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </div>
                  <div className="mb-3">
                    <strong>Pending Bookings:</strong> {bookings.filter(b => b.status === 'PENDING').length}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Add/Edit Restaurant Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Restaurant Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cuisine</Form.Label>
                  <Form.Control
                    type="text"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Form.Select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Price Range</option>
                    <option value="$">$ - Budget</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                    <option value="$$$$">$$$$ - Very Expensive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingRestaurant ? 'Update' : 'Create'} Restaurant
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminPanel;


