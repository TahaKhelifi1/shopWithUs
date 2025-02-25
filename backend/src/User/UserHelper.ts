import User from './models/User.models';
import pkg, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const { sign } = pkg;

// Store verification codes in memory
const verificationCodes = new Map<string, { code: string; timestamp: number }>();

// Store reset codes in memory (use Redis in production)
const resetCodes = new Map<string, { code: string; timestamp: number }>();

// Create transporter outside resolver
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s+/g, ''), // Remove any whitespace from app password
  },
  tls: {
    rejectUnauthorized: false, // Optional, set to true in production
  },
});

// getUser function
export const getUser = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// getUsers function
export const getUsers = async () => {
  try {
    return await User.findAll();
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};



// createUser function
export const createUser = async (input: any) => {
  try {
    // Ensure email is in lowercase
    const email = input.email.toLowerCase();

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create the user
    const user = await User.create({
      ...input,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET || '8f9a4b2e7d1c6m3n5p0q8r7t2u4v9w1x6y3z5h8k7l2m4n9p0q3r6s8t1u5v7w2x4y9z',
      { expiresIn: '24h' }
    );

    // Convert to JSON and remove password before returning
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    return { ...userWithoutPassword, token };
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error(
        `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
      );
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
};


// updateUser function
export const updateUser = async (id: string, input: any) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(input);
    return user;
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      throw new Error(`Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`);
    }
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// deleteUser function
export const deleteUser = async (id: string) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return { message: 'User successfully deleted', user };
  } catch (error: any) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

// signIn function
export const signIn = async (email: string, password: string) => {
  try {
    
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      throw new Error('User not found');
      
    }
    
    if (!user.password) {
      
      throw new Error('User has no password set');
    }

     const isValidPassword = await bcrypt.compare(password, user.password); // compare the password with the hashed password
    // const isValidPassword = password===user.password // compare the password  (not hashed) with   password
    
    if (!isValidPassword) {
      throw new Error('Password is incorrect');
    }

    // Generate JWT tokenw
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        is_admin: user.is_admin 
      },
      process.env.JWT_SECRET || '8f9a4b2e7d1c6m3n5p0q8r7t2u4v9w1x6y3z5h8k7l2m4n9p0q3r6s8t1u5v7w2x4y9z',
      { expiresIn: '24h' }
    );
     return {
      token,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        is_admin: user.is_admin
      }
    };

  } catch (error) {
    console.error('Sign in error:', error);
    // For security, use a generic error message in production
    throw new Error('Invalid email or password');
  }
};

// forgotPassword function
export const forgotPassword = async (email: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('No user found with this email');
    }

    const resetCode = randomBytes(3).toString('hex').toUpperCase();

    resetCodes.set(email, {
      code: resetCode,
      timestamp: Date.now(),
    });

    console.log(`Reset code for ${email}: ${resetCode}`);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: `<p>Your password reset code is: <strong>${resetCode}</strong>. It will expire in 5 minutes.</p>`,
    });

    return {
      success: true,
      message: 'Reset code sent to your email (check server logs)',
    };
  } catch (error: any) {
    console.error('Reset code error:', error);
    throw new Error(error.message);
  }
};

// resetPassword function
export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const storedData = resetCodes.get(email);
    if (!storedData || storedData.code !== code.toUpperCase()) {
      throw new Error('Invalid or expired reset code');
    }

    if (Date.now() - storedData.timestamp > 300000) {
      resetCodes.delete(email);
      throw new Error('Reset code expired');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    resetCodes.delete(email);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// adminResetPassword function
export const adminResetPassword = async (userId: string, newPassword: string) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// verifyAdminCode function
export const verifyAdminCode = async (email: string, code: string) => {
  try {
    const storedData = verificationCodes.get(email);
    if (!storedData || storedData.code !== code.toUpperCase()) {
      throw new Error('Invalid or expired verification code');
    }

    if (Date.now() - storedData.timestamp > 300000) {
      verificationCodes.delete(email);
      throw new Error('Verification code expired');
    }

    return {
      success: true,
      message: 'Verification successful',
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
