import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class YearService {
  endPoint = `${environment.backendApi}/grl/years`;

  constructor(private http: HttpClient) {}

  getYears(iYearId?) {
    if (iYearId) {
      return this.http.get(`${this.endPoint}/getYears/${iYearId}`);
    }

    return this.http.get(`${this.endPoint}/getYears`);
  }
  insYears(data) {
    return this.http.post(`${this.endPoint}/insYears`, data);
  }
  updYears(data) {
    return this.http.put(`${this.endPoint}/updYears`, data);
  }
  patchYears(data) {
    return this.http.patch(`${this.endPoint}/patchYears`, data);
  }
  deleteYears(iYearId) {
    return this.http.delete(`${this.endPoint}/deleteYears/${iYearId}`);
  }
}
