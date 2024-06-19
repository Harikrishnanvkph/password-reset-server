const nodemailer = require("nodemailer");

const transportor = nodemailer.createTransport({
    host : "smtp.gmail.com",
    auth : {
        user : `${process.env.MY_MAIL}`,
        pass : process.env.APP_KEY
    }
})

async function senderMail(OTP,receiver){
    await transportor.sendMail({
        from : `${process.env.MY_MAIL}`,
        to : receiver,
        subject : "Link To Reset Your Password",
        html :  `
            <div>
                Your OTP key is ${OTP}
                <p>Please DO NOT share the provided unique key with anyone</p>
                <p>Click <a href="https://main--charming-moonbeam-f52265.netlify.app/validate/${receiver}">Reset Link</a></p>
            </div>`
    })
}

module.exports = senderMail
