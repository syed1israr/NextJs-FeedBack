import mongoose from "mongoose";

type connectionObject={
    isConnected?: number
}
const connection:connectionObject = {}

async function DBConnect(): Promise<void>{
        if(connection.isConnected){
            console.log("Already Connected to Database")
            return;
        }
        //clg db
        try {
          const db =  await mongoose.connect(process.env.MONGODB || '')
           connection.isConnected = db.connections[0].readyState
           console.log("DB Connected Succesfully!")
        } catch (error) {
            console.log("DataBase Connection Failed",error)
            process.exit(1);
        }
}


export default DBConnect;

