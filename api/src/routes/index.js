const express = require('express');

const router = express.Router();

const usercontroller = require('../controller/usercontroller')
const encrypt = require('../encryption/encryptioninitialise')


router.post('/signup',usercontroller.signup,(req,res)=>{
    res.send("HI")
})

router.post('/login',usercontroller.login)

router.post('/transfer_to_local_bank',usercontroller.local_branch_transfer)

router.get('/local_bank_transfer',usercontroller.get_local_bank_transfer)

router.post('/transfer_to_international_bank',usercontroller.local_bank_transfer)

router.post('/decoder',encrypt.getDataById)

router.get('/test', (req,res) => res.send('Test'));


module.exports = router;