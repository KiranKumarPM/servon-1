# SERVON - Service Provider Platform

A user-friendly platform connecting service providers with customers, featuring a ₹1 quotation system and role-specific interfaces.

## Features

- **Differentiated User Interfaces**: Separate dashboards for service providers and customers
- **OTP-based Authentication**: Secure login with phone verification
- **Service Management**: Browse, request, and manage services
- **₹1 Quotation System**: Affordable lead generation for service providers
- **AI Recommendations**: Smart service suggestions and requirement analysis
- **Ratings & Reviews**: Quality assurance through user feedback
- **Real-time Chat**: Direct communication between providers and customers
- **Mobile-First Design**: Responsive interface for all devices

## Tech Stack

- **Frontend:** React.js with Hooks, Material-UI components
- **Backend:** Node.js & Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with role-based authorization
- **State Management:** React Context API
- **Routing:** React Router v6
- **API Communication:** Fetch API with async/await
- **Styling:** Material-UI theming system

## Project Structure

```
servon/
├── client/                  # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   │   ├── CustomerDashboard.js  # Customer-specific dashboard
│   │   │   ├── ProviderDashboard.js  # Provider-specific dashboard
│   │   │   └── ...          # Other components
│   │   ├── App.js           # Main app component with routing
│   │   ├── theme.js         # Material-UI theme configuration
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
└── server/                  # Node.js backend
    ├── controllers/         # Route controllers
    ├── middleware/          # Custom middleware
    ├── models/              # Mongoose models
    ├── routes/              # Express routes
    │   ├── auth.js          # Authentication routes
    │   ├── ai.js            # AI recommendation routes
    │   └── ...              # Other route modules
    ├── .env                 # Environment variables
    └── server.js            # Entry point
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies (after frontend setup)
   cd ../client
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/servon
   JWT_SECRET=your_jwt_secret_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server (after frontend setup)
   cd ../client
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password and user type
- `POST /api/auth/register` - Register new user with role selection
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP for authentication

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get role-specific dashboard data

### Services
- `GET /api/services` - List all service categories
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Add new service (providers)
- `PUT /api/services/:id` - Update service (providers)

### Quotations
- `POST /api/quotations` - Create quotation request (customers) or response (providers)
- `GET /api/quotations/received` - List received quotations
- `GET /api/quotations/sent` - List sent quotations
- `PATCH /api/quotations/:id/status` - Update quotation status

### Reviews
- `POST /api/reviews` - Add service review
- `GET /api/reviews/service/:id` - Get reviews for a service
- `GET /api/reviews/provider/:id` - Get reviews for a provider

### AI Recommendations
- `POST /api/ai/recommend` - Get AI service recommendations
- `POST /api/ai/analyze` - Analyze service requirements

## User Roles and Interfaces

### Customer Interface
- Browse and search for services
- Request quotations from service providers
- View and manage received quotations
- Track service history and status
- Rate and review service providers
- Access AI-powered service recommendations

### Provider Interface
- Manage service portfolio and availability
- Respond to quotation requests
- Track customer interactions and service delivery
- Monitor ratings and reviews
- Manage business profile and credentials

## Setup Instructions

1. Clone the repository
2. Install dependencies as described above
3. Configure environment variables in `.env`
4. Start both frontend and backend servers
5. Access the application at http://localhost:3000

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
