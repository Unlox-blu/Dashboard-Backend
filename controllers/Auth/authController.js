import { User } from "../../models/employee.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { gmailService } from "../../utils/services/gmail.js";
import generateOTP from "../../utils/generateOTP.js";

const JWT_SECRET = process.env.JWT_SECRET || "thiswouldbethesecret"; // access token secret
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "thisakjsdasdb@bjjDeJp8Pm@un&akdhlox.e6lwevfad2025.4860f12b2f2dd22a4ee15e47fbc"; // refresh token secret

function generatePassword() {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = "";

  // Ensure at least one of each character type
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );
  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length)
  );
  password += numberChars.charAt(
    Math.floor(Math.random() * numberChars.length)
  );
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Fill the remaining length with random characters from all sets
  for (let i = password.length; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to randomize the order of character types
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
}

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id },
    "thiswouldbethesecret",
    { expiresIn: "3d" } // short life
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    "thisakjsdasdb@bjjDeJp8Pm@un&akdhlox.e6lwevfad2025.4860f12b2f2dd22a4ee15e47fbc",
    { expiresIn: "30d" } // long life
  );

  return { accessToken, refreshToken };
}

async function saveRefreshHash(user, refreshToken) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(refreshToken, salt);

  user.refreshTokenHash = hash; // Make sure User model has this field
  await user.save();
}

async function verifyRefreshAgainstHash(user, refreshToken) {
  if (!user.refreshTokenHash) return false;
  return await bcrypt.compare(refreshToken, user.refreshTokenHash);
}

export const register = async (req, res) => {
  const { email, password, name, personal_phone_number, country_code, DOB } =
    req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await new User({
      email,
      password: hashed,
      name,
      personal_phone_number,
      country_code,
      DOB,
      waiting: true,
    }).save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      token,
      accessToken,
      refreshToken,
      user: {
        email: user.email,
        name: user.name,
        personal_phone_number: user.personal_phone_number,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password: '***' });
  
  try {
    const user = await User.findOne({ org_email: email });
    console.log('User found:', user ? { id: user._id, email: user.org_email, hasPassword: !!user.password } : 'No user found');

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: "Email does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (!match) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, "thiswouldbethesecret", {
      expiresIn: "1d",
    });

    const { accessToken, refreshToken } = generateTokens(user);
    console.log({ accessToken, refreshToken });
    await saveRefreshHash(user, refreshToken);
    res.json({
      token,
      accessToken,
      refreshToken,
      user: {
        org_email: user.org_email,
        name: user.name,
        org_phone_number: user.org_phone_number,
        waiting: user.waiting,
        _id: user._id,
      },
    });
  } catch (err) {
    console.log({ error: err });

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshTokenHash -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET); // throws if bad/expired
    const user = await User.findById(decoded.id);
    console.log({ user });

    if (!user)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Check provided RT against stored hash
    const ok = await verifyRefreshAgainstHash(user, refreshToken);
    console.log({ ok });

    if (!ok) return res.status(403).json({ message: "Invalid refresh token" });

    // Rotate tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await saveRefreshHash(user, newRefreshToken);

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req, res) => {
  // You can make this public (accept RT in body) or protected (use user.id from access).
  // Here we accept body RT and clear hash if it matches.
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.json({ ok: true });

    const decoded = jwt.verify(
      refreshToken,
      "thisakjsdasdb@bjjDeJp8Pm@un&akdhlox.e6lwevfad2025.4860f12b2f2dd22a4ee15e47fbc"
    );
    const user = await User.findById(decoded.id);
    if (user) {
      const ok = await verifyRefreshAgainstHash(user, refreshToken);
      if (ok) {
        user.refreshTokenHash = undefined; // revoke current session
        await user.save();
      }
    }
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: true }); // don’t leak details
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ org_email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // const { token, hash } = generateResetToken();
    // user.resetPasswordToken = hash;
    // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

    await user.save();

    // const resetLink = `http://localhost:3000/reset-password/${token}`; // For frontend

    // Use mock email service for development (replace with gmailService when Gmail is properly configured)
    // await mockEmailService(
    //   user.org_email,
    //   "Your OTP for password reset",
    //   `Your OTP is: ${otp}`
    // );
    
    // Uncomment below and comment above when Gmail App Password is configured:
    await gmailService(
      user.org_email,
      "Your OTP for password reset",
      `Your OTP is: ${otp}`
    );

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message, error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  // const token = req.params.token;
  // const { password } = req.body;

  // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const { email, otp, newPassword } = req.body;

  console.log(email, otp, newPassword);

  try {
    const user = await User.findOne({
      org_email: email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { OTP } = req.body;

  try {
    const user = await User.findOne({
      resetOTP: OTP,
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    return res.status(200).json({ message: "OTP verified", status: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne(req.user.UUID).select([
      "-password",
      "-_id",
      "-__v",
    ]);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};



export default {
  register,
  login,
  me,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
  getProfile,
};
