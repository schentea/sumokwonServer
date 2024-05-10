import express from 'express';
import { memberLogin, memberRegister } from '../controllers/userController.js';

const userRouter = express.Router()
userRouter.post('/register', memberRegister);
userRouter.post('/login', memberLogin)
export default userRouter;