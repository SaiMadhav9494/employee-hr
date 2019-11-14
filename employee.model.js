const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    role: {
        type: String,
        unique: false,
        required: false,
        trim: true
    },
    grossPay: {
        type: Number,
        unique: false,
        required: false,
    },
    deductions: {
        type: Array,
        unique: false,
        required: false,
        trim: true
    },
    takeHomePay: {
        type: Number,
        unique: false,
        required: false,
    },
});

module.exports = {
    Employee: mongoose.model('Employee', EmployeeSchema)
}