import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const SearchFilters = ({ onSearch, onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    cuisine: '',
    minRating: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      city: '',
      cuisine: '',
      minRating: ''
    });
    onSearch({
      search: '',
      city: '',
      cuisine: '',
      minRating: ''
    });
  };

  return (
    <div className="search-section">
      <div className="container">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Restaurant name, cuisine, or city..."
                  value={filters.search}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Select
                  name="city"
                  value={filters.city}
                  onChange={handleInputChange}
                >
                  <option value="">All Cities</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Negombo">Negombo</option>
                  <option value="Galle">Galle</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>Cuisine</Form.Label>
                <Form.Select
                  name="cuisine"
                  value={filters.cuisine}
                  onChange={handleInputChange}
                >
                  <option value="">All Cuisines</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Thai">Thai</option>
                  <option value="Seafood">Seafood</option>
                  <option value="International">International</option>
                  <option value="Street Food">Street Food</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2}>
              <Form.Group>
                <Form.Label>Min Rating</Form.Label>
                <Form.Select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleInputChange}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={2} className="d-flex align-items-end">
              <div className="d-grid gap-2 w-100">
                <Button type="submit" variant="primary">
                  Search
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default SearchFilters;

