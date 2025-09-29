import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>TableTop.lk</h5>
            <p>Your gateway to the best restaurants in Sri Lanka. Discover, book, and enjoy amazing dining experiences.</p>
            <div className="d-flex">
              <FaFacebook className="me-3" size={20} />
              <FaTwitter className="me-3" size={20} />
              <FaInstagram size={20} />
            </div>
          </Col>
          
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/restaurants" className="text-light text-decoration-none">Restaurants</a></li>
              <li><a href="/my-bookings" className="text-light text-decoration-none">My Bookings</a></li>
              <li><a href="/favorites" className="text-light text-decoration-none">Favorites</a></li>
              <li><a href="/login" className="text-light text-decoration-none">Login</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contact Info</h5>
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="me-2" />
              <span>Colombo, Sri Lanka</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2" />
              <span>+94 11 234 5678</span>
            </div>
            <div className="d-flex align-items-center">
              <FaEnvelope className="me-2" />
              <span>info@tabletop.lk</span>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col>
            <p className="text-center mb-0">
              &copy; 2024 TableTop.lk. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;


