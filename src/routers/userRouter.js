import express from 'express';
import { googleLogin, kakaoLogin, memberLogin, memberRegister, passwordEdit, stampInfo, testQr } from '../controllers/userController.js';
import cookieMiddleware from '../middle/cookie.js';

const userRouter = express.Router()
userRouter.use(cookieMiddleware.readCookies)
userRouter.use(cookieMiddleware.setCookie)
userRouter.post('/register', memberRegister);
userRouter.post('/login', memberLogin)
userRouter.get('/socials/kakao', kakaoLogin);
userRouter.get('/socials/google', googleLogin);
userRouter.post('/passwordEdit', passwordEdit)
userRouter.post('/testQr', testQr)
userRouter.post('/stampInfo', stampInfo)
export default userRouter;