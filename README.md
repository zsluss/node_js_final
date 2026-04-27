# Node.js States API

A comprehensive REST API for retrieving information about U.S. states, including capitals, nicknames, population, admission dates, and fun facts stored in MongoDB.

## Project Overview

This backend application serves as a RESTful API that provides detailed information about all 50 U.S. states. The API pulls state data from a JSON file and allows users to manage fun facts through a MongoDB database. Features include filtering by contiguous states, retrieving random fun facts, and managing state-specific information.

**Key Features:**
- Retrieve all states or specific state information
- Filter states by contiguity (continental U.S. only)
- Get state capitals, nicknames, population, and admission dates
- Manage fun facts with add, update, retrieve, and delete operations
- CORS-enabled for cross-origin requests
- Comprehensive error handling with proper HTTP status codes

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or remote)
- npm package manager

### Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd node_js_final
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3500
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3500` (or the port specified in your `.env` file).

## API Endpoints

Base URL: `http://localhost:3500/states`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all states (supports `?contig=true` or `?contig=false` query parameter) |
| GET | `/:state` | Get details for a specific state |
| GET | `/:state/capital` | Get state capital |
| GET | `/:state/nickname` | Get state nickname |
| GET | `/:state/population` | Get state population |
| GET | `/:state/admission` | Get state admission date |
| GET | `/:state/funfact` | Get a random fun fact |
| POST | `/:state/funfact` | Add a new fun fact |
| PATCH | `/:state/funfact` | Update an existing fun fact |
| DELETE | `/:state/funfact` | Delete a fun fact |

---

## Dependencies

- **express**: ^4.18.2 - Web framework for routing and middleware
- **cors**: ^2.8.5 - Cross-Origin Resource Sharing middleware
- **mongoose**: ^7.0.3 - MongoDB object modeling
- **dotenv**: ^16.0.3 - Environment variable management

### Dev Dependencies
- **nodemon**: ^2.0.20 - Auto-restart server on file changes

## License

