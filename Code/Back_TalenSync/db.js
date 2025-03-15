const mongoose = require("mongoose");

module.exports = () => { 
    const connectionParams = { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    }; 
    mongoose.connect(process.env.MONGODB_URI, connectionParams)
        .then(() => console.log("Connected to database successfully"))
        .catch((error) => {
            console.error("Database connection error:", error);
            process.exit(1);
        });
};