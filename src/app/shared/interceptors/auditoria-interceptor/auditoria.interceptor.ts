import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class AuditoriaInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const data = req.clone({
      setHeaders: {
        'iCredId': JSON.parse(localStorage.getItem('dremoPerfil')).iCredId
      }
    })
    
    return next.handle(data)
  }
}
