import express, { Request, Response } from 'express';
import md5 from 'md5';
import { User } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getRandomLesion } from './DataSet/lesions';
import fs from 'fs';
import multer from 'multer';

const ip = '192.168.44.8';
const app = express();
const port = 3000;
const upload = multer({
    limits: {
        fieldSize: 25 * 1024 * 1024, // 25 MB, adjust as needed
    },
    storage: multer.memoryStorage(),
});

app.use(express.json());

export const users: User[] = [
    {
        name: 'Andrei',
        email: 'Andrei@yahoo.com',
        password: md5('andrei'),
        sessionId: '4b878bb1-20c8-4be5-8582-451c767aaf6a',
        history: [
            // {
            //     image: './uploads/1724847751243.jpg',
            //     name: 'lesion4',
            //     recommendations: ['recommendation4_1', 'recommendation4_2', 'recommendation4_3']
            // }
        ],
    },
];

app.post('/api/register', (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Validating inputs
    if (!emailPattern.test(email)) return res.status(200).json({ error: 'Invalid email format' });
    if (!namePattern.test(name)) return res.status(200).json({ error: 'Name should contain only letters and spaces' });
    // if (!passwordPattern.test(password))
    //     return res.status(200).json({
    //         error: 'Password should be at least 8 characters long, and include an uppercase letter, a number, and a special character',
    //     });

    // Check if user is already registered
    if (users.find(user => user.email === email)) return res.status(200).json({ error: 'Email is already registered' });

    const encryptedPassword = md5(password);
    const sessionId = uuidv4();

    const newUser: User = {
        name,
        email,
        password: encryptedPassword,
        sessionId,
        history: [],
    };

    console.log(newUser);
    users.push(newUser);

    return res.status(200).json({ message: 'User registered successfully', user: { sessionId } });
});

app.post('/api/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(200).json({ error: 'Email and password are required' });
    const user = users.find(user => user.email === email && user.password === md5(password));

    if (!user) {
        return res.status(200).json({ error: 'Invalid email or password' });
    }

    user.sessionId = uuidv4();
    return res.status(200).json({ message: 'Login successful', user: { sessionId: user.sessionId } });
});

app.post('/api/history', (req: Request, res: Response) => {
    const { sessionId, file } = req.body;

    // Check if the session ID is provided
    if (!sessionId) {
        return res.status(200).json({ error: 'Session ID is required' });
    }

    // Validate the session ID
    const user = users.find(user => user.sessionId === sessionId);

    if (!user) {
        return res.status(200).json({ error: 'Invalid or expired session ID' });
    }

    return res.json({
        history: user.history,
    });
});

app.post('/api/upload', upload.none(), (req: Request, res: Response) => {
    const { sessionId, file } = req.body;

    // Check if the session ID is provided
    if (!sessionId) {
        return res.status(200).json({ error: 'Session ID is required' });
    }

    // Validate the session ID
    const user = users.find(user => user.sessionId === sessionId);

    if (!user) {
        return res.status(200).json({ error: 'Invalid or expired session ID' });
    }

    // Check if a file was uploaded
    if (!file) {
        return res.status(200).json({ error: 'No file uploaded' });
    }

    const photo = Buffer.from(file, 'base64');
    const photoName = `uploads/${Date.now()}.jpg`;

    fs.writeFile(photoName, photo, err => {
        if (err) {
            return res.status(500).json({ error: 'Error processing file' });
        }
    });

    const lesion = getRandomLesion();
    const historyItem = {
        image: '/' + photoName,
        ...lesion,
    };

    user.history.push(historyItem);

    return res.json({
        message: 'File uploaded successfully',
        lesion: historyItem,
    });

    // return res.json({
    //     message: 'File uploaded successfully',
    //     lesion: historyItem,
    //     history: user.history, // Return the updated history here
    // });
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
    console.log(`Server is running at http://${ip}:${port}`);
});
