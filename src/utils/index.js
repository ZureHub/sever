import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};
export const generateToken = (userId, email) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId, email }, jwtSecret, { expiresIn: '24h' });
};
