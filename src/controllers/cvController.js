import prisma from '../services/prismaService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/cvs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF and Word documents are allowed'));
        }
    }
});
class CVController {
    async uploadCV(req, res) {
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            // For now, just save the file path and mock parsed data
            // In a real app, you'd use a CV parsing service here
            const mockParsedData = {
                name: "John Doe",
                skills: ["JavaScript", "React", "Node.js"],
                experience: [
                    {
                        title: "Frontend Developer",
                        company: "Tech Corp",
                        duration: "2 years"
                    }
                ],
                education: [
                    {
                        degree: "BSc Computer Science",
                        university: "University of Technology",
                        year: 2020
                    }
                ]
            };
            const cv = await prisma.cV.create({
                data: {
                    userId: userId,
                    filePath: req.file.path,
                    parsed_Data: mockParsedData
                }
            });
            res.status(201).json({
                message: 'CV uploaded successfully',
                cv
            });
        }
        catch (error) {
            res.status(500).json({ error: 'CV upload failed' });
        }
    }
    async getUserCVs(req, res) {
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const cvs = await prisma.cV.findMany({
                where: { userId }
            });
            res.json(cvs);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve CVs' });
        }
    }
    async getCV(req, res) {
        const { id } = req.params;
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const cv = await prisma.cV.findUnique({
                where: { id: Number(id) }
            });
            if (!cv) {
                return res.status(404).json({ error: 'CV not found' });
            }
            // Only allow users to access their own CVs
            if (cv.userId !== userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
            res.json(cv);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve CV' });
        }
    }
    async deleteCV(req, res) {
        const { id } = req.params;
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const cv = await prisma.cV.findUnique({
                where: { id: Number(id) }
            });
            if (!cv) {
                return res.status(404).json({ error: 'CV not found' });
            }
            // Only allow users to delete their own CVs
            if (cv.userId !== userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
            // Remove the file
            if (fs.existsSync(cv.filePath)) {
                fs.unlinkSync(cv.filePath);
            }
            // Delete from database
            await prisma.cV.delete({
                where: { id: Number(id) }
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete CV' });
        }
    }
}
export default new CVController();
