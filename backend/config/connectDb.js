import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URI;
import dns from 'dns'
 dns.setServers(["1.1.1.1", "8.8.8.8"]);

let isConnected = false;
export async function connectDb(){
    if(isConnected) return;
    try {

        const conn = await mongoose.connect(MONGO_URL,{
            maxPoolSize:10,
            connectTimeoutMS:5000,
            socketTimeoutMS:45000
        });
        isConnected = true;
        console.log("Connected to mongodb successfully!")

    } catch (error) {
        console.log("Some error occured while connecting to mongoDb",error.message);
        process.exit(1);
    }
}
