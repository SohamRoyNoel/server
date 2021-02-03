import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Field, ObjectType, Int, ID } from 'type-graphql';
import { Application_Master } from './Application_Master';
import { User_Registration } from "./User_Registration";

@ObjectType()
@Entity({ name: 'TestScenario_Master' })
export class TestScenario_Master {

      @Field(() => ID)
      @PrimaryGeneratedColumn()
      TS_ID: number;

      @Field()
      @Column({ nullable:false })
      TS_Name: string;

      @Field(() => Int)
      @ManyToOne(type => Application_Master, ur => ur.TSApplicationMapper)
      @JoinColumn({ name: 'TS_Application_ID' })
      TS_Application_ID: number;

      @Field(() => String)
      @Column({ type: 'datetime2', default:createDate() })
      TS_CreationTime: string;

      @Field(() => Int)
      @Column({ nullable:false, default: 1 })
      TS_ID_FLAG: number;

      @Field(() => User_Registration)
      @ManyToOne(() => User_Registration, ur => ur.TSUserMapper)
      @JoinColumn({ name: 'Reg_UserID' })
      userRegistrations: User_Registration[];
}

function pad(n: any) { return ('00'+n).slice(-2) };

function createDate(): String {
      var date;
      date = new Date();
      date = date.getUTCFullYear()   + '-' +
      pad(date.getUTCMonth() + 1)    + '-' +
      pad(date.getUTCDate())         + ' ' +
      pad(date.getUTCHours())        + ':' +
      pad(date.getUTCMinutes())      + ':' +
      pad(date.getUTCSeconds())      + '.' +
      pad(date.getUTCMilliseconds());
              
      return date;
}