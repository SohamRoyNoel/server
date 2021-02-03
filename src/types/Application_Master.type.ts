import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ApplicationInsertionType {
    
      @Field()
      @IsNotEmpty({ message: 'Application Name is required' })
      Application_Name: string;

}