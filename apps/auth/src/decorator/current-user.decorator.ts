import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UsersDocument } from '../users/models/user.schema'

const getCurrentUserByContext = (context: ExecutionContext): UsersDocument => {
  return context.switchToHttp().getRequest().user
}

//create CurrentUser decorator
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
)
