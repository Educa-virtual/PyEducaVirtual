import { inject, Injectable } from '@angular/core';
import { ApiEvaluacionesRService } from '../api-evaluaciones-r.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { GeneralService } from '@/app/servicios/general.service';

//import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CompartirFormularioEvaluacionService {
  lista: any[] = [];

  private cEvaluacionNombre: string | null = null; // Nombre de la evaluacion
  private grado: string | null = null;
  private nivel: string | null = null;
  private seccion: string | null = null;
  private areas: any[] = []; // Lista de áreas procesadas
  private areasIdNivelGradoString: string | null = null;
  private _iEvaluacionId: number | null = null; // ID de la evaluación
  private _apiEre = inject(ApiEvaluacionesRService);
  private unsubscribe$ = new Subject<boolean>();

  setcEvaluacionNombre(nombre: string) {
    this.cEvaluacionNombre = nombre;
    // Guardar en el localStorage
    localStorage.setItem('cEvaluacionNombre', nombre);
  }

  getcEvaluacionNombre(): string | null {
    // Intentar recuperar del localStorage si está vacío
    if (!this.cEvaluacionNombre) {
      this.cEvaluacionNombre = localStorage.getItem('cEvaluacionNombre');
    }
    return this.cEvaluacionNombre;
  }

  setGrado(grado: string) {
    this.grado = grado;
    localStorage.setItem('grado', grado);
  }

  getGrado(): string | null {
    if (!this.grado) {
      this.grado = localStorage.getItem('grado');
    }
    return this.grado;
  }

  setNivel(nivel: string) {
    this.nivel = nivel;
    localStorage.setItem('nivel', nivel);
  }

  getNivel(): string | null {
    if (!this.nivel) {
      this.nivel = localStorage.getItem('nivel');
    }
    return this.nivel;
  }
  setSeccion(seccion: string) {
    this.seccion = seccion;
    localStorage.setItem('seccion', seccion);
  }

  getSeccion(): string | null {
    if (!this.seccion) {
      this.seccion = localStorage.getItem('seccion');
    }
    return this.seccion;
  }

  // MÉTODO PARA GUARDAR ÁREAS
  setAreas(areas: any[]): void {
    this.areas = areas;
    // Guardar en localStorage como string JSON
    localStorage.setItem('areas', JSON.stringify(areas));
  }

  // MÉTODO PARA OBTENER ÁREAS
  getAreas(): any[] {
    // Si las áreas no están en memoria, intentar recuperarlas del localStorage
    if (!this.areas || this.areas.length === 0) {
      const storedAreas = localStorage.getItem('areas');
      this.areas = storedAreas ? JSON.parse(storedAreas) : [];
    }
    return this.areas;
  }

  setAreasId(areasIdNivelGradoString: string) {
    this.areasIdNivelGradoString = areasIdNivelGradoString;
    localStorage.setItem('areasIdNivelGradoString', areasIdNivelGradoString);
  }

  getAreasId(): string | null {
    if (!this.areasIdNivelGradoString) {
      this.areasIdNivelGradoString = localStorage.getItem('areasIdNivelGradoString');
    }
    return this.areasIdNivelGradoString;
  }

  constructor(private query: GeneralService) {}

  setEvaluacionId(id: number): void {
    this._iEvaluacionId = id;
  }
  obtenerCursosSeleccionados(): Promise<Map<number, boolean>> {
    return new Promise((resolve, reject) => {
      const evaluacionId = this._iEvaluacionId;
      if (!evaluacionId) {
        return reject('El ID de la evaluación no está definido.');
      }

      this._apiEre
        .obtenerCursosEvaluacion(evaluacionId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (resp: any) => {
            // Crear un mapa con los cursos seleccionados
            const cursosSeleccionados: Map<number, boolean> = new Map(
              resp.cursos.map((curso: any) => [
                curso.iCursoNivelGradId as number, // Asegurar que sea número
                curso.isSelected === '1', // Convertir "1" a true
              ])
            );

            // Limpia la lista para evitar datos residuales
            this.lista.forEach((nivel: any) => {
              Object.keys(nivel.grados).forEach(grado => {
                nivel.grados[grado].forEach((curso: any) => {
                  curso.isSelected = false; // Resetear a false
                });
              });
            });

            // Actualizar con los nuevos datos
            this.lista.forEach((nivel: any) => {
              Object.keys(nivel.grados).forEach(grado => {
                nivel.grados[grado].forEach((curso: any) => {
                  // Si el curso está en el mapa, actualizamos su estado
                  curso.isSelected = cursosSeleccionados.get(curso.iCursoNivelGradId) || false;
                });
              });
            });
            resolve(cursosSeleccionados);
          },
          error: err => {
            console.error('Error al obtener cursos:', err);
            reject(err);
          },
        });
    });
  }

  // Llamar a la función para obtener los datos de primaria y secundaria
  searchAmbienteAcademico(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      forkJoin({
        primaria: this.query.searchAmbienteAcademico({
          json: JSON.stringify({
            iNivelGradoId: 3, // Primaria
          }),
          _opcion: 'getCursosNivelGrado',
        }),
        secundaria: this.query.searchAmbienteAcademico({
          json: JSON.stringify({
            iNivelGradoId: 4, // Secundaria
          }),
          _opcion: 'getCursosNivelGrado',
        }),
      }).subscribe({
        next: (data: any) => {
          console.log('Datos recibidos de Primaria:', data.primaria);
          console.log('Datos recibidos de Secundaria:', data.secundaria);

          // Combina los datos de primaria y secundaria
          const listaCombinada = [
            ...this.extraerAsignatura(data.primaria.data),
            ...this.extraerAsignatura(data.secundaria.data),
          ];

          console.log('Lista combinada:', listaCombinada);

          resolve(listaCombinada); // Devuelve la lista combinada
        },
        error: (err: any) => {
          console.error('Error al obtener los datos:', err);
          reject(err);
        },
      });
    });
  }
  // Función para estructurar los datos
  extraerAsignatura(data: any): any[] {
    console.log('Datos recibidos en extraerAsignatura:', data);

    if (!Array.isArray(data)) {
      console.error('Error: Los datos no son un arreglo');
      return [];
    }

    // Estructuramos los datos por nivel y grado
    const groupedData = data.reduce((acc: any, item: any) => {
      const nivel = item.cNivelTipoNombre ?? 'Sin Descripción';
      const grado = item.cGradoAbreviacion ?? 'Sin Abreviación';
      if (!acc[nivel]) {
        acc[nivel] = []; // Cada nivel contiene grados
      }

      if (!acc[nivel][grado]) {
        acc[nivel][grado] = []; // Cada grado contiene cursos
      }

      acc[nivel][grado].push({
        iCursoNivelGradId: item.iCursosNivelGradId, // Nuevo campo
        cCursoNombre: item.cCursoNombre ?? 'Sin Nombre',
        isSelected: false, // Propiedad para checkbox
      });

      return acc;
    }, {});

    console.log('Datos agrupados:', groupedData);

    // Convertir el objeto agrupado en un arreglo
    return Object.keys(groupedData).map(nivel => ({
      nivel,
      grados: groupedData[nivel],
    }));
  }
}
