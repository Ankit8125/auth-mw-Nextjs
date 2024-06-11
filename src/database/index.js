import mongoose from "mongoose"

const connectToDB = async () => {
    const connectionUrl = "mongodb+srv://syncing284:4JmIGbGscEGm7aEk@cluster0.ttqizfh.mongodb.net/"
    
    mongoose
    .connect(connectionUrl)
    .then(() => console.log('Auth Database connected successfully'))
    .catch((e) => console.log(e))
}

export default connectToDB