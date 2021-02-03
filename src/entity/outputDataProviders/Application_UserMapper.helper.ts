import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm";
import { Field, ObjectType, ID, Int } from 'type-graphql';
import { BaseEntity } from "typeorm";

@ObjectType()
export class Application_User_Mapper_GQLType extends BaseEntity {

      @Field(() => Int)
      Reg_UserID: number;

      @Field()
      Reg_UserName: string;

      @Field(() => Int)
      Application_ID: number;

      @Field()
      Application_Name: string;

}