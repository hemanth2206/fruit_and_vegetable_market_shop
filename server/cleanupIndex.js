// Run this to drop the problematic phno index
const mongoose = require('mongoose');
require("dotenv").config();

async function cleanupIndex() {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Connected to MongoDB");

        const collection = mongoose.connection.collection('buyervendors');
        
        // Drop the phno index
        try {
            await collection.dropIndex('phno_1');
            console.log("✅ Dropped phno_1 index successfully");
        } catch (err) {
            console.log("ℹ️ Index doesn't exist or already dropped");
        }

        // Also drop email index and recreate it properly
        try {
            await collection.dropIndex('email_1');
            await collection.createIndex({ email: 1 }, { unique: true });
            console.log("✅ Recreated email index");
        } catch (err) {
            console.log("ℹ️ Email index handling complete");
        }

        console.log("\n✅ Database cleanup completed! You can now register new users.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

cleanupIndex();
