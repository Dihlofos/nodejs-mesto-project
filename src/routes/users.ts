import { Router } from 'express';

import {
  getUsers, getUser, updateUser, updateUserAvatar,
} from '../controllers/users';
import { userIdValidate, userUpdateAvatarValidate, userUpdateValidate } from '../middlewares/validations';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', userIdValidate, getUser);
router.patch('/me', userUpdateValidate, updateUser);
router.patch('/me/avatar', userUpdateAvatarValidate, updateUserAvatar);

export default router;
