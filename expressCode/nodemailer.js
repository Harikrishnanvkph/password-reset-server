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
        html : `<div>Your OTP key is <a href='#'>${OTP}</a><p>Please DONOT Share the provided Unique Key to anyone</p>
        <p>Click <span><a href="${process.env.RESET}${receiver}">Reset Link</a></span><p></div>`
    })
}

module.exports = senderMail