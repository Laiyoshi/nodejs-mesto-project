import mongoose from 'mongoose';

const validator = require('validator');

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: Array<mongoose.Types.ObjectId>;
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model<ICard>('card', cardSchema);
