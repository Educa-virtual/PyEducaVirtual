import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../servicios/http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldCache = req.method === 'GET' && req.headers.get('x-cache') === 'true';
    if (!shouldCache) return next.handle(req);

    const cachedResponse = this.cacheService.get(req);
    if (cachedResponse) return of(cachedResponse);

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(req, event);
        }
      })
    );
  }
}
