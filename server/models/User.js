const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema with name, email, and password
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },            // ✅ New: name field added
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare hashed password with login attempt
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
