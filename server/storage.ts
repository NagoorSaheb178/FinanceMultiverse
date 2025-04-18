import { users, type User, type InsertUser, type Persona, type InsertPersona } from "@shared/schema";
import { getDb, connectToDatabase } from "./mongodb";
import { Collection, Db, ObjectId } from "mongodb";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  savePersona(persona: InsertPersona): Promise<Persona>;
  getPersonasByUserId(userId: number): Promise<Persona[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private personas: Map<number, Persona[]>;
  currentId: number;
  personaId: number;

  constructor() {
    this.users = new Map();
    this.personas = new Map();
    this.currentId = 1;
    this.personaId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async savePersona(insertPersona: InsertPersona): Promise<Persona> {
    const id = this.personaId++;
    const userId = insertPersona.userId || null;
    
    // Create a valid Persona object with all required fields
    const persona: Persona = { 
      id, 
      userId, 
      personaType: insertPersona.personaType,
      timestamp: insertPersona.timestamp 
    };
    
    // Ensure userId is a number for Map key
    const userIdKey = typeof userId === 'number' ? userId : 0;
    
    if (!this.personas.has(userIdKey)) {
      this.personas.set(userIdKey, []);
    }
    
    this.personas.get(userIdKey)!.push(persona);
    return persona;
  }

  async getPersonasByUserId(userId: number): Promise<Persona[]> {
    return this.personas.get(userId) || [];
  }
}

// MongoDB storage implementation
export class MongoStorage implements IStorage {
  private db: Db | null = null;
  private usersCollection: Collection | null = null;
  private personasCollection: Collection | null = null;

  constructor() {
    // Initialize MongoDB connection
    this.initDb();
  }

  private async initDb() {
    try {
      this.db = await connectToDatabase();
      this.usersCollection = this.db.collection('users');
      this.personasCollection = this.db.collection('personas');
      console.log("[mongodb] Collections initialized");
    } catch (error) {
      console.error("[mongodb] Failed to initialize database:", error);
    }
  }

  private async getCollections() {
    if (!this.db || !this.usersCollection || !this.personasCollection) {
      await this.initDb();
    }
    return {
      users: this.usersCollection!,
      personas: this.personasCollection!
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const { users } = await this.getCollections();
      const user = await users.findOne({ id });
      
      if (!user) return undefined;
      
      // Convert MongoDB document to User type
      return {
        id: user.id as number,
        username: user.username as string,
        password: user.password as string
      };
    } catch (error) {
      console.error("[mongodb] Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { users } = await this.getCollections();
      const user = await users.findOne({ username });
      
      if (!user) return undefined;
      
      // Convert MongoDB document to User type
      return {
        id: user.id as number,
        username: user.username as string,
        password: user.password as string
      };
    } catch (error) {
      console.error("[mongodb] Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const { users } = await this.getCollections();
      
      // Get the next id
      const latestUser = await users.find().sort({ id: -1 }).limit(1).toArray();
      const id = latestUser.length > 0 ? latestUser[0].id + 1 : 1;
      
      const user: User = { ...insertUser, id };
      await users.insertOne(user);
      return user;
    } catch (error) {
      console.error("[mongodb] Error creating user:", error);
      throw error;
    }
  }

  async savePersona(insertPersona: InsertPersona): Promise<Persona> {
    try {
      const { personas } = await this.getCollections();
      
      // Get the next id
      const latestPersona = await personas.find().sort({ id: -1 }).limit(1).toArray();
      const id = latestPersona.length > 0 ? latestPersona[0].id + 1 : 1;
      
      // Create a valid Persona object with all required fields
      const persona: Persona = { 
        id, 
        userId: insertPersona.userId || null, 
        personaType: insertPersona.personaType,
        timestamp: insertPersona.timestamp 
      };
      
      await personas.insertOne(persona);
      return persona;
    } catch (error) {
      console.error("[mongodb] Error saving persona:", error);
      throw error;
    }
  }

  async getPersonasByUserId(userId: number): Promise<Persona[]> {
    try {
      const { personas } = await this.getCollections();
      const userPersonas = await personas.find({ userId }).toArray();
      
      // Convert MongoDB documents to Persona type
      return userPersonas.map(doc => ({
        id: doc.id as number,
        userId: doc.userId as number | null,
        personaType: doc.personaType as string,
        timestamp: doc.timestamp as string
      }));
    } catch (error) {
      console.error("[mongodb] Error getting personas by user ID:", error);
      return [];
    }
  }
}

// Use MongoDB storage or fall back to memory storage if connection fails
let storageImpl: IStorage;

try {
  storageImpl = new MongoStorage();
  console.log("[storage] Using MongoDB storage");
} catch (error) {
  console.warn("[storage] Failed to initialize MongoDB storage, falling back to memory storage:", error);
  storageImpl = new MemStorage();
}

export const storage = storageImpl;
