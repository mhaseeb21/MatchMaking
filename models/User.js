// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // later you will extend with profile fields (age, city, education, religion, photos, preferences...)
  // new fields
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  city: { type: String },
  education: { type: String },

  image: { type: String },

  role: { type: String, default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
