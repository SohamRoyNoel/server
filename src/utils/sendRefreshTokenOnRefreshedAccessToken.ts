import { Response } from 'express';

export const SendRefreshTokenOnRefreshedAccessToken = (res: Response, token: string) => {
      res.cookie(
            "_atr",
            token,
            {
                httpOnly: true
            }
      )
}