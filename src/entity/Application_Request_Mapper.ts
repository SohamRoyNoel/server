import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType, Int } from 'type-graphql';
import { User_Registration } from './User_Registration';

@ObjectType()
@Entity({ name: 'Application_Request_Mapper' })
export class Application_Request_Mapper extends BaseEntity {

      @Field(() => Int)
      @PrimaryGeneratedColumn()
      Request_ID: number;

      @Field()
      @Column({ unique: false })
      Request_App_Name: string;

      @Field(() => User_Registration)
      @ManyToOne(type => User_Registration, ur => ur.ApplicationRequestMapper)
      @JoinColumn()
      Request_App_By_Reg_UserID: number;

      @Field(() => Int, { nullable: true })
      @Column({ nullable: true, default: null })
      Request_App_ApprovedBy_Reg_UserID: number;

      @Field(() => String)
      @Column({ default: 'Pending' })
      Request_Status: string;   
      
      @Column({ default: 0 })
      counter: number
      
}
