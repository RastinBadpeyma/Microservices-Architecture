import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from "../constants/services";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate{
   constructor(
    @Inject(AUTH_SERVICE) 
    private readonly authClient: ClientProxy) {}

   canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean>{
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
        return false;
    }
    // whay actually happend when authenticate call and what happend after that?
    // why we create user interface
    return this.authClient.send<UserDto>('authenticate' , {
        Authentication: jwt,
    })
    .pipe(
        tap((res) => {
            context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false))
    );
}
}