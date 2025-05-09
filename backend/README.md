# WiseLearning Backend

This is the backend API for the WiseLearning platform, implemented using Express, TypeScript, Prisma, and PostgreSQL.

## API Structure

The backend implements the following API endpoints to support the frontend requirements:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login an existing user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/teacher/:id` - Get courses by teacher ID
- `GET /api/courses/my/teaching` - Get current teacher's courses
- `GET /api/courses/my/learning` - Get current user's enrolled courses
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Tutoring
- `GET /api/tutoring/sessions` - Get all approved tutoring sessions
- `GET /api/tutoring/sessions/:id` - Get tutoring session by ID
- `GET /api/tutoring/sessions/teacher/:id` - Get sessions by teacher ID
- `GET /api/tutoring/sessions/my` - Get current teacher's sessions
- `POST /api/tutoring/sessions` - Create a new tutoring session
- `PUT /api/tutoring/sessions/:id` - Update a tutoring session
- `DELETE /api/tutoring/sessions/:id` - Delete a tutoring session
- `POST /api/tutoring/requests` - Create a new tutoring request
- `GET /api/tutoring/requests/session/:id` - Get requests for a session
- `GET /api/tutoring/requests/my` - Get current user's requests
- `PUT /api/tutoring/requests/:id/status` - Update request status
- `POST /api/tutoring/messages` - Send a message in a tutoring request
- `GET /api/tutoring/messages/request/:id` - Get messages for a request

### Reviews
- `GET /api/reviews/course/:id` - Get reviews for a course
- `POST /api/reviews/course/:id` - Create a course review
- `GET /api/reviews/tutoring/:id` - Get reviews for a tutoring session
- `POST /api/reviews/tutoring/:id` - Create a tutoring review

### Messaging
- `GET /api/messaging/conversations` - Get user's conversations
- `GET /api/messaging/conversations/:id` - Get conversation by ID
- `POST /api/messaging/conversations` - Create a new conversation
- `POST /api/messaging/messages` - Send a message in a conversation
- `PUT /api/messaging/messages/:id/read` - Mark message as read

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user/:id` - Get user's achievements
- `POST /api/achievements/:id/complete` - Complete an achievement

### Certificates
- `GET /api/certificates/user/:id` - Get user's certificates
- `POST /api/certificates` - Generate a new certificate

### Calendar
- `GET /api/calendar/events` - Get current user's calendar events
- `POST /api/calendar/events` - Create a calendar event
- `PUT /api/calendar/events/:id` - Update a calendar event
- `DELETE /api/calendar/events/:id` - Delete a calendar event

### Subscriptions and Payments
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `PUT /api/subscriptions/:id/cancel` - Cancel a subscription
- `GET /api/payments/history` - Get payment history

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `src/config/env.example`
5. Set up your database:
   ```
   npx prisma migrate dev
   ```
6. Generate Prisma client:
   ```
   npx prisma generate
   ```
7. Start the development server:
   ```
   npm run dev
   ```

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes models for:

- Users
- Courses, Topics, Lessons
- Quizzes, Questions
- Assignments
- Tutoring Sessions
- Messaging
- Reviews
- Achievements and Certificates
- Subscriptions and Payments

## Contributing

1. Make sure to follow the established code structure
2. Use TypeScript types for all functions and endpoints
3. Implement proper error handling and validation
4. Add tests for new functionality (when applicable)

## License

This project is licensed under the MIT License. 