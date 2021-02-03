import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AdminActionOverUserApplicationType {

    @Field(() => Int)
    userId?: number;

    @Field(() => Int)
    appId?: number;
}