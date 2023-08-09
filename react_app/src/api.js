import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getItems = async () => {
    const response = await axios.get(`${API_URL}/items/`);
    return response.data;
}
