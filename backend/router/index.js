const express = require("express");
const userRuoter = require('./user');
const accountRouter = require('./account');

const router = express.Router();

router.use('/user',userRuoter);
router.use('/account',accountRouter);

module.exports = router;

