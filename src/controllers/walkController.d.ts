import type { Request, Response } from "express";
export declare const startWalk: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markSafe: (req: Request, res: Response) => Promise<void>;
export declare const getWalkHistory: (req: Request, res: Response) => Promise<void>;
export declare const getPublicSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=walkController.d.ts.map