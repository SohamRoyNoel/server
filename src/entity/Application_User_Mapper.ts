import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm";
import { Field, ObjectType, ID, Int } from 'type-graphql';
import { BaseEntity } from "typeorm";
import { Application_Master } from "./Application_Master";
import { User_Registration } from "./User_Registration";

@ObjectType()
@Entity({ name: 'Application_User_Mapper' })
export class Application_User_Mapper extends BaseEntity {

      @Field(() => ID)
      @PrimaryGeneratedColumn()
      App_Map_ID: number;

      @Field(() => Int)
      @ManyToOne(type => Application_Master, am => am.Application_ID)
      @JoinColumn({ name: "App_Application_ID" })
      App_Application_ID: number;

      @Field(() => Int)
      @ManyToOne(type => User_Registration, ur => ur.ApplicationUserMapper)
      @JoinColumn({ name: "App_user_Reg_ID" })
      App_user_Reg_ID: number;

      @Field(() => Int)
      @Column({ default: 1 })
      App_Map_ID_FLAG: number;

}