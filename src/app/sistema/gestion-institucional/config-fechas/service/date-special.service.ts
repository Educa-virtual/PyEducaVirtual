import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class DateSpecialService {
  importEndPoint = 'sin enpoint';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  importDataCollection(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/${this.importEndPoint}`, {
      SpecialsDates: data,
    });
  }
}
