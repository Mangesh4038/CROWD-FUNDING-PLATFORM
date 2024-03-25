const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mailsend = async (options) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: `<div style="background-color: black;
      color: #fff;
      max-width: 500px;
      padding: 40px 20px;
      border-radius: 10px;">
      <div class="card-body">
          <img src="https://cdn-icons-png.flaticon.com/512/4630/4630926.png" alt="email-image" style="display: block;
          width: 15%;
          height: 15%;
          margin-top: 3%;
          margin-left: auto;
          margin-right: auto;" />
          <h2 style="color: rgb(140, 96, 245); text-align: center;">Verify Your Email</h2>
          <p style="font-size: 12px; text-align: center;">Almost there! We've sent a verification email to ${options.name}.<br /> You need to verify your email address to log into CrowdsClub.</p>
          <a href=${options.url} style="cursor: pointer;"><button  style="display: block;
          margin-left: auto;
          margin-right: auto;
          width: 37%;
          background-color: rgb(140, 96, 245);
          border: none;
          padding: 10px 20px;
          border-radius: 10rem;">Verify Email</button></a>
      </div>
      </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

module.exports = mailsend;