declare global {
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user: User;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
}

export {};
