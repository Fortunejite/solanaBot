import { Schema, model, models, Document, Model } from "mongoose";

interface IDeleted {
  telegramId: string;
  secretKey: string;
  publicKey: string;
  seed: string;
}

export interface IDeletedDocument extends IDeleted, Document {}

const deletedSchema: Schema<IDeletedDocument> = new Schema({
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
  seed: {
    type: String,
    required: true,
  },
}, {timestamps: true})

const Deleted: Model<IDeletedDocument> = models.Deleted || model<IDeletedDocument>('Deleted', deletedSchema)
export default Deleted