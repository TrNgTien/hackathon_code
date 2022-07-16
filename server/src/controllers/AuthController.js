const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");
const nodemailer = require('nodemailer');

const CLIENTID = "363444450027-njg4vpoq62lrck8fia21fgmalg06sms5.apps.googleusercontent.com"
const CLIENTSCERET= "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"
const REDIRECTURL = "https://localhost:5000/auth/google";

const register = async (req, res) => {
  try {
    const {
      userName,
      password,
      userAvatar,
      userCover,
      biography,
      gender,
      firstName,
      lastName,
      DOB,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      userName,
      password: hashedPassword,
      userAvatar,
      userCover,
      biography,
      gender,
      firstName,
      lastName,
      DOB,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const payload = { id: user._id, userName: user.userName };
    const accessToken = jwt.sign(payload, "mentalWeb", { expiresIn: "1h" });
    res.status(200).json({ user, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
};

const google = async (req, res) => {
  function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: "http://localhost:5000/auth/google",
      client_id:
        "363444450027-njg4vpoq62lrck8fia21fgmalg06sms5.apps.googleusercontent.com",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
    return `${rootUrl}?${new URLSearchParams(options)}`;
  }
  return res.send(getGoogleAuthURL());
};

function getTokens({ code, clientId, ClientSecret, redirectUri }) {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id:
      "363444450027-njg4vpoq62lrck8fia21fgmalg06sms5.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: "http://localhost:5000/auth/google",
    grant_type: "authorization_code",
  };
  return axios
    .post(url, new URLSearchParams(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

const returnGoogle = async (req, res) => {
  try {
    const { code } = req.query;
    // const { clientId, clientSecret, redirectUri } = process.env;
    const tokensRes = await getTokens({ code, CLIENTID, CLIENTSCERET, REDIRECTURL });
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokensRes.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokensRes.id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });

    const accessToken = jwt.sign(googleUser, 'tetstestst');

    // const Clientlink = 
    const emailCus = `${googleUser.email}`;
    // console.log(googleUser);

    res.cookie('cookie', accessToken, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
    // res.send(googleUser);
    const sendObject = {
      status: "success",
      id: googleUser.id,
      email: googleUser.email,
      link: "send"
    }
    
    if (googleUser.verified_email == true) {
      const newUserGoogle = new User({
        userAvatar: googleUser.picture,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        DOB: googleUser.birth
      });
      const user = await newUserGoogle.save();
    }

    try {
            const output =
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .btn:hover {
                            background-color: #737373 
                        }
                    </style>
                </head>
                <body style="background-color: #fff;">
                        <!-- start preheader -->
                        <div class="preheader"
                            style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #40de65; opacity: 0;">
                            The request for reseting password from SharingWeb Service
                        </div>
                        <!-- end preheader -->
                        <!-- start body -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- start logo -->
                            <tr>
                                <td align="center" bgcolor="#fff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 20px 24px;">
                                                <h3 style="color: #348D1C;
                                                font-weight: 700;
                                                font-size: 50px;
                                                line-height: 0.65;
                                                font-family: 'Roboto', cursive; margin-bottom: -10px">
                                                    SharingWeb
                                                </h3>
                                                <p style="font-size: 14px;
                                                text-algin: center;
                                                color: #545454;
                                                font-weight: 400;
                                                text-transform: capitalize;
                                                font-style: italic;
                                                font-family: 'Mansalva', cursive;"></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- end logo -->
    
                            <!-- start hero -->
                            <tr>
                                <td align="center" bgcolor="#fff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="left" bgcolor="#fff"
                                                style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #666;">
                                                <h1
                                                    style="color: #348D1C; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                                                    Verify Your Account</h1>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- end hero -->
                            <!-- start copy block -->
                            <tr>
                                <td align="center" bgcolor="#fff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <!-- start copy -->
                                        <tr>
                                            <td align="left" bgcolor="#fff"
                                                style="color: #fff; padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                                                <p style="margin: 0; color: #000">Tap the button below to confirm your email address. If you didn't
                                                    register your account, you can safely delete this email.</p>
                                            </td>
                                        </tr>
                                        <!-- end copy -->
                                        <!-- start button -->
                                        <tr>
                                            <td align="left" bgcolor="#fff">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#fff" style="padding: 12px;">
                                                            <table border="0" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td align="center" bgcolor="#348D1C" style="border-radius: 6px;">
                                                                        <a class="btn" href="#" target="_blank"
                                                                            style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #fff; text-decoration: none; border-radius: 6px;">Account Verification</a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- end button -->
                                        <!-- start copy -->
                                        <tr>
    
                                        </tr>
                                        <!-- end copy -->
                                        <!-- start copy -->
                                        <tr>
                                            <td align="left" bgcolor="#fff"
                                                style="padding: 20px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #333">
                                                <p style="margin: 0; color: #000">Sincerely,<br></p>
                                                <p style="margin: 0; color: #348D1C">SharingWeb Service</p>
                                            </td>
                                        </tr>
                                        <!-- end copy -->
                                    </table>
                                </td>
                            </tr>
                            <!-- end copy block -->
                            <!-- start footer -->
                            <tr>
                                <td align="center" bgcolor="#fff" style="padding: 20px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <!-- start permission -->
                                        <tr>
                                            <td align="center" bgcolor="#fff"
                                                style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #ccc;">
                                                <p style="margin: 0; color: #000">You received this email because we received a request for reseting for
                                                    your account. If you didn't request it you can safely delete this email.</p>
                                                <p style="margin: 0; color: #000">Quarter 6, Linh Trung Ward, Thu Duc City, Ho Chi Minh City</p>
                                            </td>
                                        </tr>
                                        <!-- end permission -->
                                    </table>
                                </td>
                            </tr>
                            <!-- end footer -->
    
                        </table>
                        <!-- end body -->
                    </body>
                </html>            
            `;

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                // secure: false, // true for 465, false for other ports
                // host: 'smtp.gmail.com',
                // port: 465,
                secure: false, // use SSL
                auth: {
                    user: 'glamorous.cs01@gmail.com', // generated ethereal user
                    pass: 'kikshzecwigiwrfc' // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"SharingWeb Customer Service" <glamorous.cs01@gmail.com>', // sender address
                to: emailCus, // list of receivers
                subject: 'EMAIL VERIFICATION ', // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.status(200).json({ result: sendObject });

                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
            // console.log(link)
        } 
    catch (error) {
        console.log("g",error.message)
        res.send(error.message)
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { register, login, google, returnGoogle };
