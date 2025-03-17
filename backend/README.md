# Backend for Vest Frontend Take Home

This is the mock backend server for Vest's Frontend Take Home. The backend is built using Node.js and Express and provides API endpoints to store and retrieve emoji reactions on a TradingView chart.

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. **Navigate to the backend directory**:
   ```sh
   cd backend
   ```

2. **Start the backend server**:
   ```sh
   node server.js
   ```

3. **You should see a message indicating that the server is running:**:
   ```sh
   Server is running on port 3001
   ```

### API Endpoints

The sample backend server exposes the following API endpoints:

1. `GET /getReactions`

- Description: Fetches all the stored emoji reactions.

- Response: A JSON object containing all the reactions.

```yaml
{
  "2024-06-24T00:00:00Z": [
    { "userId": "user1", "emoji": "🚀" },
    { "userId": "user2", "emoji": "😍" }
  ],
  "2024-06-24T01:00:00Z": [
    { "userId": "user3", "emoji": "😠" },
    { "userId": "user4", "emoji": "😢" }
  ]
}
```

2. `POST /addReaction`

- Description: Adds a new emoji reaction.

- Request Body: A JSON object containing the timestamp, userId, and emoji.

```sh
curl -X POST http://localhost:3001/addReaction \
-H "Content-Type: application/json" \
-d '{"timestamp": "2024-06-24T02:00:00Z", "userId": "user5", "emoji": "😱"}'
```

### Troubleshooting
- CORS Issues: If you encounter any Cross-Origin Resource Sharing (CORS) issues, ensure the frontend is running on http://localhost:3000 and the backend on http://localhost:3001. The server is configured to allow CORS requests from the frontend.

### Additional Notes
- This backend is intended to be a simple mock server with in-memory data storage. It does not persist data beyond the server's runtime.
