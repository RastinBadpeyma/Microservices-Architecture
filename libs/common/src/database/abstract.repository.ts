/* eslint-disable prettier/prettier */
import { Logger, NotFoundException } from '@nestjs/common'
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose'
import { AbstractDocument } from './abstract.schema'

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    })
    /**
     * toJSON is serializer.
     * When .toJSON() is called, TypeScript may not be able to accurately predict the type of the returned object.
     * By casting to unknown, we are telling TypeScript: "I know this object has an unknown type right now, 
     but I'm going to cast it to a specific type in the next step.

**/
    return (await createdDocument.save()).toJSON() as unknown as TDocument
  }

  /** 
   * When Mongoose returns   a document from the database, it converts it into a mongoose document, which 
   includes a series of additional methods and properties along with our data.
   * The .lean() method tells Mongoose: "Just give me the raw data, not a full Mongoose Document.
  */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean<TDocument>(true)

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery)
      throw new NotFoundException('Document was not found')
    }

    return document
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        //new: true,: This option tells Mongoose to return the updated document, not the document before the update.
        new: true,
      })
      .lean<TDocument>(true)

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery)
      throw new NotFoundException('Document was not found')
    }

    return document
  }

  // filteQuery is type saftey that its related to monngooose type definition
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true)
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true)

    if (!document) {
      this.logger.warn(
        'Document was not found for deletion with filterQuery',
        filterQuery,
      )
      throw new NotFoundException('Document was not found for deletion.')
    }

    return document
  }
}
