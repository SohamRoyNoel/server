import { TestScenario_Master } from './../../../entity/TestScenario_Master';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsAuthMiddleware } from '../../../middlewares/IsAuth.middleware';
import { IctxType } from "../../../types/AppCTX/Ictx.type";
import { TestScenarioMasterType } from '../../../types/TestScenario_Master.type';
import { Application_Master } from '../../../entity/Application_Master';
import { getConnection, getManager } from 'typeorm';
import { mailerServiceCore } from "../../../utils/mailUtils/nodeMailer";

@Resolver()
export class TestScenarioMasterResolver {

      @Mutation(() => Boolean)
      @UseMiddleware(IsAuthMiddleware)
      async acceptTestScenario(
            @Arg("acceptTestScenarioMutation") acceptTestScenarioMutation: TestScenarioMasterType,
            @Ctx() { payload }: IctxType
      ){
            /**
             * Find The App ID BY NAME
            */
            try {
                  const user = payload?.uid;
                  let userEmail = payload?.userEmail!;
                  let foundApp = await Application_Master.findOne({ where: {
                       Application_Name: acceptTestScenarioMutation.TS_Application_Name
                  } }).then((e) => {
                        return e?.Application_ID;
                  });
                  
                  // Validation -1 -> Check if TC Name exists for same APPLICATION
                  let givenTS = acceptTestScenarioMutation.applicationsName?.map(n => '\'' + n + '\'').toString(); 

                  var rawQueryToValidateIfExists = `select * from TestScenario_Master where TS_Name IN(${givenTS}) and Ts_application_id=${foundApp}`;
                  const ifDuplicateTSForSameApp: TestScenario_Master[] = await getManager().query(rawQueryToValidateIfExists);

                  if(ifDuplicateTSForSameApp.length > 0) {
                        return false;
                  }else {
                        /* 
                              Insert only when there is no existing TS
                        */
                        if(foundApp! > 0 && foundApp !== undefined) {
                              /**
                               * await and insert the data into TestScenario_Master
                              */
                              let createBulkJsonObject: string = '';
                              var tcs: String[] = [];
                              acceptTestScenarioMutation.applicationsName!.forEach(async (value: any, index: any, array: any) => {
                                   createBulkJsonObject += "('" + value +"',"+ foundApp! +","+ user + "),";                             
                                   if(index === acceptTestScenarioMutation.applicationsName!.length - 1){
                                         var actualValues = createBulkJsonObject.substring(0, createBulkJsonObject.length-1);
                                         var query = `insert into TestScenario_Master(TS_Name, TS_Application_ID, Reg_UserID) values ${actualValues}`;
                                         await getManager().query(query).then(() => {
                                               mailerServiceCore(payload?.userName!, `Your Test Scenarios - ${array} are added to the list. You can execute code against issued test case name. `, 'U', userEmail.trim());
                                         })       
                                   }
                              });                     
                              
                              return true;
                        } else{
                              return false;
                        }
                  }
            } catch (error) {
                  console.log(error);
                  return false;
            }   
      }

      // Find TestScenarios by App Name
      @Query(() => [TestScenario_Master])
      @UseMiddleware(IsAuthMiddleware)
      async getTestScenarios(
            @Arg("getTestScenarioMutation") getTestScenarioMutation: TestScenarioMasterType,
            @Ctx() { payload }: IctxType
      ) {
            let userRole = payload!.userRole;
            let selectedAppID = getTestScenarioMutation.TS_Application_ID;

            let tsm = await getConnection().getRepository(TestScenario_Master).createQueryBuilder("testScenario_Master")
                        .innerJoinAndSelect("testScenario_Master.userRegistrations", "userRegistrations")
                        .where("testScenario_Master.TS_Application_ID = :appId", { appId: selectedAppID })
                        .getMany();                     
            return tsm;
      }

}

