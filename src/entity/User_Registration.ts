import { hash } from "bcryptjs";
import { Matches, MaxLength, MinLength } from "class-validator";
import { Field, ID, Int, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, BaseEntity, ManyToOne, BeforeInsert, OneToMany} from "typeorm";
import { createMyApiKey } from "../utils/createAPIkey";
import { Security_Questions } from './Security_Questions';
import { Application_Master } from './Application_Master';
import { Application_Request_Mapper } from "./Application_Request_Mapper";
import { Application_User_Mapper } from "./Application_User_Mapper";
import { TestScenario_Master } from './TestScenario_Master';
/**
 * This Entity will work for DB model as well as GQL Type
 */
@ObjectType()
@Entity({ name: 'User_Registration' })
export class User_Registration extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    Reg_UserID: number;

    @Field()
    @Column()
    Reg_F_Name: string;

    @Field()
    @Column()
    Reg_L_Name: string;

    @Field()
    @Column()
    Reg_UserName: string;

    @Field()
    @Column({ unique: true })
    Reg_Email: string;

    @Column()
    @MinLength(6)
    @MaxLength(16)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    Reg_Password: string;

    @Field()
    @Column({ default: createMyApiKey(28)})
    Reg_API_KEY: string;

    @ManyToOne(type=> Security_Questions, sq => sq.userRegistrations)
    @JoinColumn()
    regSecurityQusIDSeqQusID: number;

    @Column({ nullable:false })
    Reg_Security_Qus_Ans: string;

    @Field()
    @Column({ default: 'User' })
    Reg_User_Type: string;

    @Column({ default: 1})
    Reg_UserID_Flag: number;

    @Column({ default: 0 })
    Token_Version: number;

    @Column({ default: 0 })
    OTP: number;

    @Column({ default: 0 })
    OTPFlag: number;

    @OneToMany(() => Application_Master, am => am.Application_Reg_Admin_UserID)
    ApplicationMaster: Promise<Application_Master[]>;

    @OneToMany(() => Application_Request_Mapper, arm => arm.Request_App_By_Reg_UserID)
    ApplicationRequestMapper: Promise<Application_Request_Mapper[]>;

    @OneToMany(() => Application_User_Mapper, aum => aum.App_user_Reg_ID)
    ApplicationUserMapper: Promise<Application_User_Mapper[]>;

    @OneToMany(() => TestScenario_Master, tsm => tsm.userRegistrations)
    TSUserMapper: Promise<TestScenario_Master[]>;

    @BeforeInsert()
    private async encryptPassword(): Promise<void> {
        this.Reg_Password = await hash(this.Reg_Password, 12);
    }

}
