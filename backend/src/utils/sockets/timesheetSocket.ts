import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import UserRepository from "../../repository/userRepository";
import TimesheetRepository from "../../repository/timesheetRepository";
import { IsNull } from "typeorm";

interface AuthenticatedSocket extends Socket {
  user: User;
}

export class TimesheetSocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/socket.io/",
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error("Authentication token required"));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
        };

        // Get user from database
        const user = await UserRepository.findOne({
          where: { id: decoded.id },
        });

        if (!user) {
          return next(new Error("User not found"));
        }

        // Attach user to socket
        (socket as AuthenticatedSocket).user = user;
        next();
      } catch (error) {
        next(new Error("Invalid authentication token"));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const authenticatedSocket = socket as AuthenticatedSocket;
      const userId = authenticatedSocket.user.id;

      console.log(`User ${userId} connected with socket ${socket.id}`);

      socket.join(`user_${userId}`);
      this.sendCurrentTimesheetStatus(userId);
      socket.on("timesheet:sync", () => {
        this.sendCurrentTimesheetStatus(userId);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected socket ${socket.id}`);
      });
    });
  }

  // Send current timesheet status to user's all connected devices
  private async sendCurrentTimesheetStatus(userId: number) {
    try {
      const runningTimesheet = await TimesheetRepository.findOne({
        where: {
          userId,
          endTime: IsNull(),
        },
        relations: ["activity"],
      });

      let data = null;
      if (runningTimesheet) {
        data = {
          ...runningTimesheet,
        };
      }

      this.io
        .to(`user_${userId}`)
        .emit("timesheet:status", { timesheet: data });
    } catch (error) {
      console.error("Error sending timesheet status:", error);
    }
  }

  public sync() {
    this.io.emit("timesheet:sync");
  }

  public getIO() {
    return this.io;
  }
}

export class TimesheetSocketServiceSingleton {
  private static instance: TimesheetSocketService;

  constructor(httpServer: HTTPServer) {
    if (!TimesheetSocketServiceSingleton.instance) {
      TimesheetSocketServiceSingleton.instance = new TimesheetSocketService(
        httpServer
      );
    }
  }

  public static getInstance(): TimesheetSocketService {
    return TimesheetSocketServiceSingleton.instance;
  }
}

export function getTimesheetSocketService(): TimesheetSocketService | null {
  return TimesheetSocketServiceSingleton.getInstance();
}
