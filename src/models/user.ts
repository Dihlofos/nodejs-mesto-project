import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { STATUS_CODE } from '../utils/constants';
import CustomError from '../errors/custom-errors';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export type UserModel = mongoose.Model<IUser> & {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
};

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "Имя" - 2'],
    maxlength: [30, 'Максимальная длина поля "Имя" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "Описание" - 2'],
    maxlength: [200, 'Максимальная длина поля "Описание" - 200'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: 'Ссылка для аватара некорректная',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Email некорректный',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.statics.findUserByCredentials = function _(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(
          new CustomError(STATUS_CODE.UNAUTHORIZED, 'Почта или пароль введены неверно'),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new CustomError(STATUS_CODE.UNAUTHORIZED, 'Почта или пароль введены неверно'),
          );
        }
        return user;
      });
    });
};

// создаём модель и экспортируем её
export default mongoose.model<IUser, UserModel>('user', UserSchema);
