// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
var uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}
var client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
var dbName = process.env.MONGODB_DB_NAME || "financialMultiverse";
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("[mongodb] Connected successfully to MongoDB");
    return client.db(dbName);
  } catch (error) {
    console.error("[mongodb] Connection error:", error);
    throw error;
  }
}
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("[mongodb] Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("[mongodb] Error closing connection:", error);
    process.exit(1);
  }
});

// server/storage.ts
var MemStorage = class {
  users;
  personas;
  currentId;
  personaId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.personas = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.personaId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async savePersona(insertPersona) {
    const id = this.personaId++;
    const userId = insertPersona.userId || null;
    const persona = {
      id,
      userId,
      personaType: insertPersona.personaType,
      timestamp: insertPersona.timestamp
    };
    const userIdKey = typeof userId === "number" ? userId : 0;
    if (!this.personas.has(userIdKey)) {
      this.personas.set(userIdKey, []);
    }
    this.personas.get(userIdKey).push(persona);
    return persona;
  }
  async getPersonasByUserId(userId) {
    return this.personas.get(userId) || [];
  }
};
var MongoStorage = class {
  db = null;
  usersCollection = null;
  personasCollection = null;
  constructor() {
    this.initDb();
  }
  async initDb() {
    try {
      this.db = await connectToDatabase();
      this.usersCollection = this.db.collection("users");
      this.personasCollection = this.db.collection("personas");
      console.log("[mongodb] Collections initialized");
    } catch (error) {
      console.error("[mongodb] Failed to initialize database:", error);
    }
  }
  async getCollections() {
    if (!this.db || !this.usersCollection || !this.personasCollection) {
      await this.initDb();
    }
    return {
      users: this.usersCollection,
      personas: this.personasCollection
    };
  }
  async getUser(id) {
    try {
      const { users } = await this.getCollections();
      const user = await users.findOne({ id });
      if (!user) return void 0;
      return {
        id: user.id,
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error("[mongodb] Error getting user:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const { users } = await this.getCollections();
      const user = await users.findOne({ username });
      if (!user) return void 0;
      return {
        id: user.id,
        username: user.username,
        password: user.password
      };
    } catch (error) {
      console.error("[mongodb] Error getting user by username:", error);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      const { users } = await this.getCollections();
      const latestUser = await users.find().sort({ id: -1 }).limit(1).toArray();
      const id = latestUser.length > 0 ? latestUser[0].id + 1 : 1;
      const user = { ...insertUser, id };
      await users.insertOne(user);
      return user;
    } catch (error) {
      console.error("[mongodb] Error creating user:", error);
      throw error;
    }
  }
  async savePersona(insertPersona) {
    try {
      const { personas } = await this.getCollections();
      const latestPersona = await personas.find().sort({ id: -1 }).limit(1).toArray();
      const id = latestPersona.length > 0 ? latestPersona[0].id + 1 : 1;
      const persona = {
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
  async getPersonasByUserId(userId) {
    try {
      const { personas } = await this.getCollections();
      const userPersonas = await personas.find({ userId }).toArray();
      return userPersonas.map((doc) => ({
        id: doc.id,
        userId: doc.userId,
        personaType: doc.personaType,
        timestamp: doc.timestamp
      }));
    } catch (error) {
      console.error("[mongodb] Error getting personas by user ID:", error);
      return [];
    }
  }
};
var storageImpl;
try {
  storageImpl = new MongoStorage();
  console.log("[storage] Using MongoDB storage");
} catch (error) {
  console.warn("[storage] Failed to initialize MongoDB storage, falling back to memory storage:", error);
  storageImpl = new MemStorage();
}
var storage = storageImpl;

// shared/schema.ts
import { z } from "zod";
var userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string()
});
var personaSchema = z.object({
  id: z.number(),
  userId: z.number(),
  personaType: z.string(),
  timestamp: z.string()
});
var insertUserSchema = userSchema.omit({ id: true });
var insertPersonaSchema = personaSchema.omit({ id: true });

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.post("/api/personas", async (req, res) => {
    try {
      const validatedData = insertPersonaSchema.parse(req.body);
      const savedPersona = await storage.savePersona(validatedData);
      return res.status(201).json(savedPersona);
    } catch (err) {
      if (err instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/personas/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const personas = await storage.getPersonasByUserId(userId);
      return res.status(200).json(personas);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await connectToDatabase();
    log("MongoDB connected successfully");
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const startServer = async (retryCount = 0) => {
      const maxRetries = 3;
      const basePort = 5e3;
      const currentPort = basePort + retryCount;
      try {
        await new Promise((resolve, reject) => {
          server.listen(currentPort, () => {
            log(`Server is running on port ${currentPort}`);
            resolve(true);
          }).on("error", reject);
        });
      } catch (error) {
        if (error.code === "EADDRINUSE" && retryCount < maxRetries) {
          log(`Port ${currentPort} is in use, trying port ${currentPort + 1}...`);
          await startServer(retryCount + 1);
        } else {
          throw error;
        }
      }
    };
    await startServer();
  } catch (error) {
    log(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
})();
