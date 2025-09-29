import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
              </>
            )}
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
                <NavDropdown.Item as={Link} to="/my-bookings">
                  My Bookings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/favorites">
                  Favorites
                </NavDropdown.Item>
                {user.role === 'ADMIN' && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin">
                      <FaCog className="me-1" />
                      Admin Panel
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/analytics">
                      Analytics
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
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

