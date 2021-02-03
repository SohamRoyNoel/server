import { Application_Master } from './../../../entity/Application_Master';
import { AdminActionOverApplicationType } from './../../../types/Admin_ApplicationAction.type';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from "../../../middlewares/IsAuth.middleware";
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { ApplicationInsertionType } from "../../../types/Application_Master.type";
import { getConnection } from 'typeorm';
import { mailerServiceCore } from "../../../utils/mailUtils/nodeMailer";

@Resolver()
export class ApplicationResolver {

      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async a_createApplications(
            @Arg("AdminApplicationInsertion") applicationInsertion: ApplicationInsertionType,
            @Ctx() { payload }: IctxType 
      ) {
            let userId = payload!.uid;
            let userEmail = payload?.userEmail!;
            let userRole = payload!.userRole;
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }

            try {
                  await getConnection().createQueryBuilder().insert().into(Application_Master)
                  .values({
                        Application_Name: applicationInsertion.Application_Name,
                        Application_Reg_Admin_UserID: userId
                  }).execute().then((e) => {
                        //console.log(e);
                        let url = process.env.APP_HOSTED;
                        mailerServiceCore("Admin", `Admin ${payload?.userName} has created an Application named- ${applicationInsertion.Application_Name}. Please check the portal for details.`, 'A', process.env.ADMIN_MAIL_DL!, url);
                  });  
                  
            } catch (error) {
                  return false;
            }
            
            return true;
      }

      @Query(() => [Application_Master])
      @UseMiddleware(IsAuthMiddleware)
      async a_getApplications(
            @Ctx() { payload }: IctxType 
      ) {
            let userRole = payload!.userRole;
                        
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }

            let appList = await getConnection().getRepository(Application_Master).createQueryBuilder("application_master")
                        .leftJoinAndSelect("application_master.Application_Reg_Admin_UserID", "user_registration")
                        .getMany();            
            return appList;
      }  
      
      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async a_applicationBlockerReviver_Editor(
            @Arg("AdminActionOverApplicationType") adminActionOverApplicationType: AdminActionOverApplicationType,
            @Ctx() { payload }: IctxType 
      ) {
            let userRole = payload!.userRole;
                        
            if(userRole !== 'Admin'){
                  throw new Error('Admin Rights needed to perform this action');
            }

            // Find the app name
            let apps = await Application_Master.findOne({
                  where:{ Application_ID: adminActionOverApplicationType.appid! }
            });

           if(adminActionOverApplicationType.appid! > 0 && adminActionOverApplicationType.appName! === null) {
                  /**
                   * When only Application ID is present, that means toggle App activity and inactivity
                  */
                  if(apps?.Application_ID_Flag === 0) {
                        return editor(1, "Activated", adminActionOverApplicationType.appid!, payload!.userEmail, payload!.userName, apps!.Application_Name);
                  } else{
                        return editor(0, "Deactivated", adminActionOverApplicationType.appid!, payload!.userEmail, payload!.userName, apps!.Application_Name);
                  }
           } else if(adminActionOverApplicationType.appid! > 0 && adminActionOverApplicationType.appName! !== null) {
                 /**
                   * When only Application ID and Application NAME both are present, that means update the APP name by id
                   * NOTE: IF updation is done on DEACTIVATED APP, it will ACTIVATE the app by default
                  */
                  return editor(1, "Updated", adminActionOverApplicationType.appid!, payload!.userEmail, payload!.userName, adminActionOverApplicationType.appName!);
           }else{
                 return false;
           }

      }
}

async function editor(flag: number, actionParam:String, appID:number, mailId: string, userName: string, newAppName: string): Promise<Boolean>{
      
      return await getConnection().createQueryBuilder().update(Application_Master)
      .set({
            Application_ID_Flag: flag,
            Application_Name: newAppName
      }).where("Application_ID = :appid", { appid: appID }).execute().then(() => {
            mailerServiceCore("Admin", `An Application named ${newAppName} has been ${actionParam} by Admin team, consider the fact that App will not be accessible by user.`, 'A', process.env.ADMIN_MAIL_DL!, process.env.APP_HOSTED!);
            return true;
      }).catch((e) => {
            console.log(e);
            return false;
      });
}