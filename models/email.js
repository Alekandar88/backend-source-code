const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    from_address: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'From address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    subject: {
        type: String,
        min: [4, 'Too short, min is 4 characters']
    },
    body: {
        type: String,
        min: [100, 'Too short, min is 4 characters']
    }
});


module.exports = mongoose.model('Email', emailSchema);
