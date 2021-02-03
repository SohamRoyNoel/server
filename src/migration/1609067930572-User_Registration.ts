import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRegistration1609067930572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query("CREATE TABLE User_Registration( [Reg_UserID] [int] IDENTITY(1,1) NOT NULL, [Reg_F_Name] [nvarchar](50) NOT NULL, [Reg_L_Name] [nvarchar](50) NOT NULL, [Reg_UserName] [nvarchar](50) NOT NULL, [Reg_Email] [nvarchar](max) NOT NULL, [Reg_Password] [nvarchar](max) NOT NULL, [Reg_API_KEY] [nvarchar](max) NOT NULL, [Reg_Security_Qus_ID] [int] NOT NULL, [Reg_Security_Qus_Ans] [nvarchar](50) NOT NULL, [Reg_User_Type] [nvarchar](50) NOT NULL, [Reg_UserID_Flag] [int] NULL, CONSTRAINT [PK_User_Registration] PRIMARY KEY ( [Reg_UserID] ASC ), CONSTRAINT FK_User_Registration FOREIGN KEY (Reg_Security_Qus_ID) REFERENCES Security_Questions(SeqQus_ID) )");
        await queryRunner.query("ALTER TABLE User_Registration ADD  DEFAULT ((1)) FOR [Reg_UserID_Flag]");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
