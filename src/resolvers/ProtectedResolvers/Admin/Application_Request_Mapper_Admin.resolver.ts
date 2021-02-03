import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Application_Master } from "../../../entity/Application_Master";
import { Application_Request_Mapper } from "../../../entity/Application_Request_Mapper";
import { Application_User_Mapper } from "../../../entity/Application_User_Mapper";
import { IsAuthMiddleware } from "../../../middlewares/IsAuth.middleware";
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { createUrlToAcceptApplicationRequestDecoder } from "../../../utils/linkcreator";
import { mailerServiceCore } from "../../../utils/mailUtils/nodeMailer";

@Resolver()
export class UserApplicationRequestMapperResolver_AdminAccepter {

    @Mutation(() => Boolean)
    @UseMiddleware(IsAuthMiddleware)
    async a_acceptAppUserRequest(
        @Arg("token") tokenCollector: string,
        @Ctx() { payload }: IctxType 
    ){
        try {
            let userEmail = payload?.userEmail;
            let x = createUrlToAcceptApplicationRequestDecoder(tokenCollector);
            let reqId = Object.values(x)[0];
            let appNm = Object.values(x)[1];
            let uid = Object.values(x)[3];
            let counter = Object.values(x)[4];
            // Check counter
            let counterByDB = await Application_Request_Mapper.findOne({
                where: {
                    Request_ID: reqId
                }
            }).then((e) => {
                return e?.counter
            })
            if(counter === counterByDB){
                // Update the Application_Request_Mapper table: make 'Pending' to 'Approved'
                await getConnection().createQueryBuilder()
                .update(Application_Request_Mapper)
                .set({
                    Request_Status:'Approved',
                    Request_App_ApprovedBy_Reg_UserID: payload!.uid,
                    counter: 1
                }).where("Request_ID = :id and Request_App_Name = :apnm and requestAppByRegUserIDRegUserID = :user", {
                    id: reqId, apnm: appNm, user: uid
                }).execute();
                // Find the application
                let getApp = await Application_Master.findOne({
                    where:{
                        Application_Name: appNm
                    }
                });
                /**
                 * It will return undefined if the app is not present
                 */
                let AppId = getApp?.Application_ID;
                if(AppId === undefined){
                    // Create the App
                    let newApp = await getConnection().createQueryBuilder().insert().into(Application_Master)
                        .values({
                            Application_Name: appNm,
                            Application_Reg_Admin_UserID: payload?.uid
                        }).execute();

                    let recentID = newApp.identifiers[0].Application_ID!;
                    // Put the mapper
                    givePermission(recentID, uid, payload?.userName!, appNm, userEmail!);
                } else {
                    // IF app exists then add this entity to Application_User Mapper
                    givePermission(AppId, uid, payload?.userName!, appNm, userEmail!);
                } 
                return true; 
            } else{
                return false;
            }  
        } catch (error) {
            return false;
        }
    }
}

async function givePermission(AppId: number, uid: number, userName: string, appNm: string, userEmail: string) {
    await getConnection().createQueryBuilder().insert().into(Application_User_Mapper)
    .values({
        App_Application_ID: AppId,
        App_user_Reg_ID: uid
    }).execute().then((e) => {
            console.log(e);
    }).then(() => {
            let url = process.env.APP_HOSTED;
            mailerServiceCore(userName, `Your request for Application- ${appNm} has been approved. Why wait! let's start hacking. `, 'U', userEmail!);
            mailerServiceCore("Admin", `You have successfully approved an Application request named - ${appNm} for Employee named- ${userName}. Click the below link to manage. `, 'A', process.env.ADMIN_MAIL_DL!, process.env.APP_HOSTED!);
    });                
}