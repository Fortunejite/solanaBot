import { Schema, model, models, Document, Model } from "mongoose";

interface IUser {
  telegramId: string;
  secretKey: string;
  publicKey: string;
}

export interface IUserDocument extends IUser, Document {}

const userSchema: Schema<IUserDocument> = new Schema({
  telegramId: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
}, {timestamps: true})

const User: Model<IUserDocument> = models.User || model<IUserDocument>('User', userSchema)
export default User