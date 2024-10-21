const express  = require('express');
const  authmiddleware  = require('../middleware');
const {Account} = require('../db')
const mongoose = require('mongoose')

const router = express.Router();

router.get('/balance',authmiddleware,async function(req,res){
    // console.log(req.user);
    try{
        const account = await Account.findOne({
        userId:req.user
    });
    // console.log(account);
    res.json({
            balance:account.balance
        })
    }catch(err){
        console.error(err);
        res.status(400).json({
            message:"Failed to fetch balance"
        })
    }
});

router.post('/transfer', authmiddleware, async function(req, res) {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { amount, to } = req.body;
        // console.log("Transfer details:", { amount, to });

        const transferAmount = Number(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            throw new Error("Invalid transfer amount");
        }

        // console.log("Finding source account");
        const account = await Account.findOne({ userId: req.userId }).session(session);
        // console.log("Source account:", account);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        // console.log(toAccount);




        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }
        
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });

    } catch (err) {
        await session.abortTransaction();
        console.error("Transfer error:", err);
        res.status(400).json({
            message: "Transfer failed",
            error: err.message
        });
    } finally {
        session.endSession();
        // console.log("Transfer route completed");
    }
});

module.exports = router;