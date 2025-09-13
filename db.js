import mongoose from "mongoose";


async function ConnectDB() {
    try {
        await mongoose.connect("mongodb+srv://rohitrajupatil12_db_user:rohit123@cluster10.r0ztyrl.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("db is connected")
    } catch (error) {
        console.log("some happen in connection to db" , error)

    }

}

export default ConnectDB