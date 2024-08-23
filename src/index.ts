import express, { Request, Response } from 'express';
import { upload } from './Storage';
import path from 'path';
import md5 from 'md5';
import { User } from './types';
import { v4 as uuidv4 } from 'uuid';
import { lesionRecommendations } from './DataSet/lesions';

const app = express();
const port = 3000;

app.use(express.json());

export const users: User[] = [];

app.post('/api/register', (req: Request, res: Response) => {
    console.log(req);
    const { name, email, password } = req.body;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Validating inputs
    if (!emailPattern.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!namePattern.test(name)) return res.status(400).json({ error: 'Name should contain only letters and spaces' });
    if (!passwordPattern.test(password))
        return res.status(400).json({
            error: 'Password should be at least 8 characters long, and include an uppercase letter, a number, and a special character',
        });

    // Check if user is already registered
    if (users.find(user => user.email === email)) return res.status(400).json({ error: 'Email is already registered' });

    const encryptedPassword = md5(password);
    const sessionId = uuidv4();

    const newUser: User = {
        name,
        email,
        password: encryptedPassword,
        sessionId,
        history: [],
    };

    users.push(newUser);

    return res.status(200).json({ message: 'User registered successfully', user: { sessionId } });
});

app.post('/api/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = users.find(user => user.email === email && user.password === md5(password));

    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    user.sessionId = uuidv4();
    return res.status(200).json({ message: 'Login successful', sessionId: user.sessionId });
});

app.post('/api/upload', (req: Request, res: Response) => {
    upload(req, res, (err: any) => {
        const { sessionId } = req.body;

        if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });

        const user = users.find(user => user.sessionId === sessionId);

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired session ID' });
        }

        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No file selected' });

        const filePath = req.file.path;
        const extname = path.extname(filePath).toLowerCase();

        // Randomly select a lesion and its recommendations
        const lesionKeys = Object.keys(lesionRecommendations);
        const randomLesion = lesionKeys[Math.floor(Math.random() * lesionKeys.length)];
        const selectedRecommendations = lesionRecommendations[randomLesion];

        // Update user's history
        user.history.push({
            image: filePath,
            name: user.name,
            recomandations: selectedRecommendations,
        });

        try {
            return res.json({
                message: 'File uploaded successfully',
                file: `uploads/${req.file.filename}`,
            });
        } catch (conversionError) {
            return res.status(500).json({ error: 'Error processing file' });
        }
    });
});

app.post('/api/logout', (req: Request, res: Response) => {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'Session ID is required' });

    const user = users.find(user => user.sessionId === sessionId);

    if (!user) {
        return res.status(400).json({ error: 'Invalid session ID' });
    }

    user.sessionId = '';

    return res.status(200).json({ message: 'Logout successful' });
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
