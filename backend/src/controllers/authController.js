import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid creds' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid creds' });

    const token = jwt.sign(
      { id: user._id, role: user.role, base: user.base },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const register = async (req, res) => {
//   // 1. Validate inputs
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() })
//   }

//   const { username, email, password, role, base } = req.body
//   try {
//     // 2. Check duplicates
//     if (await User.findOne({ $or: [{ username }, { email }] })) {
//       return res.status(409).json({ message: 'Username or email already exists' })
//     }
//     // 3. Hash password
//     const passwordHash = await bcrypt.hash(password, 10)
//     // 4. Create user
//     await User.create({ username, email, passwordHash, role, base })
//     return res.status(201).json({ message: 'User registered successfully' })
//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({ message: 'Server error' })
//   }
// }

export const register= async (req, res) => {
  try {
    const { username, email, password, role, base } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Validate base for commanders
    if (role === 'COMMANDER' && !base) {
      return res.status(400).json({ message: 'Base is required for commanders' });
    }
    
    // Check if base exists
    if (role === 'COMMANDER') {
      const baseExists = await Base.findById(base);
      if (!baseExists) {
        return res.status(400).json({ message: 'Invalid base' });
      }
    }
    
    // Create user
    const newUser = new User({
      username,
      email,
      passwordHash,
      role,
      base: role === 'COMMANDER' ? base : undefined
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}