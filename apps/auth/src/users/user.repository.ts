import { AbstractRepository } from "@app/common";
import { UsersDocument } from "./models/user.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class UserRepository extends AbstractRepository<UsersDocument>{
    protected logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(UsersDocument.name)
         UserModel : Model<UsersDocument> 
    ){
        super(UserModel);
    }

}