const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,  // remove leading/trailing spaces
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,  // store emails in lowercase
        match: [/.+@.+\..+/, 'Invalid email format'] // basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 8  // enforce stronger passwords
    },
    profileImageUrl: {
        type: String,
        default: null,
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    }, 
}, { timestamps: true });

// Hash password before saving to database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password with hashed password in database
UserSchema.methods.matchPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
