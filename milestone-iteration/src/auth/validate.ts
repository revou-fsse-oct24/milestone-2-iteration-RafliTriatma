import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate token
  const isValid = token === 'valid-token'; // Replace with actual validation logic
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  return res.status(200).json({ message: 'Token Valid' });
}
