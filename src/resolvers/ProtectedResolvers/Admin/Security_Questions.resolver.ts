import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from "../../../middlewares/IsAuth.middleware";
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { getConnection } from 'typeorm';
import { mailerServiceCore } from "../../../utils/mailUtils/nodeMailer";
import { SecurityQuestionsType } from '../../../types/Security_Questions.type';
import { Security_Questions } from '../../../entity/Security_Questions';

@Resolver()
export class SecurityQuestionsResolver {

      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async a_createSecurityQuestions(
            @Arg("SecurityQuestionsInsertion") securityQuestionsInsertion: SecurityQuestionsType,
            @Ctx() { payload }: IctxType 
      ) {
            let userRole = payload!.userRole;
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }

            try {
                  await getConnection().createQueryBuilder().insert().into(Security_Questions)
                  .values({
                        SeqQus_Qus: securityQuestionsInsertion.securityQuestion,
                  }).execute().then((e) => {
                        //console.log(e);
                        let url = process.env.APP_HOSTED;
                        mailerServiceCore("Admin", `Admin ${payload?.userName} has created a Security Question - ${ securityQuestionsInsertion.securityQuestion }. Please check the portal for details.`, 'A', process.env.ADMIN_MAIL_DL!, url);
                  });  
                  
            } catch (error) {
                  return false;
            }
            
            return true;
      }

      @Query(() => [Security_Questions])
      async getSecurityQuestions(
            @Ctx() { payload }: IctxType 
      ) {
            let qusList = Security_Questions.find();
            return qusList;
      }     
}