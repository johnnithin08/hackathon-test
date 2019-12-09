const express = require('express');

const router = express.Router();

const usercontroller = require('../controller/usercontroller')
const encrypt = require('../encryption/encryptioninitialise')


router.post('/signup',usercontroller.signup,(req,res)=>{
    res.send("HI")
})

router.post('/local_branch_login',usercontroller.login)

router.post('/local_branch_login/transfer_to_local_bank',usercontroller.local_branch_transfer)

router.get('/login/local_bank_transfer',usercontroller.get_local_bank_transfer)

router.post('/login/transfer_to_international_bank',usercontroller.local_bank_transfer)

router.post('/decoder',encrypt.getDataById)

router.get('/test', (req,res) => res.send('Test'));


module.exports = router;