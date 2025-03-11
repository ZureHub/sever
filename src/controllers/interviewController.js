import prisma from '../services/prismaService';
class InterviewController {
    async createInterview(req, res) {
        const userId = req.user?.userId; // From auth middleware
        const { questions, responses } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const interview = await prisma.interview.create({
                data: {
                    userId,
                    questions,
                    responses
                }
            });
            res.status(201).json(interview);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create interview' });
        }
    }
    async getUserInterviews(req, res) {
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const interviews = await prisma.interview.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            res.json(interviews);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve interviews' });
        }
    }
    async getInterview(req, res) {
        const { id } = req.params;
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const interview = await prisma.interview.findUnique({
                where: { id: Number(id) }
            });
            if (!interview) {
                return res.status(404).json({ error: 'Interview not found' });
            }
            // Only allow users to access their own interviews
            if (interview.userId !== userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
            res.json(interview);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve interview' });
        }
    }
    async deleteInterview(req, res) {
        const { id } = req.params;
        const userId = req.user?.userId; // From auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        try {
            const interview = await prisma.interview.findUnique({
                where: { id: Number(id) }
            });
            if (!interview) {
                return res.status(404).json({ error: 'Interview not found' });
            }
            // Only allow users to delete their own interviews
            if (interview.userId !== userId) {
                return res.status(403).json({ error: 'Access denied' });
            }
            await prisma.interview.delete({
                where: { id: Number(id) }
            });
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete interview' });
        }
    }
}
export default new InterviewController();
