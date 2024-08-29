export type History = {
    image: string;
    name: string;
    recommendations: string[];
};

export type User = {
    name: string;
    email: string;
    password: string;
    sessionId: string;
    history: History[];
};
