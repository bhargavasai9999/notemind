import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { signJwtToken } from '../utils/Jwt.js';

export const login = async (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: 'Email is not registered with us, please sign up' });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const userId = foundUser._id;
    const jwt = signJwtToken(userId);
    return res.status(200).json({
      message: 'User successfully authenticated',
      jwtToken: jwt,
      userDetails: {
        username: foundUser.name,
        email: foundUser.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const signup = async (req, res) => {
  let { name, email, password } = req.body;

  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: 'This email is already registered with us, Please Log In' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    return res.status(200).json({ message: 'Successfully registered, Please Log In' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
