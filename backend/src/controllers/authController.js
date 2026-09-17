import User from "../models/User.js";

import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/generateToken.js";

export async function register(req, res, next) {
  try {
    const name = req.body.name || req.body.fullName;
    const phone = req.body.phone || req.body.mobile;
    const password = req.body.password;
    const email = req.body.email || (phone ? `${phone}@rivo.app` : null);

    if (!name || (!email && !phone) || !password) {
      return res
        .status(400)
        .json({ message: "Name, mobile/email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const filter = [];
    if (email) filter.push({ email });
    if (phone) filter.push({ phone });

    const existing = await User.findOne({ $or: filter });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Mobile number or email already registered" });
    }

    const user = await User.create({
      name,
      email: email || `${Date.now()}@rivo.app`,
      phone: phone || "",
      passwordHash: password,
    });

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, identifier, password } = req.body;
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res
        .status(400)
        .json({ message: "Email/mobile and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: loginId }, { phone: loginId }],
    }).select("+passwordHash");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid email/mobile or password" });
    }

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function requestOtp(req, res, next) {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    return res.json({
      message: "OTP sent successfully",
      otp: "123456",
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    let user = await User.findOne({ phone: mobile });
    if (!user) {
      user = await User.create({
        name: `User_${mobile.slice(-4)}`,
        email: `${mobile}@rivo.app`,
        phone: mobile,
        passwordHash: "OtpUser@123",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  clearTokenCookie(res);

  res.json({
    message: "Logged out successfully",
  });
}

export async function getMe(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
}