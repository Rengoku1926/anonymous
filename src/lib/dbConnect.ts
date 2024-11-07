//3. nextjs is edge based framework ie each time db connection is done whenever a new request is done whereas in other framework db needs to be connected once
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number // ?:optional
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database ")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully ")
    } catch (error) {
        console.log("DB not connected, error : ", error)
        process.exit(1) //application further doesnot works
    }
}

export default dbConnect