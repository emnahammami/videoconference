const users = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const nodemailer = require("nodemailer");
const keysecret = process.env.secretorkey



exports.Register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const found = await users.findOne({ email });
    if (found) {
      return res.status(400).send({ errors: [{ msg: "user already exist" }] });
    }
    const newUser = new users(req.body);
    //bcrypt
    const salt = 10;
    const hashpassword = bcrypt.hashSync(password, salt);
    newUser.password = hashpassword;
    //jwt
    const payload = { id: newUser._id };
    const token = jwt.sign(payload, process.env.secretorkey);
    await newUser.save();
    res.status(200).send({ msg: "registered", newUser, token });
  } catch (error) {
    res.status(500).send("could not register");
  }
};
exports.Login = async (req, res) => {
  const { email, password, id, isBanned } = req.body;
  try {
    const foundUser = await users.findOne({ email });
    if (!foundUser) {
      return res.status(400).send({ errors: [{ msg: "bad credentials, Email not found" }] });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(400).send({ errors: [{ msg: "bad credentials, password doesn't match" }] });
    }

    if (foundUser.isBanned=="true") {
      return res.status(400).send({ errors: [{ msg: "your account is banned" }] });
    }

    const payload = { id: foundUser._id };
    const token = jwt.sign(payload, process.env.secretorkey);

    foundUser.isActivated = true;
    foundUser.lastLogin = new Date();
    await foundUser.save();

    res.status(200).send({ msg: "logging with succ", foundUser, token });
  } catch (error) {
    res.status(500).send({ msg: "couldn't logging" });
  }
};

exports.Getusers = async (req, res) => {
  try {
    const userss = await users.find();
    res.status(200).send({ msg: "list of users", userss });
  } catch (error) {
    res.status(500).send("couldn't get users");
  }
};

exports.Deleteuser= async(req, res) =>{
  const { name  } = req.body;
  try
  {const deleted= await users.findByIdAndDelete(req.params.id)
     
  res.status(200).send({msg:"usser deleted",deleted})
  
 
  }
  catch (error) {
      res.status(500).send("couldnt delete user")
  
  }}
exports.Deleteuser= async(req, res) =>{
  
  try
  {const deleted= await users.findByIdAndDelete(req.params.id)
     
  res.status(200).send({msg:"usser deleted",deleted})
  
 
  }
  catch (error) {
      res.status(500).send("couldnt delete user")
  
  }}
  exports.EditU=async(req, res) =>{
    try
    {const updated= await users.findByIdAndUpdate(req.params.id,{$set:req.body,},{new:true});
        
       
    res.status(200).send({msg:"user updated",updated})
    
    
    }
    catch (error) {
        res.status(200).send("couldnt update user")
    
    }}
  exports.EditUser=async(req, res) =>{
    try
      {const updated= await users.findByIdAndUpdate(req.params.id,{$set:req.body,},{new:true});
          
         
      res.status(200).send({msg:"user updated",updated})
      
      
      }
      catch (error) {
          res.status(200).send("couldnt update user")
      
      }}
      exports.Finduserbyid= async(req, res) =>{
   
        try
        {const fu= await users.findById(req.params.id)
           
        res.status(200).send({msg:"user found",fu})
        
       
        }
        catch (error) {
            res.status(500).send("couldnt found user")
        
        }}
  


exports.countByGender = async(req, res) => {
  try {
    const count = await users.countByGender();
    res.json(count);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.countByRole = async(req, res) => {
  try {
    const count = await users.countByRole();
    res.json(count);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
//////////////////////////////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  service: 'gmail',
  auth:{
      user:'mohamedaziz.snoussi@esprit.tn',
      pass:'90016339'
  }
}) 
// send email Link For reset Password
/*
exports.sendPasswordLink = async(req,res)=>{
  console.log(req.body)

  const {email} = req.body;

  if(!email){
      res.status(401).json({status:401,message:"Enter Your Email"})
  }

  try {
      const userfind = await users.findOne({email:email});

      // token generate for reset password
      const token = jwt.sign({id:userfind._id},process.env.secretorkey,{
          expiresIn:"300s"
      });
      
      const setusertoken = await users.findByIdAndUpdate({id:userfind._id},{verifytoken:token},{new:true});


      if(setusertoken){
          const mailOptions = {
              from:process.env.EMAIL,
              to:email,
              subject:"Sending Email For password Reset",
              text:`This Link Valid For 2 MINUTES http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
          }

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.status(401).json({status:401,message:"email not send"})
              }else{
                  console.log("Email sent",info.response);
                  res.status(201).json({status:201,message:"Email sent Successfully"})
              }
          })

      }

  } catch (error) {
      res.status(401).json({status:401,message:"invalid user"})
  }

} */

exports.sendPasswordLink = async(req,res)=>{
  const { email } = req.body;
  try {
    const oldUser = await users.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    //const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign( {id: oldUser._id} , process.env.secretorkey, {
      expiresIn: "59m",
    });
    const link = `This Link Valid For 5 MINUTES http://localhost:3000/forgotpassword/${oldUser._id}/${token}`;
    var mailOptions = {
      from: process.env.EMAIL,
      to:email,
      subject: "Password Reset",
      text: link,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        //console.log("Email sent: " + info.response);
        res.status(200).send("Email Sent sucessfully "+ info.response);
      }
    });
  } catch (error) { }
};
// verify user for forgot password time
exports.ForgotPassword =async(req,res)=>{
  const {id,token} = req.params;

  try {
      const validuser = await users.findOne({_id:id,verifytoken:token});
      
      const verifyToken = jwt.verify(token,process.env.secretorkey);

      if(validuser && verifyToken._id){
          res.status(201).json({status:201,validuser})
      }else{
          res.status(401).json({status:401,message:"user not exist"})
      }

  } catch (error) {
      res.status(401).json({status:401,error})
  }
}


// change password

exports.ChangePasswordWithIdandToken =async(req,res)=>{
  const {id,token} = req.params;

  const {password} = req.body;

  try {
      const validuser = await users.findOne({_id:id});      
      const verifyToken = jwt.verify(token,process.env.secretorkey);

      if(validuser && verifyToken.id){

          const newpassword = await bcrypt.hashSync(password,10);

          const setnewuserpass = await users.findByIdAndUpdate({_id:id},{password:newpassword});

          setnewuserpass.save();
          res.status(201).json({status:201,setnewuserpass})

      }else{
          res.status(401).json({status:401,message:"user not exist"})
      }
  } catch (error) {
      res.status(401).json({status:401,error})
  }
}


