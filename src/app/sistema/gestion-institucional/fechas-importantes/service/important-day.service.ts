import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { GeneralService } from '@/app/servicios/general.service';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class importantDayService {
  importEndPoint = `${baseUrl}`;
  endPoint = `${baseUrl}/acad/feriados-importantes`;
  constructor(
    public http: HttpClient,
    public query: GeneralService
  ) {}

  getTiposFechas() {
    return this.http.get(`${baseUrl}/acad/tipos-fechas/getTiposFechas`);
  }

  getCalendarioAcademico() {
    const iSedeId = JSON.parse(localStorage.getItem('dremoPerfil'))?.iSedeId;
    const iYAcadId = JSON.parse(localStorage.getItem('dremoiYAcadId'));

    return this.query.searchCalendario({
      json: JSON.stringify({
        iSedeId: iSedeId,
        iYAcadId: iYAcadId,
      }),
      _opcion: 'getCalendarioSedeYear',
    });
  }

  getDependenciaFechas(data) {
    return this.http.get(`${this.endPoint}/getDependenciaFechas/${data.iFechaImpId}`);
  }

  getFechasImportantes() {
    const iYAcadId = JSON.parse(localStorage.getItem('dremoiYAcadId'));
    const iSedeId = JSON.parse(localStorage.getItem('dremoPerfil'))?.iSedeId;

    return this.http.get(`${this.endPoint}/getFechasImportantes/${iYAcadId}/${iSedeId}`);
  }

  insFechasImportantes(data) {
    return this.http.post(`${this.endPoint}/insFechasImportantes`, data);
  }

  updFechasImportantes(data) {
    return this.http.put(`${this.endPoint}/updFechasImportantes`, data);
  }

  deleteFechasImportantes(data) {
    return this.http.delete(`${this.endPoint}/deleteFechasImportantes/${data.iFechaImpId}`);
  }
}
