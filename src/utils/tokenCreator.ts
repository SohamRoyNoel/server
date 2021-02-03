import { sign } from 'jsonwebtoken';
import { User_Registration } from '../entity/User_Registration';


export const CreateAccessToken = (oneUser: User_Registration) => {
      return sign({ 
            uid: oneUser.Reg_UserID,
            userFName: oneUser.Reg_F_Name,
            userLName: oneUser.Reg_L_Name,
            userName: oneUser.Reg_UserName,
            userEmail: oneUser.Reg_Email,
            userRole: oneUser.Reg_User_Type,
            userAPIKey: oneUser.Reg_API_KEY,
            tokenVersion: oneUser.Token_Version,
            userActiveFlag: oneUser.Reg_UserID_Flag
      },
      process.env.ACCESS_JWT_SECRET!,
      {
            expiresIn: process.env.ACCESS_JWT_EXPIRES_IN
      });
}

export const CreateRefreshToken = (oneUser: User_Registration) => {
      return sign({
            uid: oneUser.Reg_UserID,
            userFName: oneUser.Reg_F_Name,
            userLName: oneUser.Reg_L_Name,
            userName: oneUser.Reg_UserName,
            userEmail: oneUser.Reg_Email,
            userRole: oneUser.Reg_User_Type,
            userAPIKey: oneUser.Reg_API_KEY,
            userActiveFlag: oneUser.Reg_UserID_Flag,
            tokenVersion: oneUser.Token_Version
      },
      process.env.REFRESH_JWT_SECRET!,
      {
            expiresIn: process.env.REFRESH_JWT_EXPIRES_IN
      });
}