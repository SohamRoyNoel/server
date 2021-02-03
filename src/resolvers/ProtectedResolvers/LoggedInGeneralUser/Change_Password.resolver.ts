import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from '../../../middlewares/IsAuth.middleware';
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { ChangePasswordType } from '../../../types/Change_Password.type';
import { User_Registration } from '../../../entity/User_Registration';
import { compare, hash } from 'bcryptjs';
import { mailerServiceCore } from "../../../utils/mailUtils/nodeMailer";
import { changePasswordURLProvider } from "../../../utils/linkcreator";
import { getConnection } from 'typeorm';
import { verify } from "jsonwebtoken";

@Resolver()
export class ChangePasswordProtectedResolver {

      // Set OTP and LINK  
      // I/p: [USER Email] and [current password ]   
      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async acceptChangePasswordRequest(
            @Arg("changePasswordMutation") changePasswordMutation: ChangePasswordType,
            @Ctx() { payload }: IctxType
      ){
           let um = changePasswordMutation.userEmail;
           let oldPs = changePasswordMutation.userOldPassword;

           try {
                  const user = await User_Registration.findOne({ Reg_Email: um });
                  const isValid = await compare(oldPs!, user!.Reg_Password);
                  if(!isValid) { return false; }

                  const otp = Math.floor(Math.random() * 99999999) + 1; 
                  let url = changePasswordURLProvider(payload!.uid, payload!.userEmail, payload!.userRole, otp);

                  // insert the OTP to DB for 2nd round validation
                  await getConnection().createQueryBuilder().update(User_Registration)
                        .set({ OTP: otp })
                        .where("Reg_UserID= :i", { i: payload?.uid })
                        .execute();                 
                  
                  mailerServiceCore(`${payload?.userName}`, `You have initiated a change password request. You'll receive two separate emails, In this mail will have the link that will redirect you to the change password page. On the second mail you'll have an OTP in order to perform the action. `, 'CP1', um!, url);
                  mailerServiceCore(`${payload?.userName}`, `Change password OTP: ${otp} `, 'CP2', um!);
                  return true;
           } catch (error) {
                 console.log(error);
                 mailerServiceCore(`${payload?.userName}`, ` Your change password request can not be completed right now. Please try again later.`, 'U', um!);
                 return false;
           }
      }

      // validate JWT's OTP with DB OTP
      // I/p: [JWT from URL] & [OTP from user's mail] & [user's email]
      // STORE EMAIL on local storage
      @Query(() => Boolean)
      async validateChangePasswordRequest(
            @Arg("acceptPasswordQuery") acceptPasswordQuery: ChangePasswordType,
      ) {         
            const receivedJWT = acceptPasswordQuery.userJWT;
            const receivedEmail = acceptPasswordQuery.userEmail;
            try {
                  const payloads = verify(receivedJWT!, process.env.MAILER_TOKEN_SECRET!);
                  let getOtp = Object.values(payloads)[3];
                  let uid = Object.values(payloads)[0];
                  let userValidation = await User_Registration.findOne({ Reg_UserID: uid });
                  
                  if(userValidation?.OTP !== getOtp) { return false; }

                  // Remove the OTP
                  await getConnection().createQueryBuilder().update(User_Registration)
                        .set({ OTP: 0, OTPFlag: 1 })
                        .where("Reg_UserID= :i", { i: uid })
                        .execute();                  

                  return true;
            } catch (error) {
                  mailerServiceCore(`${receivedEmail}`, ` Lighthouse detected some suspicious activity on your account. Consider changing password. `, 'U', receivedEmail!);
                  return false;
            }
      }


      // Let the user change his password
      // I/p: [New password] & [EMAIL from LOCAL STORAGE]
      // Remove all session from browser from FE
      @Mutation(() => Boolean)
      async approveChangePasswordRequest(
            @Arg("acceptPasswordQuery") acceptPasswordQuery: ChangePasswordType,
      ) {  
            let userPassword = acceptPasswordQuery.userNewPassword;
  
            try {
                  // check the flag
                  let user = await User_Registration.findOne({ Reg_Email: acceptPasswordQuery.userEmail })
                  if(user?.OTPFlag !== 1) {
                        mailerServiceCore(`${acceptPasswordQuery.userEmail}`, ` Lighthouse detected some suspicious activity on your account. Consider changing password. `, 'U', acceptPasswordQuery.userEmail!);  
                        return false;
                  }
                  let x = await hash(userPassword!, 12); // returns a hashed password
                  
                  // Change the password
                  await getConnection().createQueryBuilder().update(User_Registration)
                        .set({ Reg_Password: x })
                        .where("Reg_Email= :i", { i: acceptPasswordQuery.userEmail })
                        .execute().then(() => {
                            mailerServiceCore(`${acceptPasswordQuery.userEmail}`, ` Your password is updated successfully. Please login again to continue. `, 'U', acceptPasswordQuery.userEmail!);  
                        })

                  // Change the flag to false
                  await getConnection().createQueryBuilder().update(User_Registration)
                        .set({ OTP: 0, OTPFlag: 0 })
                        .where("Reg_Email= :i", { i: acceptPasswordQuery.userEmail })
                        .execute();                  

                  return true;
            } catch (error) {
                  console.log(error);
                  return false;
            }
      }
}

