import express from 'express';
import { googleLogin, kakaoLogin, memberLogin, memberRegister, passwordEdit, stampInfo, testQr } from '../controllers/userController.js';
import cookieMiddleware from '../middle/cookie.js';

const userRouter = express.Router()
userRouter.use(cookieMiddleware.readCookies)

userRouter.post('/register',cookieMiddleware.setCookie, memberRegister);
userRouter.post('/login',cookieMiddleware.setCookie, memberLogin)
userRouter.get('/socials/kakao',cookieMiddleware.setCookie, kakaoLogin);
userRouter.get('/socials/google',cookieMiddleware.setCookie, googleLogin);
userRouter.post('/passwordEdit',cookieMiddleware.setCookie, passwordEdit)
userRouter.post('/testQr',cookieMiddleware.setCookie, testQr)
userRouter.post('/stampInfo',cookieMiddleware.setCookie, stampInfo)
export default userRouter;