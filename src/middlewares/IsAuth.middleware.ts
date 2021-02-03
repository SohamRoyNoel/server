import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { IctxType } from '../types/AppCTX/Ictx.type';
import { User_Registration } from '../entity/User_Registration';
import { mailerServiceCore } from "../utils/mailUtils/nodeMailer";

export const IsAuthMiddleware: MiddlewareFn<IctxType> = async ({ context }, next) => {

      const authorization = context.req.headers['authorization']
      
      if(!authorization) { throw new Error('User is unauthorized'); }

      if(authorization.split(' ')[0] !== 'Bearer'){
            throw new Error('Invalid Request Initiator');
      }
      try {
            const token = authorization.split(' ')[1];
            const payload = verify(token, process.env.ACCESS_JWT_SECRET!);

            // Check the token version before putting on context
            let userId: number = Object.values(payload)[0];
            const findUser = await User_Registration.findOne({ Reg_UserID: userId });

            // console.log(Object.values(payload));

            if(findUser?.Token_Version !==  Object.values(payload)[7]) {
                  mailerServiceCore(Object.values(payload)[3], `No DYNAMIC TEXT; ADDED TO HTML TEMPLATE `, 'R', Object.values(payload)[4]);
                  throw new Error('User is unauthorized or temporarily banned. You will receive a mail regarding the recovery process.');
            } else{
                  /**
                   * Assign the payload value to Context payload
                   * To access it from any GQL query/ middleware
                   */
                  context.payload = payload as any;
            } 
      } catch (error) {
            console.log("Access denied");
            
            throw new Error('User is unauthorized or temporarily banned. You will receive a mail regarding the recovery process.');
      }

      return next();
}