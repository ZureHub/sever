import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
// import interviewRoutes from './routes/interviewRoutes';
import cvAnalysisRoutes from './routes/cvAnalysisRoutes.js'; // Import the new route
// In your app.ts
import healthRoutes from './routes/healthRoutes.js';


dotenv.config();

const app = express();

//middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' })); // Increased limit for larger CV texts

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api', healthRoutes);
// app.use('/api/interviews', interviewRoutes);
app.use('/api/analysis', cvAnalysisRoutes); // Add the new route

//error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong',
        message: err.message
    });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

export default app;