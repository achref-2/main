const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// CV Analysis Schema
const cvAnalysisSchema = new mongoose.Schema({
    similarity_score: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    skills: [{
        type: String,
        trim: true
    }],
    suggestions: [{
        type: String,
        trim: true
    }],
    analyzedAt: {
        type: Date,
        default: Date.now
    }
});

const cvHistorySchema = new mongoose.Schema({
    fileData: {
        type: Buffer,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        required: true,
        enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    analysis: cvAnalysisSchema // Add analysis to each CV entry
});

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 8
    },
    cvUploadDate: { 
        type: Date,
        default: null
    },
    cvHistory: [cvHistorySchema],
    latestAnalysis: {
        type: cvAnalysisSchema,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    googleId: { type: String, unique: true },
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'cvHistory.uploadDate': -1 });
userSchema.index({ 'cvHistory.analysis.analyzedAt': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Method to generate auth token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            fullName: `${this.firstName} ${this.lastName}`
        }, 
        process.env.JWTPRIVATEKEY, 
        {
            expiresIn: "7d",
        }
    );
    return token;
};

// Method to add CV to history
userSchema.methods.addCVToHistory = function(file) {
    if (this.cvHistory.length >= 10) {
        this.cvHistory.shift(); // Remove the oldest entry
    }

    const newCV = {
        fileData: file.buffer,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype
    };

    this.cvHistory.push(newCV);
    this.cvUploadDate = new Date();
    
    return this.save();
};

// Method to add analysis to CV
userSchema.methods.addAnalysis = async function(cvIndex, analysisData) {
    if (cvIndex >= this.cvHistory.length) {
        throw new Error('CV index out of bounds');
    }

    const analysis = {
        similarity_score: analysisData.similarity_score,
        skills: analysisData.skills || [],
        suggestions: analysisData.suggestions || [],
        analyzedAt: new Date()
    };

    this.cvHistory[cvIndex].analysis = analysis;
    this.latestAnalysis = analysis;

    return this.save();
};

// Get latest CV with analysis
userSchema.methods.getLatestCVWithAnalysis = function() {
    if (this.cvHistory.length === 0) {
        return null;
    }
    return this.cvHistory[this.cvHistory.length - 1];
};


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: "1h" });
    return token;
};


// Validation function
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .label("First Name"),
        lastName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .label("Last Name"),
        email: Joi.string()
            .email()
            .required()
            .label("Email"),
        password: passwordComplexity()
            .required()
            .label("Password"),
    });
    return schema.validate(data);
};

// CV upload validation
const validateCV = (file) => {
    const schema = Joi.object({
        fileName: Joi.string().required(),
        fileSize: Joi.number().max(5 * 1024 * 1024).required(), // 5MB max
        fileType: Joi.string().valid(
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ).required()
    });
    return schema.validate(file);
};

// CV analysis validation
const validateAnalysis = (analysis) => {
    const schema = Joi.object({
        similarity_score: Joi.number()
            .min(0)
            .max(1)
            .required(),
        skills: Joi.array()
            .items(Joi.string())
            .default([]),
        suggestions: Joi.array()
            .items(Joi.string())
            .default([])
    });
    return schema.validate(analysis);
};

const User = mongoose.model("user", userSchema);
const analysisSchema = new mongoose.Schema({
    filePath: String,
    jobDescription: String,
    analysisResult: Object,
    createdAt: { type: Date, default: Date.now },
  });
const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = { 
    User, 
    validate,
    validateCV,
    validateAnalysis,
    Analysis 
};