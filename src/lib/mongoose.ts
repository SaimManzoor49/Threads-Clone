import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async()=>{

    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log("MongoDB URL not Found")
    if(isConnected) return console.log("Already connected to MONGODB")
try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected= true
    console.log("Connected to MongoDB")
} catch (error) {
 console.log(error)    
}

}