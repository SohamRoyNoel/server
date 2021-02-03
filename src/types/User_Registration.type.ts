import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Field, InputType, Int, ID } from 'type-graphql';

@InputType()
export class UserRegistrationType {
    
      @Field()
      @IsNotEmpty({ message: 'FirstName is required' })
      Reg_F_Name: string;

      @Field()
      @IsNotEmpty({ message: 'LastName is required' })
      Reg_L_Name: string;

      @Field()
      @IsNotEmpty({ message: 'UserName is required' })
      Reg_UserName: string;

      @Field()
      @IsNotEmpty({ message: 'Email is required' })
      @IsEmail({}, { message: 'Email is not valid' })
      Reg_Email: string;

      @Field()
      @IsNotEmpty({ message: 'Password is required' })
      @MinLength(6)
      @MaxLength(16)
      @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
      Reg_Password: string;

      @Field(() => Int)
      @IsNotEmpty({ message: 'Something Error happened' })
      regSecurityQusIDSeqQusID: number;

      @Field()
      @IsNotEmpty({ message: 'Security Answer is required' })
      Reg_Security_Qus_Ans: string;

}