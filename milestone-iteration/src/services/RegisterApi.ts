import axios from 'axios';

export const createUser = async (name: string, email: string, password: string) => {
  const response = await axios.post('https://api.escuelajs.co/api/v1/users/', {
    name,
    email,
    password,
  });
  return response.data;
};