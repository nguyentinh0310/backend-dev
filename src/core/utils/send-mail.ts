const nodemailer = require("nodemailer");
import { OAuth2Client } from "google-auth-library";
import Logger from "./logger";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

const sendEmail = async (to: string, url: string, txt: string) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const access_token = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        access_token,
      },
    });

    const mailOptions = {
      from: SENDER_MAIL,
      to: to,
      subject: "IT Network",
      html: 
      `<div style="max-width: 700px; margin:auto; border: 5px solid #009efd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Chào mừng tới IT Network.</h2>
        <p>Xin chúc mừng! Bạn sắp bắt đầu sử dụng IT Network.
          Chỉ cần nhấp vào nút bên dưới để xác thực địa chỉ email của bạn.
        </p>
        
        <a href=${url} style="background: #85eb7d; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
  
        <p>Nếu nút không hoạt động vì bất kỳ lý do gì, bạn cũng có thể nhấp vào liên kết bên dưới (test-api)):</p>
        
        <div>${url}</div>
       </div>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    Logger.error(error);
  }
};

export default sendEmail;
