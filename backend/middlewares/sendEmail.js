const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) =>{

    var transporter = nodeMailer.createTransport({                        //used mailtrap.io for trail
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "1af1cecdefd7bf",
          pass: "4ec914b5141751"
        }
      });

    // const transporer = nodeMailer.createTransport({

    //     host: SMPT_HOST,
    //     port: SMPT_PORT,
    //     auth:{
    //         user: SMPT_MAIL,
    //         pass: SMPT_PASSWORD,
    //     },
    //     service: SMPT_SERVICE,
    // });

    const mailOptions = {
        from: "SMPT_MAIL",                                              //my personal emial
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
}