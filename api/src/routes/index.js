const express = require('express');

const router = express.Router();

const usercontroller = require('../controller/usercontroller')
const encrypt = require('../encryption/encryptioninitialise')


router.post('/signup',usercontroller.signup,(req,res)=>{
    res.send("HI")
})
<<<<<<< HEAD

router.post('/local_branch_login',usercontroller.login)
=======
router.get('/login',(req,res)=>{
    res.render('login.ejs',{});
})
router.post('/login',usercontroller.login)
>>>>>>> 666f9ce5651fb8c76cd8cc82831aa8791d8c8a5a

router.post('/local_branch_login/transfer_to_local_bank',usercontroller.local_branch_transfer)

router.get('/login/local_bank_transfer',usercontroller.get_local_bank_transfer)

router.post('/login/transfer_to_international_bank',usercontroller.local_bank_transfer)

router.post('/decoder',encrypt.getDataById)

router.get('/test', (req,res) => res.send('Test'));


module.exports = router;