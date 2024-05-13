import express from 'express';
import { googleLogin, kakaoLogin, memberLogin, memberRegister } from '../controllers/userController.js';

const userRouter = express.Router()
userRouter.post('/register', memberRegister);
userRouter.post('/login', memberLogin)
userRouter.get('/socials/kakao', kakaoLogin);
userRouter.get('/socials/google', googleLogin);
export default userRouter;