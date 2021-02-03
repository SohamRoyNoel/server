const nodemailer = require("nodemailer");
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export async function mailerServiceCore(un:string | null, actionText: string | null, flag: string, tos: string ,link? : string) {

  const filePath = path.join(__dirname, './MailBody.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    username: "COP"
  };
  const htmlToSend = template(replacements);
  
  let testAccount = await nodemailer.createTestAccount();  

  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_AUTH_USER_SECRET, // generated ethereal user
      pass: process.env.MAILER_AUTH_PASS_SECRET, // generated ethereal password
    },
  });

  const readHTMLFile = (path: any, callback: any) => {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
  };

  var targetLock: string;

  if(flag === 'A'){
    targetLock = '/AdminMailBody.html';
  } else if (flag === 'R') {
    targetLock = '/RecoverySteps.html';
  } else if (flag === 'CP1') {
    targetLock = '/ChangePassword_link.html';
  } else if (flag === 'CP2') {
    targetLock = '/ChangePassword_OTP.html'
  } else {
    targetLock = '/MailBody.html';
  }

  readHTMLFile(__dirname + targetLock, async function(err: any, html: any) {
    var template = handlebars.compile(html);
    var replacements = {
         username: un,
         actionArea: actionText,
         lnk: link
    };
    var htmlToSend = template(replacements);
    
    await transporter.sendMail({
      from: process.env.MAILER_FROM, // sender address
      to: tos, // list of receivers
      subject: "Cognizant Performance LightHouse Notification", // Subject line
      text: "Hypothetic world?", // plain text body
      html: htmlToSend,
      attachments: [
        {
          filename: 'Manu.png',
          path: __dirname + '/images/Manu.png',
          cid: 'head' //same cid value as in the html img src
        },
        {
          filename: 'foot.jpg',
          path: __dirname + '/images/foot.jpg' ,
          cid: 'foot' //same cid value as in the html img src
        }
      ],
      
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
}
