import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role_id: number;
            };
        }
    }
}
