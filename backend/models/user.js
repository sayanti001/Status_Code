const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  auth0ID: {
    type: String,
    required: true,
    unique: true,
  },
  organizations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can't be added to the same organization twice
UserSchema.index({ auth0ID: 1, 'organizations.organization': 1 }, { unique: true });
const User = mongoose.model('User', UserSchema);
module.exports = User;