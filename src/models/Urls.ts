// src/models/Url.ts
import mongoose from 'mongoose';

export interface IUrl {
  urls: { url: string; value: string }[];
}

const urlSchema = new mongoose.Schema<IUrl>({
  urls: [
    {
      url: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;
