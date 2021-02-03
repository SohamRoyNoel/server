import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from '../../middlewares/IsAuth.middleware';
import { IctxType } from '../../types/AppCTX/Ictx.type';

@Resolver()
export class ProtectedResolverHealth {

      @Query(() => String)
      @UseMiddleware(IsAuthMiddleware)
      protectedHealth(
            @Ctx() { payload }: IctxType // passing the payload context
      ){
            return `${payload!.userFName} is authenticated and ready to access private routes`;
      }

}