import { AdminActionOverUserType } from './../../../types/Admin_UserAction.type';
import { getConnection } from 'typeorm';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User_Registration } from "../../../entity/User_Registration";
import { IsAuthMiddleware } from '../../../middlewares/IsAuth.middleware';
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { mailerServiceCore } from '../../../utils/mailUtils/nodeMailer';
/**
 * This Mutation returns USERList For admin only
 */
@Resolver()
export class RegisteredUserResolver {

      @Query(() => [User_Registration])
      @UseMiddleware(IsAuthMiddleware)
      async a_getUsers(
            @Ctx() { payload }: IctxType
      ) {
            let userRole = payload!.userRole;
            
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }

            return User_Registration.find();
      } 

      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async a_userBlockerReviver_AdminMaker_EmailChanger(
            @Arg("AdminActionOverUserType") adminActionOverUserType: AdminActionOverUserType,
            @Ctx() { payload }: IctxType
      ) {
            let userRole = payload!.userRole;
            
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }
            
            if(adminActionOverUserType.uid! === null || adminActionOverUserType.uid! <= 0 || adminActionOverUserType.uid! === payload!.uid){
                  return false;
            }

            const isBlocked = await User_Registration.findOne({
                  where: { Reg_UserID: adminActionOverUserType.uid }
            })
            
            if(isBlocked!.Reg_UserID_Flag === 1){     
                  return blockerUnblocker(
                        0, 
                        "temporarily blocked",
                         isBlocked!.Reg_UserID,
                          isBlocked!.Reg_Email, 
                          isBlocked!.Reg_UserName,
                          adminActionOverUserType.email === null ? isBlocked?.Reg_Email! : adminActionOverUserType.email!,
                          adminActionOverUserType.makeAdmin === null ? "User" : "Admin"
                  );
            } else {
                  return blockerUnblocker(1,
                        "unblocked", 
                        isBlocked!.Reg_UserID, 
                        isBlocked!.Reg_Email, 
                        isBlocked!.Reg_UserName,
                        isBlocked?.Reg_Email!,
                        "User"
                  );
            }
      }
}

async function blockerUnblocker(flag: number, actionParam:String, id:number, mailId: string, userName: string, newEmail: string, userType: string): Promise<Boolean>{
      console.log("Admin : " + newEmail);
      return await getConnection().createQueryBuilder().update(User_Registration)
      .set({
            Reg_UserID_Flag: flag,
            Reg_Email: newEmail,
            Reg_User_Type: userType
      }).where("Reg_UserID = :uid", { uid: id }).execute().then(() => {
            mailerServiceCore(userName, `Your account has been ${actionParam} by Admin team, please contact team to unblock. `, 'U', mailId,);
            return true;
      }).catch((e) => {
            console.log(e);
            return false;
      });
}