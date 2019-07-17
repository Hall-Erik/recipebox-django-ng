import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable()
export class RecipeInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.userService.token != null) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Token ${this.userService.token}`
                }
            });
            console.log('Making authenticated request.');
            req = authReq;
        }
        return next.handle(req);
    }
}