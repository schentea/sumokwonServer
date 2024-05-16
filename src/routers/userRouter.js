import express from 'express';
import { googleLogin, kakaoLogin, memberLogin, memberRegister, passwordEdit, testQr } from '../controllers/userController.js';

const userRouter = express.Router()
userRouter.post('/register', memberRegister);
userRouter.post('/login', memberLogin)
userRouter.get('/socials/kakao', kakaoLogin);
userRouter.get('/socials/google', googleLogin);
userRouter.post('/passwordEdit', passwordEdit)
userRouter.post('/testQr', testQr)
export default userRouter;