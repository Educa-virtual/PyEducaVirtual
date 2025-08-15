import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

interface CacheEntry {
  url: string;
  response: HttpResponse<unknown>;
  expiry: number; // timestamp en milisegundos
}

const DEFAULT_MAX_AGE = 5 * 60 * 1000; // 5 minutos

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private cache = new Map<string, CacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const entry = this.cache.get(req.urlWithParams);

    if (!entry) return undefined;

    const now = Date.now();
    if (entry.expiry < now) {
      // Expiró
      this.cache.delete(req.urlWithParams);
      return undefined;
    }

    return entry.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>, maxAge: number = DEFAULT_MAX_AGE): void {
    const expiry = Date.now() + maxAge;
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response,
      expiry,
    };
    this.cache.set(req.urlWithParams, entry);
  }

  invalidateUrl(url: string): void {
    this.cache.delete(url);
  }

  clear(): void {
    this.cache.clear();
  }
}
