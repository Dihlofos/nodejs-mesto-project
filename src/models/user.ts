import mongoose from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

// создаём модель и экспортируем её
export default mongoose.model('user', UserSchema);
