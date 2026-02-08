// Run this in your server to fix the duplicate phno null issue
const mongoose = require('mongoose');
require("dotenv").config();

async function fixPhnoIndex() {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Connected to MongoDB");

        // Drop the existing phno index
        const collection = mongoose.connection.collection('buyervendors');
        
        // List all indexes
        const indexes = await collection.listIndexes().toArray();
        console.log("Current indexes:", indexes);

        // Drop the phno unique index if it exists
        try {
            await collection.dropIndex('phno_1');
            console.log("Dropped phno_1 index");
        } catch (err) {
            console.log("phno_1 index doesn't exist or error dropping it:", err.message);
        }

        // Recreate the index with sparse option
        await collection.createIndex({ phno: 1 }, { sparse: true, unique: true });
        console.log("Created new phno index with sparse:true");

        console.log("✅ Index fix completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing index:", error);
        process.exit(1);
    }
}

fixPhnoIndex();
