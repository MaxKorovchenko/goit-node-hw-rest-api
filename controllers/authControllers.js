const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { HttpError } = require('../helpers/HttpError');
const { controllerWrapper } = require('../helpers/controllerWrapper');
const { User } = require('../models/user');
const { sendEmail } = require('../helpers/sendEmail');

const { SECRET_KEY, PROJECT_URL } = process.env;

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: 'Email verification',
    html: `<a href="${PROJECT_URL}/api/auth/verify/${verificationCode}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
});

const verifyEmail = controllerWrapper(async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw new HttpError(404, 'Email not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
  });

  res.json({
    message: 'Verification successful',
  });
});

const resendVerifyEmail = controllerWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, 'Email not found');
  }

  if (user.verify) {
    throw new HttpError(400, 'Email already verified');
  }

  const resendVerifyEmail = {
    to: email,
    subject: 'Email verification',
    html: `<a href="${PROJECT_URL}/api/auth/verify/${user.verificationCode}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(resendVerifyEmail);

  res.json({
    message: 'Verification email resend',
  });
});

const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw new HttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '22h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
});

const logout = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'Logout success',
  });
});

const getCurrentUser = controllerWrapper(async (req, res) => {
  const { name, email, subscription } = req.user;

  res.json({
    name,
    email,
    subscription,
  });
});

const updateSubscription = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

  res.status(200).json(user);
});

const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');

const updateAvatar = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file;

  const image = await Jimp.read(tempPath);
  image.resize(250, 250);
  await image.writeAsync(tempPath);

  const filename = `${_id}_${originalname}`;
  const newPath = path.join(avatarsDir, filename);
  await fs.rename(tempPath, newPath);

  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
});

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
