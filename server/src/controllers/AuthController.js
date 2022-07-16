const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require('nodemailer');

const User = require("../models/User");
const SaltRound = 10; 

const register = async (req, res) => {
    try {
        const {
            userType,
            fullName,
            email,
            userName,
            identityNumber,
            password,
            certificate
        } = req.body;
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }
        const salt = await bcrypt.genSalt(SaltRound);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        if (userType === "expert") {
            const newUser = new User({
                userType,
                email,
                userName,
                password: hashedPassword,
                fullName,
                identityNumber,
                certificate
            });
            const user = await newUser.save();
            const result = {
                message: 'Register expert success',
                data: user
            }
            res.status(200).json(result);
        } else if (userType === "user") {
            const newUser = new User({
                userType,
                email,
                userName,
                password: hashedPassword,
                fullName,
            });
            const user = await newUser.save();
            const result = {
                message: 'Register user success',
                data: user
            }
            res.status(200).json(result);
        }
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
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1h" });
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
            client_id: process.env.CLIENT_ID,
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
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SCERET,
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

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.query;
        const CLIENTID = process.env.CLIENT_ID
        const CLIENTSCERET = process.env.CLIENT_SECRET
        const REDIRECTURL = process.env.REDIRECT_URI
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

        const accessToken = jwt.sign(googleUser, process.env.JWT_ACCESS_TOKEN);

        // const Clientlink = 
        const emailCus = `${googleUser.email}`;
        // console.log(googleUser);

        // res.cookie('cookie', accessToken, {
        //     maxAge: 900000,
        //     httpOnly: true,
        //     secure: false,
        // });
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
            console.log("verifymail",error.message)
            res.send(error.message)
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const forgotPassword = async(req, res) => {
    try {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(req.body.email)) return res.status(400).json('Invalid email');

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json('No account exist');

        const secret = process.env.JWT_ACCESS_TOKEN + user.password;
        const payload = {
            email: user.email,
            id: user.id,
        }
        const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
        const linkReset = `http://localhost:5000/auth/restPass/${user.id}/${accessToken}`;
        const emailCus = `${user.email}`;

        const sendObject = {
            status: 'success',
            id: user.id,
            email: user.email,
            token: accessToken,
            link: linkReset
        }

        res.status(200).json({ result: sendObject });

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
                                                                        <a class="btn" href="${linkReset}" target="_blank"
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
                    user: process.env.USER_MAIL, // generated ethereal user
                    pass: process.env.USER_PASS_MAIL // generated ethereal password
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
        } 
        catch (error) {
            console.log("forgot",error.message)
            res.send(error.message)
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const resetPassword = async(req, res) => {
    try {
        const { id } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password not match"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const salt = await bcrypt.genSalt(SaltRound);
        const hashPassword = await bcrypt.hash(password, salt);
        await User.findOneAndUpdate({ _id: id }, { password: hashPassword });
        const result = {
            message: 'Reset password success',
            status: 'success'
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = { register, login, google, verifyEmail, forgotPassword, resetPassword };
