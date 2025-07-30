import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  endpoint: '';
  constructor(private http: HttpClient) {}

  getData(params: any) {
    return this.http.get(`${environment.backendApi}/${this.endpoint}`, {
      params: params,
    });
  }
}
