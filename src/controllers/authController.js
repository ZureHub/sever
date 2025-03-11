import prisma from '../services/prismaService';
import { hashPassword, generateToken, comparePassword } from '../utils';
class AuthController {
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const user = await prisma.user.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password_hash: await hashPassword(req.body.password)
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            const token = generateToken(user.id, user.email);
            res.status(201).json({
                message: 'User created successfully',
                user,
                token
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error while creating user' });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                return res.status(400).json({ message: 'User does not exist' });
            }
            const passwordMatch = await comparePassword(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = generateToken(user.id, user.email);
            res.json({
                message: 'User logged in successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error while logging in' });
        }
    }
}
export default new AuthController();
