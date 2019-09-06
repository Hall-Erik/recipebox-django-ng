import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable()
export class RecipeInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.userService.logged_in && req.url != 'https://flask-recipebox.s3.amazonaws.com/') {
            const authReq = req.clone({
                withCredentials: true
            });
            req = authReq;
        }
        return next.handle(req);
    }
}