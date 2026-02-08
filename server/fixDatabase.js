// Comprehensive database fix script
const mongoose = require('mongoose');
require("dotenv").config();

async function fixDatabase() {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection('buyervendors');
        
        // Step 1: Get current indexes
        console.log("\n📋 Current indexes:");
        const indexes = await collection.listIndexes().toArray();
        indexes.forEach(idx => console.log(`  - ${JSON.stringify(idx)}`));

        // Step 2: Drop all indexes except _id
        console.log("\n🔧 Dropping problematic indexes...");
        try {
            const indexNames = indexes
                .map(idx => idx.name)
                .filter(name => name !== '_id_');
            
            for (const indexName of indexNames) {
                try {
                    await collection.dropIndex(indexName);
                    console.log(`  ✅ Dropped: ${indexName}`);
                } catch (err) {
                    console.log(`  ℹ️ Skipped: ${indexName}`);
                }
            }
        } catch (err) {
            console.log("  Error dropping indexes:", err.message);
        }

        // Step 3: Check for duplicate emails
        console.log("\n🔍 Checking for duplicate emails...");
        const duplicates = await collection.aggregate([
            { $group: { _id: "$email", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]).toArray();

        if (duplicates.length > 0) {
            console.log("  ⚠️ Found duplicate emails:", duplicates);
            console.log("  Removing duplicates...");
            for (const dup of duplicates) {
                const email = dup._id;
                const docs = await collection.find({ email }).toArray();
                // Keep the first one, delete the rest
                for (let i = 1; i < docs.length; i++) {
                    await collection.deleteOne({ _id: docs[i]._id });
                    console.log(`    ✅ Deleted duplicate: ${email}`);
                }
            }
        } else {
            console.log("  ✅ No duplicate emails found");
        }

        // Step 4: Recreate proper indexes
        console.log("\n📝 Creating proper indexes...");
        await collection.createIndex({ email: 1 }, { unique: true });
        console.log("  ✅ Created email unique index");

        // Step 5: Verify
        console.log("\n📋 Final indexes:");
        const finalIndexes = await collection.listIndexes().toArray();
        finalIndexes.forEach(idx => console.log(`  - ${idx.name}`));

        console.log("\n✅ Database fix completed successfully!");
        console.log("You can now register new users.\n");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error(error);
        process.exit(1);
    }
}

fixDatabase();
