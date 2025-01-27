# Recipe Sharing Platform

A full-stack recipe sharing application where users can create, share, and discover recipes from around the world. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Last Updated: 2025-01-27

## Features

### User Management
- User registration and authentication
- Profile customization with avatar, bio, and preferred cuisine
- Follow/Unfollow system
- Public profile viewing

### Recipe Management
- Create and share recipes with detailed instructions
- Upload recipe images
- Categorize recipes by cuisine type
- Specify cooking time, difficulty level, and servings
- Search recipes by various criteria

### Social Features
- Follow other users
- Community page to discover other chefs
- Recipe ratings and reviews
- User feed with latest recipes from followed users

### Recipe Features
- Step-by-step instructions
- Ingredient lists with measurements
- Cooking time estimates
- Difficulty ratings
- Serving size adjustments
- Recipe categories and tags

## Technology Stack

### Frontend
- React.js
- Chakra UI for styling
- React Router for navigation
- Axios for API requests
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage

### Security
- JWT Authentication
- Password hashing
- Protected routes
- Input validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

### Installation

1. Clone the repository
```
bash
git clone https://github.com/cod-emminex/recipe-app.git
```
Install backend dependencies
```
bash
cd backend
npm install
```
Install frontend dependencies
```
bash
cd client
npm install
```
Set up environment variables
Create a .env file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
Start the development servers
Backend:
```
bash
cd backend
npm run dev
```
Frontend:
```
bash
cd client
npm start
```
API Documentation
```
Authentication Endpoints
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/verify - Verify JWT token
User Endpoints
GET /api/users/profile - Get current user profile
PUT /api/users/profile - Update user profile
GET /api/users/community - Get community users
POST /api/users/follow/:userId - Follow a user
POST /api/users/unfollow/:userId - Unfollow a user
Recipe Endpoints
GET /api/recipes - Get all recipes
POST /api/recipes - Create new recipe
GET /api/recipes/:id - Get specific recipe
PUT /api/recipes/:id - Update recipe
DELETE /api/recipes/:id - Delete recipe
```
Contributing
Fork the repository
```
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
```
License
This project is licensed under the MIT License - see the LICENSE.md file for details

Authors
@cod-emminex - Initial work and maintenance

Acknowledgments
Chakra UI for the component library
MongoDB for the database
Cloudinary for image hosting
