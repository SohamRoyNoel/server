import { sign, verify } from "jsonwebtoken";
import { IctxType } from '../types/AppCTX/Ictx.type';

/**
 * Create a URl that will be passed for App Request accepter mutation for Admin
 * will be passed by mail
 */
export function createUrlToAcceptApplicationRequest(reqid: number, reqappname: string, reqstatus: string, requestby: number, cntr: number): string{
    let createAJWT = sign({
        reqId: reqid,
        reqAppName: reqappname,
        reqStatus: reqstatus,
        requestedBy: requestby,
        counter: cntr
    },
        process.env.MAILER_TOKEN_SECRET!,
    {
        expiresIn: process.env.MAIL_TOKEN_EXPIRES_IN!
    });

    let createURL = process.env.MAIL_SENDER_URL! + process.env.MAIL_SENDER_SUFFIX_APP_REQUEST! + createAJWT;

    return createURL;
}

export function createUrlToAcceptApplicationRequestDecoder(token: string){
    let payload = verify(token, process.env.MAILER_TOKEN_SECRET!);
    return payload;
}

export function changePasswordURLProvider(uid: number, uem: string, uType: string, otp: number): string {
    let createAJWT = sign({
        id: uid,
        email: uem,
        role: uType,
        oneTimePs: otp
    },
        process.env.MAILER_TOKEN_SECRET!,
    {
        expiresIn: process.env.CHANGE_PASSWORD_MAIL_TOKEN_EXPIRES_IN!
    });
    let createURLString = process.env.CHANGE_PASSWORD_MAIL_SENDER_URL! + process.env.CHANGE_PASSWORD_MAIL_SENDER_SUFFIX_APP_REQUEST! + createAJWT;
    return createURLString;
}