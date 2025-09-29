import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use mock authentication
      // In a real app, you would make an API call to authenticate
      const mockUsers = [
        { id: 1, username: 'john_doe', password: 'password123', firstName: 'John', lastName: 'Doe', role: 'USER', favorites: [1, 3, 5] },
        { id: 2, username: 'jane_smith', password: 'password123', firstName: 'Jane', lastName: 'Smith', role: 'USER', favorites: [2, 4, 6] },
        { id: 3, username: 'admin', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'ADMIN', favorites: [] }
      ];

      const user = mockUsers.find(u => 
        u.username === formData.username && u.password === formData.password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header className="text-center">
              <h4 className="mb-0">Login to TableTop.lk</h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                
                <div className="d-grid mb-3">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <h6>Demo Accounts:</h6>
                <small className="text-muted">
                  <div>User: john_doe / password123</div>
                  <div>Admin: admin / admin123</div>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;


