import { ApolloServer } from "apollo-server-express";
import express = require("express");
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import {createConnection} from "typeorm";
import { HealthResolver } from './resolvers/HealthResolver';
import { UserRegistrationResolver } from "./resolvers/Registration/User_Registration.resolver";
import { UserLoginResolver } from "./resolvers/Login/User_Login.resolver";
import { ProtectedResolverHealth } from './resolvers/ProtectedResolvers/ProtectedResolver.health';
import "dotenv/config";
var morgan = require('morgan');
import cookieParser = require("cookie-parser");
const helmet = require('helmet');
var xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
var hpp = require('hpp');
import { verify } from 'jsonwebtoken';
const cors = require('cors');
import { User_Registration } from './entity/User_Registration';
import { CreateAccessToken, CreateRefreshToken } from './utils/tokenCreator';
import { SendRefreshTokenOnRefreshedAccessToken } from './utils/sendRefreshTokenOnRefreshedAccessToken';
import { TokenVersionControl } from "./resolvers/TockenBlocker/TokenVersionControl";
import { ApplicationResolver } from "./resolvers/ProtectedResolvers/Admin/Application_Master.resolver";
import { RegisteredUserResolver } from "./resolvers/ProtectedResolvers/Admin/User_Registration.resolver";
import { PageResolver } from "./resolvers/ProtectedResolvers/Admin/Page_Master.resolver";
import { UserApplicationRequestMapperResolver } from "./resolvers/ProtectedResolvers/LoggedInGeneralUser/Application_Request_mapper.resolver";
import { UserApplicationRequestMapperResolver_AdminAccepter } from "./resolvers/ProtectedResolvers/Admin/Application_Request_Mapper_Admin.resolver";
import { TestScenarioMasterResolver } from "./resolvers/ProtectedResolvers/LoggedInGeneralUser/TestScenario_Master.resolver";
import { SecurityQuestionsResolver } from "./resolvers/ProtectedResolvers/Admin/Security_Questions.resolver";
import { ChangePasswordProtectedResolver } from "./resolvers/ProtectedResolvers/LoggedInGeneralUser/Change_Password.resolver";
import { ApplicationUserMapperResolver } from "./resolvers/ProtectedResolvers/Admin/Application_User.resolver";

// Do not use in PRODUCTION: GraphQL Lifecycle logger - DEV only
import { graphql_REQ_Query_LifeCycle_Logger_dev } from "./utils/graphql_REQ_Query_LifeCycle.Logger.dev";

(async () => {
    const app = express();
    app.use(morgan('combined'));

    // Security Headers
    //app.use(helmet());
    // app.use(xss());
    // const limiter = rateLimit({
    //     windowMs: 10 * 60 * 1000, // 15 minutes
    //     max: 100 // limit each IP to 100 requests per windowMs
    // });
    // app.use(limiter);
    // app.use(hpp());

    var corsOptions = {
        origin: process.env.CORS_ORIGIN,
        optionsSuccessStatus: 200 
    };

    // Handle refresh token
    app.use(cookieParser());
    app.post('/getNewAccessToken', async (req, res) => {

        // Perse the cookie
        const cookieRefreshToken = req.cookies._atr;
        if(!cookieRefreshToken) { return res.send({"status": false, accessToken: ''}); }

        // Get the TOKEN and decode the payload
        let payload: any = null;
        try {
            payload = verify(cookieRefreshToken, process.env.REFRESH_JWT_SECRET!);
        } catch (error) {
            console.log(error);
            return res.send({"status": false, accessToken: ''});
        }

        // find the user
        const userOne = await User_Registration.findOne({ Reg_UserID: payload.uid });
        if(!userOne) { return res.send({"status": false, accessToken: ''}); }

        // Token Version implementation by incrementing the token version at TokenVersionControl @Mutation
        if(userOne.Token_Version !== payload.tokenVersion) { return res.send({"status": false, accessToken: ''}); }

        // When refresh the Access Token we will refresh the Refresh token
        SendRefreshTokenOnRefreshedAccessToken(res, CreateRefreshToken(userOne)); 

        // return a Access token
        return res.send( { "status": true, accessToken: CreateAccessToken(userOne)} );
    });

    await createConnection();  
        
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserRegistrationResolver,
                UserLoginResolver, 
                HealthResolver, 
                ProtectedResolverHealth,
                TokenVersionControl,
                ApplicationResolver,
                RegisteredUserResolver,
                PageResolver,
                UserApplicationRequestMapperResolver,
                UserApplicationRequestMapperResolver_AdminAccepter,
                TestScenarioMasterResolver,
                SecurityQuestionsResolver,
                ChangePasswordProtectedResolver,
                ApplicationUserMapperResolver
            ],
        }),
        tracing: true,
        plugins: [
            // graphql_REQ_Query_LifeCycle_Logger_dev as any
        ],
        context: ({ req, res }) => ({ req, res }) // Use context to pass req & response to mutations or queries
    });

    apolloServer.applyMiddleware({ app, cors: corsOptions });

    app.listen(4000, () => {
        console.log("App is started");
    }).keepAliveTimeout = 10000
    
    
})();
