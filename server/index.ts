import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToDatabase } from "./mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize MongoDB connection
    await connectToDatabase();
    log("MongoDB connected successfully");
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
      const basePort = 5000;
      const currentPort = basePort + retryCount;

      try {
        await new Promise((resolve, reject) => {
          server.listen(currentPort, () => {
            log(`Server is running on port ${currentPort}`);
            resolve(true);
          }).on('error', reject);
        });
      } catch (error: any) {
        if (error.code === 'EADDRINUSE' && retryCount < maxRetries) {
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
