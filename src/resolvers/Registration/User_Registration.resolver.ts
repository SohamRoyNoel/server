import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User_Registration } from "../../entity/User_Registration";
import { UserRegistrationType } from "../../types/User_Registration.type";
import { mailerServiceCore } from "../../utils/mailUtils/nodeMailer";

@Resolver()
export class UserRegistrationResolver {

      @Mutation(() => Boolean)
      async createRegistrations(
            @Arg("RegistrationMutation", ) registrationMutation: UserRegistrationType
      ) {
            let userEmail = registrationMutation.Reg_Email;
            let userName = registrationMutation.Reg_UserName;
            return await User_Registration.create(registrationMutation).save().then((e) => {
                  mailerServiceCore(userName, `Welcome to JohnHanCock | Manulife Website Performance Lighthouse. Request any application access and start hacking & rocking. `, 'U', userEmail);
                  return true;
            }).catch((error) => {
                  console.log(error);
                  mailerServiceCore(userName, `Lighthouse server detected someone with mail id - ${userEmail} is trying to create or hack your account, stay cautious and don't forget to change password. `, 'U', userEmail);
                  return false;
            }) 
      }

      @Query(() => User_Registration)
      getUsers() {
            return User_Registration.find();
      }     
}