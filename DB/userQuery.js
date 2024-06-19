const senderMail = require('../expressCode/nodemailer.js');
const { passwordGenerate, comparePassword } = require('../expressCode/userLogic.js');
const client = require('../server.js')
const randomString = require("randomstring");

const dbClient = client.db("PasswordResetTask").collection("Users");

async function getUser(name){
    const user = await dbClient.findOne({$or : [{mail :  name},{name : name}]});
    return user;
}

async function addUser(reg){
    const user = await getUser(reg.mail);
    if(user){
        return false
    }
    //doing instead of bcryptjs
    const pass = await passwordGenerate(reg.password);
    await dbClient.insertOne({
        mail : reg.mail,
        name : reg.name,
        password : pass
    })
    return true;
}

async function loginUser(reg){
    const user = await getUser(reg.mail);
    if(!user){
        const must = await getUser(reg.name);
        if(must){
            const bol = await comparePassword(reg.password,user.password);
            return bol;
        }
        return false;
    }
    const bol = await comparePassword(reg.password,user.password);
    return bol;
}

async function passwordReset(reg){
    const user = await getUser(reg.mail);
    if(user){
        const generatedKey = randomString.generate({
            length : 10,
            charset : "alphabetic"
        })
        await senderMail(generatedKey,user.mail);
        await dbClient.updateOne({mail : user.mail}, {
            $set :{
                resetKey : generatedKey
            }
        })
        return true;
    }
    return false;
}

async function validateAndResetPassword(mail,resetKey){
    const user = await getUser(mail);
    const validate = await isResetKeySent(user);
    return validate && user.resetKey === resetKey;
}

async function isResetKeySent(user){
    const keyCheck = await dbClient.findOne({mail : user.mail, resetKey : {$exists : true}});
    return keyCheck ? true : false;
}

async function checkResetKey(mail, resetKey){
    const check = await dbClient.findOne({mail : mail, resetKey : resetKey});
    return check ? true : false;
}

async function setPassword(mail,password){
    const genPass = await passwordGenerate(password);
    const keyCheck = await dbClient.updateOne({mail : mail},
        {
            $set : {password : genPass},
            $unset :{resetKey : ""}
        }
    );
    return keyCheck ? true : false;
}


module.exports = {checkResetKey,setPassword,getUser,addUser,loginUser,passwordReset,validateAndResetPassword}