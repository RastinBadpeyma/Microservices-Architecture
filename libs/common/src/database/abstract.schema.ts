import { Prop, Schema } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose'

@Schema()
export class AbstractDocument {
  /**
   * Defines the _id field as a MongoDB ObjectId
   * SchemaTypes.ObjectId is a special type in Mongoose that represents a unique identifier for documents.
   * Types.ObjectId is a class in Mongoose that represents an ObjectId, which is a 12-byte identifier typically used as the primary key for documents in MongoDB
   * */
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId
}
