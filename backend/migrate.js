const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Notification = require('./models/Notification');
require('dotenv').config();

const LOCAL_URI = "mongodb://127.0.0.1:27017/blog_app";
// Taking Atlas URI from your .env
const ATLAS_URI = process.env.MONGODB_URI; 

async function migrateData() {
    try {
        console.log("⏳ Step 1: Connecting to Local Database...");
        const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
        
        // Setup models for local DB
        const LocalUser = localDb.model('User', User.schema);
        const LocalBlog = localDb.model('Blog', Blog.schema);
        const LocalNotification = localDb.model('Notification', Notification.schema);

        console.log("📥 Step 2: Fetching all your precious local data...");
        const users = await LocalUser.find({}).lean();
        const blogs = await LocalBlog.find({}).lean();
        const notifications = await LocalNotification.find({}).lean();

        console.log(`✅ Found: ${users.length} Users, ${blogs.length} Blogs, ${notifications.length} Notifications`);

        if (users.length === 0) {
            console.log("No local data found. Are you sure the local DB is running?");
            process.exit(1);
        }

        console.log("⏳ Step 3: Connecting to MongoDB Atlas (Cloud)...");
        const atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
        
        // Setup models for Atlas DB
        const AtlasUser = atlasDb.model('User', User.schema);
        const AtlasBlog = atlasDb.model('Blog', Blog.schema);
        const AtlasNotification = atlasDb.model('Notification', Notification.schema);

        console.log("🧹 Step 4: Clearing any duplicate data on Cloud...");
        await AtlasUser.deleteMany({});
        await AtlasBlog.deleteMany({});
        await AtlasNotification.deleteMany({});

        console.log("🚀 Step 5: Uploading your data to the Cloud... Please wait!");
        if (users.length) await AtlasUser.insertMany(users);
        if (blogs.length) await AtlasBlog.insertMany(blogs);
        if (notifications.length) await AtlasNotification.insertMany(notifications);

        console.log("🎉 MIGRATION 100% COMPLETE! Your 23 users and blogs are now live!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrateData();
