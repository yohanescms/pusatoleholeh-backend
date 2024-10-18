import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB terkonek');
    } catch (err) {
        console.error('MongoDB error gamau konek!', err);
        process.exit(1);
    }
};

export default connectMongoDB;