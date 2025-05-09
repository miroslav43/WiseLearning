# WiseLearning Backend Setup Guide

This guide will help you set up and run the WiseLearning backend API.

## Prerequisites

- Node.js v14 or higher
- PostgreSQL 12 or higher
- npm or bun package manager

## Installation Steps

1. **Clone the Repository (if not already done)**

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   # or if using bun
   bun install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example env file to prisma directory
   npm run prisma:setup
   # or
   bun run prisma:setup
   ```

   Now edit the `prisma/.env` file with your PostgreSQL database connection details:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/wiselearning_db"
   ```

4. **Create the Database**
   Connect to PostgreSQL and create the database:
   ```sql
   CREATE DATABASE wiselearning_db;
   ```

5. **Run Prisma Migrations**
   ```bash
   npm run prisma:migrate
   # or
   bun run prisma:migrate
   ```

6. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   # or
   bun run prisma:generate
   ```

7. **Start the Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The server should now be running at http://localhost:5000.

## API Documentation

You can view the API endpoints in the `README.md` file or explore them using the following methods:

- Check the routes directory to see all the available endpoints
- Use Prisma Studio to view the database:
  ```bash
  npm run prisma:studio
  # or
  bun run prisma:studio
  ```

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check that the connection string in `prisma/.env` is correct
- Ensure your database user has proper permissions

### Dependency Issues
If you encounter issues with dependencies, try:
```bash
npm ci
# or
bun install --frozen-lockfile
```

### TypeScript Errors
If you encounter TypeScript errors, make sure you've generated the Prisma client:
```bash
npm run prisma:generate
# or
bun run prisma:generate
```

## Common Tasks

### Add a New Route
1. Create a controller function in the appropriate controller file
2. Add the route in the corresponding routes file
3. Register the route in `src/index.ts` if needed

### Update Database Schema
1. Edit the `prisma/schema.prisma` file
2. Run the migration:
   ```bash
   npm run prisma:migrate
   # or
   bun run prisma:migrate
   ```
3. Regenerate the Prisma client:
   ```bash
   npm run prisma:generate
   # or
   bun run prisma:generate
   ```

### Build for Production
```bash
npm run build
# or
bun run build
```

The compiled code will be in the `dist` directory. 