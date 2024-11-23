# Chat Demo Server

## Overview

Chat Demo Server is a backend application built using the NestJS framework. It provides essential functionalities for an instant messaging app, including user registration, login, friend management, and real-time messaging. The server is designed with a modular architecture for easy maintenance and scalability.

## Features

1. **User Registration and Login**
   - Users can register and create new accounts.
   - Login generates a JSON Web Token (JWT) for authentication and stores it in Redis for session management.

2. **Authentication**
   - JWT tokens are used to protect routes and verify user identities.

3. **Friend Management**
   - Users can add friends and manage their friend lists.

4. **Real-time Communication**
   - Supports real-time messaging using WebSocket for both text and image transmission.
   - Handles message relay and storage for offline message delivery.

5. **Message Storage**
   - Stores message history in the database for offline synchronization and retrieval.

## Environment Setup

1. **Requirements**:
   - **Node.js**: Version >= 16.x
   - **NestJS**: Framework for backend development
   - **Redis**: For token storage and session management
   - **Database**: MySQL for user and message data storage

2. **Install Dependencies**:

   Run the following command to install all necessary dependencies:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
Modify the `src/config/config.ts` file to update the configuration.
   - Database connection settings
   - Redis connection details
   - JWT secret key

1. **Start the server**:
  Run the server in development mode:

   ```bash
   npm run start:dev
   ```

    Or in production mode:

   ```bash
   npm run start:prod
   ```
