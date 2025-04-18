import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database Name
const dbName = process.env.MONGODB_DB_NAME || "financialMultiverse";

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("[mongodb] Connected successfully to MongoDB");
    return client.db(dbName);
  } catch (error) {
    console.error("[mongodb] Connection error:", error);
    throw error;
  }
}

// Get the MongoDB database instance
export async function getDb() {
  try {
    // This will reuse the connection if it exists or create a new one
    return client.db(dbName);
  } catch (error) {
    console.error("[mongodb] Error getting database:", error);
    throw error;
  }
}

// Close the connection when the app is terminating
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log("[mongodb] Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("[mongodb] Error closing connection:", error);
    process.exit(1);
  }
});