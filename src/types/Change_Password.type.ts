import { Matches, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ChangePasswordType {

      @Field(() => String, { defaultValue: null })
      userEmail?: string;

      @Field(() => String, { defaultValue: null })
      userOldPassword?: string;

      @Field(() => String, { defaultValue: null })
      userOTP?: string;

      @Field(() => String, { defaultValue: null })
      userJWT?: string;

      @Field(() => String, { defaultValue: null })
      @MinLength(6)
      @MaxLength(16)
      @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
      userNewPassword?: string;

      @Field(() => String, { defaultValue: null })
      finalStepChecker?: string;

}