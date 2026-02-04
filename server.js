// server.js — full updated version
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");
const { OAuth2Client } = require("google-auth-library");

const app = express();

/* -------------------------
   Config
------------------------- */
const rawMongo = process.env.MONGO_URI;
const MONGO_URI = rawMongo ? rawMongo.replace(/(^"|"$)/g, "") : undefined;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const PORT = process.env.PORT || 4000;

if (!MONGO_URI) {
  console.error("Set MONGO_URI in .env");
  process.exit(1);
}

/* -------------------------
   Middleware
------------------------- */
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("tiny"));
app.use(express.json({ limit: "10kb" }));

/* -------------------------
   Mongo Schemas
------------------------- */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },

  // local auth
  passwordHash: { type: String },

  // google auth
  googleId: { type: String, index: true },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  // profile
  name: { type: String },
  address: { type: String },

  role: {
    type: String,
    enum: ["user", "bunk", "agent"],
    default: "user"
  },

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fuelType: { type: String, enum: ["petrol", "diesel"], required: true },
    quantity: { type: Number, required: true },
    pricePerLitre: Number,
    totalPrice: Number,
    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    status: {
      type: String,
      enum: ["placed", "confirmed", "delivered"],
      default: "placed"
    }
  },
  { timestamps: true }
);

const UserOrder = mongoose.model("UserOrder", OrderSchema);

/* -------------------------
   Auth helpers
------------------------- */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

/* -------------------------
   Google OAuth setup
------------------------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* -------------------------
   Health
------------------------- */
app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

/* -------------------------
   Google Login
------------------------- */
app.post("/api/auth/google", async (req, res) => {
  try {
    const { token, role } = req.body;
    if (!token) return res.status(400).json({ error: "missing token" });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub, email } = ticket.getPayload();
    if (!email) return res.status(400).json({ error: "email not provided" });

    let user = await User.findOne({ username: email });

    if (!user) {
      user = await User.create({
        username: email,
        googleId: sub,
        authProvider: "google",
        role: ["user", "bunk", "agent"].includes(role) ? role : "user"
      });
    }

    const jwtToken = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token: jwtToken, username: user.username, role: user.role });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "google authentication failed" });
  }
});

/* -------------------------
   Register (local)
------------------------- */
app.post("/api/register", async (req, res) => {
  try {
    let { username, password, role } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    if (!["user", "bunk", "agent"].includes(role)) role = "user";

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash, role });

    res.status(201).json({ message: "user created" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "username already exists" });

    console.error("Register error:", err);
    res.status(500).json({ error: "server error" });
  }
});

/* -------------------------
   Login (local only)
------------------------- */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    if (user.authProvider === "google") {
      return res.status(400).json({
        error: "Use Google login for this account"
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "server error" });
  }
});

/* -------------------------
   Profile (GET + UPDATE)
------------------------- */
app.get("/api/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.sub).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user });
});

app.put("/api/profile", auth, async (req, res) => {
  const { name, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.sub,
    { name, address },
    { new: true }
  ).select("-passwordHash");

  res.json({ user });
});

/* -------------------------
   Orders
------------------------- */
app.post("/api/user/order", auth, async (req, res) => {
  const { fuel, quantity, location } = req.body;
  if (!fuel || !quantity || !location)
    return res.status(400).json({ error: "invalid order" });

  const pricePerLitre = fuel === "petrol" ? 105 : 95;
  const order = await UserOrder.create({
    userId: req.user.sub,
    fuelType: fuel,
    quantity,
    pricePerLitre,
    totalPrice: pricePerLitre * quantity,
    location
  });

  res.status(201).json({ order });
});

app.get("/api/user/orders", auth, async (req, res) => {
  const orders = await UserOrder.find({ userId: req.user.sub }).sort({
    createdAt: -1
  });
  res.json(orders);
});

/* -------------------------
   DB Connect + Start
------------------------- */
async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () =>
    console.log(`Backend running on port ${PORT}`)
  );
}

start();
