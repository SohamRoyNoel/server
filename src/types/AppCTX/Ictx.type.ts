import { Request, Response } from "express";

export interface IctxType {
      req: Request,
      res: Response,
      payload?: {
            uid: number,
            userFName: string,
            userLName: string,
            userName: string,
            userEmail: string,
            userRole: string,
            userAPIKey: string,
            userActiveFlag: number,
            userToken: number
      }
}