const express = require("express");
const { getUser, addUser, loginUser, passwordReset, validateAndResetPassword, setPassword, checkResetKey } = require("../DB/userQuery");
const exp = express.Router();


exp.get("/",(req,res,next)=>{
    res.send("Very Good Morning to one and all present here")
})

exp.get("/:name", async(req,res,next)=>{
    const {name} = req.params;
    const getMe =  await getUser(name);
    res.send(getMe)
})

exp.post("/createUser",express.json(),async (req,res,next)=>{
    const reg = req.body;
    const addMe = await addUser(reg);
    addMe ? res.send('200') : res.send("404");
})

exp.post("/login",express.json(),async(req,res,next)=>{
    const reg = req.body;
    const loginMe= await loginUser(reg);
    loginMe ? res.send("200") : res.send("404");
})

exp.post("/password_reset",async (req,res,next)=>{
    const reg = req.body;
    const pwdrst = await passwordReset(reg);
    pwdrst ? res.send("200") : res.send("404");
})


exp.post("/resetPassword/:mail",async (req,res,next)=>{
    const reg = req.body;
    const pwdrst = await validateAndResetPassword(reg.mail,reg.resetKey);
    pwdrst ? res.send("200") : res.send("404");
})

exp.post("/set/password",async (req,res,next)=>{
    const reg = req.body;
    const pwdrst = await setPassword(reg.mail,reg.password);
    pwdrst ? res.send("200") : res.send("404");
})

exp.post("/checkKey",async (req,res,next)=>{
    const reg = req.body;
    const pwdrst = await checkResetKey(reg.mail,reg.secretKey);
    pwdrst ? res.send("200") : res.send("404");
})


module.exports = exp;