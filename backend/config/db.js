const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/transport';
        
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', mongoURI);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(" MongoDB is Connected successfully");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log(' Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(' Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log(' Mongoose disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log(' MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB