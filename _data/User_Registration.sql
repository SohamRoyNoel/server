-- SuperAdmin:
INSERT INTO User_Registration (Reg_F_Name, Reg_L_Name, Reg_UserName, Reg_Email, Reg_Password, Reg_API_KEY, Reg_Security_Qus_ID, Reg_Security_Qus_Ans, Reg_User_Type, Reg_UserID_Flag) values ("Dino", "Cat", "DinoCat", "sofa.king.plh@gmail.com", "Reactjs@2021", "WhYDoIn$$D@n@PIkEYImm@AdMIn", 1, "yes", "Admin", 1);

-- Role Based Mocked User
USE [plhdashboardb_Dev_Mock]
GO

INSERT INTO [dbo].[User_Registration]
           ([Reg_F_Name]
           ,[Reg_L_Name]
           ,[Reg_UserName]
           ,[Reg_Email]
           ,[Reg_Password]
           ,[Reg_API_KEY]
           ,[Reg_Security_Qus_ID]
           ,[Reg_Security_Qus_Ans]
           ,[Reg_User_Type]
           ,[Reg_UserID_Flag])
     VALUES
		   ('Dino',
		   'Cat',
		   'DinoCat',
		   'sofa.king.plh@gmail.com',
		   'Reactjs@2021',
		   'WhYDoIn$$D@n@PIkEYImm@AdMIn',
		   1,
		   'yes',
		   'Admin',
		   1),
           ('Bob'
           ,'Marley'
           ,'BobMarley'
           ,'happiergrimreaper@gmail.com'
           ,'Reactjs@2021'
           ,'dddfdf65654df654df4564dferer'
           ,1
           ,'yes'
           ,'User'
           ,1
			),
			('Bryan', 'Adams', 'Bryan Adams', 'soham.roy.developer@gmail.com', 'Reactjs@2021', 'dddfdf65654df85Kf4df4564dferer', 1, 'yes', 'Manager', 1),
			('Freddie', 'Mercury', 'Freddie Mercury', 'happiergrimreaper@gmail.com', 'Reactjs@2021', 'dddfdf656894df85Kf4df4564dferer', 1, 'yes', 'User', 1),
			('Eric', 'Clapton', 'Eric Clapton', 'callforcodei@gmail.com', 'Reactjs@2021', 'dddfdf600894df85Kf4df4564dferer', 1, 'yes', 'User', 1)
GO


truncate table User_Registration





