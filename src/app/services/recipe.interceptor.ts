import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UserTokenService } from './user-token.service';

@Injectable()
export class RecipeInterceptor implements HttpInterceptor {
    constructor(private userToken: UserTokenService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.userToken.token != null) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Token ${this.userToken.token}`
                }
            });
            console.log('Making authenticated request.');
            req = authReq;
        }
        return next.handle(req);
    }
}