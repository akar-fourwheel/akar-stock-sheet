import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accessToken: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  accessTokenExpires: {
    type: Date,
    required: true
  },
  refreshTokenExpires: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
tokenSchema.index({ userId: 1 });
tokenSchema.index({ accessToken: 1 });
tokenSchema.index({ refreshToken: 1 });

const Token = mongoose.model('Token', tokenSchema);

export default Token; 