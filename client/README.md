# SERVON Client - Frontend Application

This is the frontend React application for the Servon platform - a service marketplace connecting providers and customers.

## Features

- **Role-Based User Interface**: Separate dashboards for service providers and customers
- **Service Browsing**: Browse and search through various service categories
- **Quotation Management**: Request and manage service quotations
- **AI Recommendations**: Get smart service suggestions
- **User Authentication**: Secure login with role selection
- **Responsive Design**: Mobile-first approach using Material-UI

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure

```
src/
├── components/            # React components
│   ├── CustomerDashboard.js  # Customer-specific dashboard
│   ├── ProviderDashboard.js  # Provider-specific dashboard
│   ├── Login.js           # User authentication
│   ├── Register.js        # User registration
│   ├── Services.js        # Service listings
│   ├── ServiceDetail.js   # Individual service view
│   ├── ServiceReviews.js  # Service reviews component
│   ├── AIRecommendations.js  # AI service recommendations
│   └── ...                # Other components
├── App.js                 # Main app component with routing
├── theme.js               # Material-UI theme configuration
└── index.js               # Entry point
```

## User Interfaces

### Customer Dashboard
- View service history
- Manage quotation requests
- Access favorite providers
- View recent services
- Rate and review services

### Provider Dashboard
- Manage service offerings
- Handle quotation requests
- Track customer interactions
- Monitor service performance
- View ratings and reviews

## Authentication Flow

1. User selects role (customer or provider) during registration
2. Login process validates credentials and user type
3. User is redirected to the appropriate dashboard based on role
4. Navigation options are customized based on user type
5. Sign-out option is available in the navigation menu

## Dependencies

- **React Router**: For navigation and routing
- **Material-UI**: For UI components and theming
- **JWT**: For authentication token management

## API Integration

The frontend communicates with the backend server through RESTful API endpoints. Authentication tokens are stored in localStorage and included in API requests as needed.

## Learn More

For more information about the overall project, refer to the main README.md file in the root directory.
