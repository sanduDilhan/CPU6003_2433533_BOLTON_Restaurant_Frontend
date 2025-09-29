import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>TableTop.lk</strong>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Hide Home and Restaurants for admin users */}
            {(!user || user.role !== 'ADMIN') && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
              </>
            )}
            
            {/* Show user sections only for non-admin users */}
            {user && user.role !== 'ADMIN' && (
              <>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
              </>
            )}
            
            {/* Admin sections */}
            {user && user.role === 'ADMIN' && (
              <>
                <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <NavDropdown title={
                <span>
                  <FaUser className="me-1" />
                  {user.firstName} {user.lastName}
                </span>
              } id="user-dropdown">
                {/* Hide user sections for admin users */}
                {user.role !== 'ADMIN' && (
                  <>
                    <NavDropdown.Item as={Link} to="/my-bookings">
                      My Bookings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/favorites">
                      Favorites
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                
                {/* Admin sections */}
                {user.role === 'ADMIN' && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin">
                      <FaCog className="me-1" />
                      Admin Panel
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/analytics">
                      Analytics
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;


