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
    return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
