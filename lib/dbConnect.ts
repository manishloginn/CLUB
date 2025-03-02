import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


type ConnectionObject = {
    isConnect?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    
    if(connection.isConnect){
        console.log("✅ Using existing database connection.");
        return
    }

    try {
        
        const db = await mongoose.connect(process.env.MONGODB_URI as string || "" , {})

        connection.isConnect = db.connections[0].readyState
        console.log("🔄 Attempting to connect to MongoDB...");

    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
        
    }

}

export default dbConnect;