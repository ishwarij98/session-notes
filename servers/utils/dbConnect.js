import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnect() {
    try {
        let dbURL = process.env.DB_URL;
        await mongoose.connect(dbURL);
        console.log(" ★ Database Connected Successfully!")
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect;