import { Router } from 'express';

import {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
router.post('/', createUser);

export default router;
