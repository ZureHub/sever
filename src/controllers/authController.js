import prisma from '../services/prismaService.js';
import { hashPassword, generateToken, comparePassword } from '../utils/index.js';
class AuthController {
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        try {
            console.log('registering user');
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            console.log('creating user');
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
            console.log('user created');
            const token = generateToken(user.id, user.email);
            res.status(201).json({
                message: 'User created successfully',
                user,
                token
            });
            console.log('user created successfully');
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
            res.status(201).json({
                message: 'User logged in successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                token
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error while logging in' });
        }
    }
    // Add this method to your AuthController class
    async getMe(req, res) {
        try {
            // req.user should be set by authMiddleware
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                message: 'User retrieved successfully',
                user
            });
        }
        catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).json({ message: 'Error retrieving user information' });
        }
    }
}
export default new AuthController();
