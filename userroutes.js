const express = require('express');
const router = express.Router()
const { userRegister, userLogin, userLogout, getNewAcessToken, addPost } = require('./usercontroller');

const { authMiddleWare } = require('./authservices')


router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/getNewToken', getNewAcessToken)
router.get('/getPost', authMiddleWare, addPost)
router.delete('/logout', userLogout)



module.exports = router;