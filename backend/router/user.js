require('dotenv').config(); 
const express = require('express');
const router = express.Router();
const zod = require('zod');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const {User,Account} = require('../db');
const authmiddleware = require('../middleware');

// console.log(authmiddleware); 
const signupSchema = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})

router.post('/signup',async function(req,res){
    // const body = req.body;
    try{
        const {success,error} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Usernname already taken or incorrect input fields",
            errors:error.errors
        })
    }

    const existing =await User.findOne({
        username:req.body.username
    })
    // console.log(existing);
    if(existing && existing._id){
        return res.status(409).json({
            message:"username already taken"
        })
    }
    const user  = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    })
    // console.log(user);



    const userId = user._id;
    
    await Account.create({
        userId,
        username: userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        user:user._id
    },JWT_SECRET);

    res.json({
        message:"User created Successfully",
        user:user,
        token:token
    })
}catch(err){
    console.error(err);
    return res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    })
}
})

const signinSchema = zod.object({
    username:zod.string(),
    password:zod.string()
})

router.post('/signin',async function(req,res){
    
    const {success,error} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Email already taken or in correct input fields",
            errors:error.errors
        })
    }

    const user = await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(user){
        const token = jwt.sign({
            user:user._id
        },JWT_SECRET)
        res.json({
            message:"Signed successfully",
            token:token
        })
        return;
    }
    res.status(401).json({
        message:"Error while logging in"
    })

})

const updateSchema = zod.object({
    password:zod.string().optional(),
    firstname:zod.string().optional(),
    lastname:zod.string().optional()
})

router.put('/update', authmiddleware, async function (req, res) {
    // console.log("in update");
    try {
        const { success, error } = updateSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect Input fields",
                errors: error.errors
            });
        }
        // console.log(success);
        // console.log(req.body);
        // console.log(req.user);
        const updateResult = await User.updateOne(
            { _id: req.user },
            { $set: req.body }
        );
        const updateddata = await User.findOne({
            _id: req.user
        });

        // console.log("updateddata",updateddata);
        
        if (updateResult.modifiedCount ==
             0) {
            return res.status(404).json({ message: "User not found or no changes made" });
        }
        return res.json({
            message: "Updated successfully",
            result: updateddata
        });
    } catch (err) {
        // console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/bulk',async function (req,res) {
    const filter = req.query.filter ||"";
    const users  = await User.find({
        $or:[
            {
                firstname:{
                    "$regex":filter,
                    "$options": "i" 
                }
            },
            {
                lastname:{
                    "$regex":filter,
                    "$options": "i" 
                }
            }
        ]
    })
    if(users.length == 0){
        return res.status(404).json({
            message:"No users found"
        });
    }
    // console.log(users);
    res.json(users)
})


router.get('/userprofile',authmiddleware,async function(req,res) {
    try{
        const user = await User.findOne({_id:req.userId});
        const accountdetails = await Account.findOne({userId:req.userId});
        res.json(
            {
                firstname:user.firstname,
                balance:accountdetails.balance
            }
        )
    }catch(err){
        // console.log(err);

    }
})

module.exports = router;