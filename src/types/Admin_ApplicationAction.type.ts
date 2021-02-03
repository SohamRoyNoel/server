import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AdminActionOverApplicationType {

    @Field(() => Int, { defaultValue: null })
    appid?: number;

    @Field({ defaultValue: null })
    appName?: string;
}