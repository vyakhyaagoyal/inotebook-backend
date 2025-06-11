import { connect } from 'mongoose';
const mongoURI="mongodb://localhost:27017/inotebook";

const connectToMongo=()=>{
    connect(mongoURI);
    console.log("connected");
}

export default connectToMongo;