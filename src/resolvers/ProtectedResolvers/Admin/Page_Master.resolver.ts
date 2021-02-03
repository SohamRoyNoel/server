import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from "../../../middlewares/IsAuth.middleware";
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { Page_Master } from "../../../entity/Page_Master";

@Resolver()
export class PageResolver  {

      @Query(() => [Page_Master])
      @UseMiddleware(IsAuthMiddleware)
      async a_getPages(
            @Ctx() { payload }: IctxType 
      ) {
            let userRole = payload!.userRole;
                        
            if(userRole !== 'Admin'){
                  // mailerServiceCore();
                  throw new Error('Admin Rights needed to perform this action');
            }
            
            return Page_Master.find();
      }  

}