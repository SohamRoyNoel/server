import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ObjectType, ID } from 'type-graphql';
import { BaseEntity } from "typeorm";

@ObjectType()
@Entity({ name: 'Page_Master' })
export class Page_Master extends BaseEntity {

      @Field(() => ID)
      @PrimaryGeneratedColumn()
      Page_ID: number;

      @Field()
      @Column({ type:'nvarchar', length:"MAX", nullable:false })
      Page_Name: string;

}