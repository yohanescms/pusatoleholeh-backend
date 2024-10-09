import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shop.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import passportConfig from './configs/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

passportConfig(passport);

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);
app.use('/product', productRoutes);
app.use('/profile', userRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB terkonek'))
.catch(err => console.error('MongoDB error gamau konek!', err));

app.listen(PORT, () => console.log(`Server is up at port ${PORT}`));
