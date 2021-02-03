import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType, Int } from 'type-graphql';
import { User_Registration } from './User_Registration';
import { Application_User_Mapper } from './Application_User_Mapper';
import { TestScenario_Master } from './TestScenario_Master';

@ObjectType()
@Entity({ name: 'Application_Master' })
export class Application_Master extends BaseEntity {

      @Field(() => Int)
      @PrimaryGeneratedColumn()
      Application_ID: number;

      @Field()
      @Column({ unique: true })
      Application_Name: string;

      @Field(() => User_Registration)
      @ManyToOne(type => User_Registration, ur => ur.ApplicationMaster)
      @JoinColumn()
      Application_Reg_Admin_UserID: number;

      @Field(() => String)
      @Column({ type: 'datetime2', default:createDate() })
      Application_CreationTime: string;

      @Field(() => Int)
      @Column({ default: 1 })
      Application_ID_Flag: number;     
      
      @ManyToOne(() => Application_User_Mapper, aum => aum.App_Application_ID)
      ApplicationUserMapper: Promise<Application_User_Mapper[]>;

      @OneToMany(() => TestScenario_Master, tsm => tsm.TS_Application_ID)
      TSApplicationMapper: Promise<TestScenario_Master[]>;
      
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