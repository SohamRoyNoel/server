import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Field, ObjectType, Int, ID } from 'type-graphql';
import { User_Registration } from './User_Registration';

@ObjectType()
@Entity({ name: 'Security_Questions' })
export class Security_Questions extends BaseEntity {

      @Field(() => ID)
      @PrimaryGeneratedColumn()
      SeqQus_ID: number;

      @Field()
      @Column({ nullable:false })
      SeqQus_Qus: string;

      @OneToMany(() => User_Registration, ur => ur.regSecurityQusIDSeqQusID)
      userRegistrations: User_Registration[];
}