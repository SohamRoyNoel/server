import { compare } from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User_Registration } from '../../entity/User_Registration';
import { UserLoginType } from "../../types/User_Login.type";
import { IctxType } from '../../types/AppCTX/Ictx.type';
import { CreateRefreshToken, CreateAccessToken } from '../../utils/tokenCreator';
import { SendRefreshTokenOnRefreshedAccessToken } from "../../utils/sendRefreshTokenOnRefreshedAccessToken";

@Resolver()
export class UserLoginResolver {

      @Mutation(() => UserLoginType)
      async findLoggedInUser(
            @Arg("email") Reg_Email: string,
            @Arg('password') Reg_Password: string,
            @Ctx() { req, res }: IctxType // Receiving it from Index as context
      ): Promise<UserLoginType> {
            // Find the user by email first
            let oneUser = await User_Registration.findOne({ where: { Reg_Email } })
            // Validate if Email exists
            if(!oneUser) { throw new Error('Unable to find the user')};
            // Compare the Password with hashed
            const isValid = await compare(Reg_Password, oneUser.Reg_Password);
            // Validate if Password exists
            if(!isValid) { throw new Error('Incorrect Password')};
            
            //Deliver a Refresh Token
            SendRefreshTokenOnRefreshedAccessToken(res, CreateRefreshToken(oneUser));
            
            // Deliver a Access Token
            return {
                  accessToken: CreateAccessToken(oneUser)
            } 
      }

      @Query(() => User_Registration)
      getUsers() {
            return User_Registration.find();
      }     
}