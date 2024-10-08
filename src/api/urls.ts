// pages/api/urls.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
 // Adjust path as necessary
import Url from '@/models/Urls';
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Kamlesh');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection error');
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === 'POST') {
    const { urls } = req.body;

    // Validate the incoming URLs
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'Invalid URLs' });
    }

    try {
        const newUrls = new Url({ urls });
        await newUrls.save(); // Attempt to save to MongoDB
        return res.status(201).json({ message: 'URLs saved successfully' });
      } catch (error) {
        // Log the complete error object for better insight
        console.error('Error saving URLs' );
      }
      
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
