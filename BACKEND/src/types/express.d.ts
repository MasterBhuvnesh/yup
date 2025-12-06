import { AuthObject } from '@clerk/clerk-sdk-node'

declare global {
  namespace Express {
    export interface Request {
      auth: () => AuthObject
    }
  }
}
