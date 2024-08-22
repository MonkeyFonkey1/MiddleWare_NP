
export type History = {
    image: string;
    name: string;
    recomandations: string[];
};

export type User = {
    name: string;
    email: string;
    password: string;
    sessionId: string;
    history: History[];
};

