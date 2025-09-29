# TableTop.lk Frontend - React Application

This is the frontend application for the TableTop.lk restaurant booking platform, built with React.

## Features

- **Restaurant Discovery**: Browse and search restaurants
- **Advanced Search**: Filter by location, cuisine, rating
- **Restaurant Details**: View comprehensive restaurant information
- **Booking System**: Make table reservations
- **User Management**: Registration, login, profile management
- **Favorites**: Save favorite restaurants
- **Booking History**: View past and upcoming bookings
- **Admin Panel**: Restaurant and booking management
- **Analytics Dashboard**: View platform statistics

## Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   ├── Footer.js       # Footer component
│   ├── RestaurantCard.js # Restaurant card component
│   └── SearchFilters.js # Search and filter component
├── pages/              # Page components
│   ├── Home.js         # Home page
│   ├── RestaurantList.js # Restaurant listing page
│   ├── RestaurantDetail.js # Restaurant detail page
│   ├── BookingForm.js  # Booking form page
│   ├── MyBookings.js   # User bookings page
│   ├── Favorites.js    # User favorites page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── AdminPanel.js   # Admin panel
│   └── Analytics.js    # Analytics dashboard
├── services/           # API services
│   └── api.js          # Axios configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Components

### Navigation
- **Navbar**: Main navigation with user authentication
- **Footer**: Site footer with contact information

### Restaurant Components
- **RestaurantCard**: Display restaurant information in card format
- **SearchFilters**: Advanced search and filtering options

### Pages
- **Home**: Landing page with featured restaurants
- **RestaurantList**: Browse all restaurants with search
- **RestaurantDetail**: Detailed restaurant view with reviews
- **BookingForm**: Make table reservations
- **MyBookings**: View booking history
- **Favorites**: Manage favorite restaurants
- **Login/Register**: User authentication
- **AdminPanel**: Restaurant and booking management
- **Analytics**: Platform statistics and insights

## Features

### Search and Discovery
- Search restaurants by name, cuisine, or city
- Filter by location, cuisine type, and rating
- Sort by rating, popularity, or name
- Real-time search results

### Restaurant Information
- Comprehensive restaurant details
- High-quality images
- Ratings and reviews
- Amenities and features
- Opening hours
- Contact information
- Location and directions

### Booking System
- Date and time selection
- Party size specification
- Special requests
- Booking confirmation
- Status tracking

### User Management
- User registration and login
- Profile management
- Favorites system
- Booking history
- Role-based access (User/Admin)

### Admin Features
- Restaurant CRUD operations
- Booking management
- User management
- Analytics dashboard
- Statistics and insights

## API Integration

The frontend communicates with the backend through REST API calls:

```javascript
// Example API usage
import api from './services/api';

// Get all restaurants
const restaurants = await api.get('/restaurants');

// Create a booking
const booking = await api.post('/bookings', bookingData);

// Get user's bookings
const userBookings = await api.get(`/bookings/user/${userId}`);
```

## State Management

The application uses React's built-in state management:
- Local component state for UI interactions
- localStorage for user session persistence
- API calls for data fetching and updates

## Styling

- **Bootstrap 5**: Responsive UI framework
- **React Bootstrap**: Bootstrap components for React
- **Custom CSS**: Additional styling in `index.css`
- **Responsive Design**: Mobile-first approach

## Authentication

### Demo Accounts
- **User**: john_doe / password123
- **Admin**: admin / admin123

### Authentication Flow
1. User logs in with username/password
2. User data stored in localStorage
3. API calls include authentication headers
4. Role-based access control for admin features

## Routing

The application uses React Router for client-side routing:

```javascript
// Main routes
/ - Home page
/restaurants - Restaurant listing
/restaurants/:id - Restaurant details
/book/:restaurantId - Booking form
/my-bookings - User bookings
/favorites - User favorites
/login - Login page
/register - Registration page
/admin - Admin panel (Admin only)
/analytics - Analytics dashboard (Admin only)
```

## Development

### Adding New Features

1. Create component in `components/` or `pages/`
2. Add route in `App.js`
3. Update navigation in `Navbar.js`
4. Add API calls in `services/api.js`

### Styling Guidelines

- Use Bootstrap classes for responsive design
- Follow component-based styling approach
- Use consistent color scheme and typography
- Ensure mobile responsiveness

### API Integration

- All API calls go through `services/api.js`
- Handle loading states and errors
- Implement proper error handling
- Use consistent data formatting

## Build and Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Lazy loading for large lists
- Image optimization
- API call optimization
- Component memoization
- Bundle size optimization

## Security

- Input validation
- XSS prevention
- Secure API communication
- Authentication token management
- Role-based access control

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Check backend server is running
2. **CORS Issues**: Verify backend CORS configuration
3. **Authentication Issues**: Check localStorage for user data
4. **Build Errors**: Clear node_modules and reinstall

### Debug Mode

Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Future Enhancements

- Real-time notifications
- Advanced search filters
- Image gallery for restaurants
- Social media integration
- Progressive Web App (PWA) features
- Offline support
- Advanced analytics
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please contact the development team.



