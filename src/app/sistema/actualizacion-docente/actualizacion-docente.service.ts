import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

const baseUrl = environment.backendApi;

@Injectable({
  providedIn: 'root',
})
export class ActualizacionDocenteService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  lista: any[] = [];

  parametros: any;

  buscarInstructorxiTipoIdentIdxcPersDocumento(data: any) {
    return this.http.get(
      `${baseUrl}/cap/instructores/${data.iTipoIdentId}/${data.cPersDocumento}`,
      data
    );
  }

  buscarPersona(data: any) {
    return this.http.post(`${baseUrl}/grl/validarPersona`, data);
  }

  listarInstructores(data: any) {
    return this.http.get(`${baseUrl}/cap/instructores`, data);
  }

  guardarInstructor(data: any) {
    return this.http.post(`${baseUrl}/cap/instructores`, data);
  }

  actualizarInstructor(data: any) {
    return this.http.put(`${baseUrl}/cap/instructores/${data.iInstId}`, data);
  }

  borrarInstructor(data: any) {
    return this.http.delete(`${baseUrl}/cap/instructores/${data.iInstId}`, data);
  }

  estadoInstructor(data: any) {
    return this.http.post(`${baseUrl}/cap/instructores/${data.iInstId}/estado`, data);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
