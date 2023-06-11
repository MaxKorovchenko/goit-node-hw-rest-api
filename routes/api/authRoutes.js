const express = require('express');

const { validateBody } = require('../../middlewares/validateBody');
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  emailSchema,
} = require('../../schemas/authSchema');
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require('../../controllers/authControllers');
const { authenticate } = require('../../middlewares/authenticate');
const { upload } = require('../../middlewares/upload');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

router.get('/verify/:verificationCode', verifyEmail);

router.post('/verify', validateBody(emailSchema), resendVerifyEmail);

router.post('/login', validateBody(loginSchema), login);

router.post('/logout', authenticate, logout);

router.get('/current', authenticate, getCurrentUser);

router.patch(
  '/',
  authenticate,
  validateBody(updateSubscriptionSchema),
  updateSubscription
);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = {
  authRouter: router,
};
