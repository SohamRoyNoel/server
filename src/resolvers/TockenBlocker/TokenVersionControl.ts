import { Mutation, Resolver, Int, Arg } from 'type-graphql';
import { getConnection } from 'typeorm';
import { User_Registration } from '../../entity/User_Registration';

@Resolver()
export class TokenVersionControl {
      
      @Mutation(() => Boolean)
      async RefreshTokenVersionControl(
            @Arg('id', () => Int) Reg_UserID: number
      ){
            await getConnection().getRepository(User_Registration).increment({ Reg_UserID }, 'Token_Version', 1);
            return true;
      }

}