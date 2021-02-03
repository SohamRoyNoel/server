import { Field, InputType } from 'type-graphql';

@InputType()
export class SecurityQuestionsType {

      @Field(() => String, { defaultValue: null })
      securityQuestion: string;

}