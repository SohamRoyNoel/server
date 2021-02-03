import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ApplicationRequestMapperType {
    
      @Field()
      @IsNotEmpty({ message: 'Application Name is required' })
      Application_Name: string;
      
}