import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6
    },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true
    },

    refreshToken: {
      type: String
    },

    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(){
if(!this.isModified("password"))
    return;
const saltrounds = 10
this.password = await bcrypt.hash(this.password, saltrounds)
});

userSchema.methods.comparePassword = async function(password){
  return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY)/1000} // it expects seconds
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY)/1000} // it expects seconds
  );
};

// Static method to generate a strong password
userSchema.statics.generateStrongPassword = function(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const User = mongoose.model("User", userSchema);
