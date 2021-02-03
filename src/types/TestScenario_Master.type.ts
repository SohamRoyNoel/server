import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class TestScenarioMasterType {

      @Field(() => [String], { defaultValue: null })
      applicationsName?: string[];

      @Field({ defaultValue: null })
      TS_Application_Name?: string

      @Field(() => Int, { defaultValue: null })
      TS_Application_ID?: number

}