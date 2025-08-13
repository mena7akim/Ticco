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
  private userSockets: Map<number, Set<string>> = new Map(); // userId -> Set of socketIds

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

      // Track user's socket connections
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Join user to their personal room for targeted messaging
      socket.join(`user_${userId}`);

      // Send current timesheet status on connection
      this.sendCurrentTimesheetStatus(userId);

      // Handle timesheet events
      socket.on("timesheet:start", (data) => {
        this.handleTimesheetStart(userId, data);
      });

      socket.on("timesheet:stop", (data) => {
        this.handleTimesheetStop(userId, data);
      });

      socket.on("timesheet:sync", () => {
        this.sendCurrentTimesheetStatus(userId);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected socket ${socket.id}`);

        const userSocketSet = this.userSockets.get(userId);
        if (userSocketSet) {
          userSocketSet.delete(socket.id);
          if (userSocketSet.size === 0) {
            this.userSockets.delete(userId);
          }
        }
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
        // Calculate current duration
        const currentTime = new Date();
        const durationMs =
          currentTime.getTime() - runningTimesheet.startTime.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));

        data = {
          ...runningTimesheet,
          durationMinutes,
        };
      }

      this.io.to(`user_${userId}`).emit("timesheet:status", {
        runningTimesheet: data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending timesheet status:", error);
    }
  }

  // Handle timesheet start event
  private async handleTimesheetStart(userId: number, data: any) {
    // Emit to all user's devices that timesheet has started
    this.io.to(`user_${userId}`).emit("timesheet:started", {
      timesheet: data,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle timesheet stop event
  private async handleTimesheetStop(userId: number, data: any) {
    // Emit to all user's devices that timesheet has stopped
    this.io.to(`user_${userId}`).emit("timesheet:stopped", {
      timesheet: data,
      timestamp: new Date().toISOString(),
    });
  }

  // Public methods for service layer to emit events
  public notifyTimesheetStarted(userId: number, timesheet: any) {
    this.io.to(`user_${userId}`).emit("timesheet:started", {
      timesheet,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyTimesheetStopped(userId: number, timesheet: any) {
    this.io.to(`user_${userId}`).emit("timesheet:stopped", {
      timesheet,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyTimesheetDeleted(userId: number, timesheetId: number) {
    this.io.to(`user_${userId}`).emit("timesheet:deleted", {
      timesheetId,
      timestamp: new Date().toISOString(),
    });
  }

  // Start periodic sync for all connected users
  public startPeriodicSync() {
    setInterval(() => {
      this.userSockets.forEach((socketIds, userId) => {
        if (socketIds.size > 0) {
          this.sendCurrentTimesheetStatus(userId);
        }
      });
    }, 30000); // Sync every 30 seconds
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
