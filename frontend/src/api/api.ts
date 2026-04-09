const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// --- Auth API ---

export const login = async (credentials: any) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
};

// --- Tasks API ---

export const getAllTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
};

export const getTaskById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch task');
    return data;
};

export const createTask = async (taskData: any) => {
    const response = await fetch(`${BASE_URL}/tasks/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create task');
    return data;
};

export const updateTask = async (id: string, taskData: any) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(taskData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update task');
    return data;
};

// --- Users API ---

export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/users`, {
        headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
};
