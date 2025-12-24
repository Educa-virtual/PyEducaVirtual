import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component';
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component'; // * traduce el Modulo de calendario a español

import { MenuItem, MessageService } from 'primeng/api';
import { CalendarioService } from './services/calendario.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-calendario-estudiante',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent, NoDataComponent],
  templateUrl: './calendario-estudiante.component.html',
  styleUrl: './calendario-estudiante.component.scss',
})
export class CalendarioComponent implements OnChanges {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  textoAnioAcademico: string = '';
  curricula = [];
  festividades = [];
  actividades = [];
  events = []; // guarda los eventos para el calendario
  iYAcadId = '';
  complete: boolean = false;

  @Input() lista; //listao de usuarios

  constructor(
    private messageService: MessageService,
    private calendarioService: CalendarioService,
    private store: LocalStoreService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lista']?.currentValue) {
      this.lista = changes['lista'].currentValue;
      if (this.lista) {
        this.iYAcadId = this.lista;

        this.obtenerDiasFestivos();
        this.obtenerCalendarioAcademico();
      }
    }
  }

  obtenerDiasFestivos() {
    this.calendarioService.obtenerTiposFechasImportantes().subscribe({
      next: (response: any) => {
        this.festividades = response.data;
        this.festividades.map(caja => {
          caja.mostrar = true;
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron obtener los días festivos.',
        });
      },
    });
  }

  formatAnioAcademico(anioAcademico: any) {
    const fechaInicio = new Date(anioAcademico.dtYAcadInicio);
    const fechaFin = new Date(anioAcademico.dYAcadFin);
    this.textoAnioAcademico = `Del ${fechaInicio.toLocaleDateString('es-PE')} al ${fechaFin.toLocaleDateString('es-PE')}`;
  }

  obtenerCalendarioAcademico() {
    if (
      this.lista?.iYAcadId != null &&
      this.lista?.iPersId != null &&
      this.lista?.iSedeId != null
    ) {
      this.calendarioService
        .obtenerCalendarioAcademico(this.lista.iYAcadId, this.lista.iPersId, this.lista.iSedeId)
        .subscribe({
          next: (response: any) => {
            this.events = response.data.calendario;
            this.curricula = response.data.cursos;
            this.actividades = response.data.tiposActividad;
            this.formatAnioAcademico(response.data.anioAcademico);
            this.curricula.map(o => {
              o.mostrar = true;
            });
            this.actividades.map(o => {
              o.mostrar = true;
            });
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
          },
          complete: () => {
            this.complete = true;
          },
        });
    }
  }

  filterCurso(valor: any) {
    this.events = this.events.map(evento => {
      const mostrar = this.obtenerEstadoMostrarActividad(evento.cActTipoNombre);
      if (evento.cCursoNombre == valor.checkbox.cCursoNombre) {
        return {
          ...evento,
          display: valor.checkbox.mostrar && mostrar ? 'block' : 'none',
        };
      }
      return evento;
    });
  }

  //Dias recuperables, feriados, etc.
  filterFestividad(valor: any) {
    this.events.map(evento => {
      if (evento.grupo == valor.checkbox.cTipoFechaNombre && valor.checkbox.mostrar == true) {
        evento.display = 'block';
      }
      if (evento.grupo == valor.checkbox.cTipoFechaNombre && valor.checkbox.mostrar == false) {
        evento.display = 'none';
      }
    });
    this.events = Object.assign([], this.events);
  }

  //Cuestionarios, foros, etc.
  filterActividad(valor: any) {
    this.events = this.events.map(evento => {
      if (evento.cActTipoNombre == valor.checkbox.cActTipoNombre) {
        const mostrar = this.obtenerEstadoMostrarCurso(evento.cCursoNombre);
        return {
          ...evento,
          display: valor.checkbox.mostrar && mostrar ? 'block' : 'none',
        };
      }
      return evento;
    });
  }

  obtenerEstadoMostrarCurso(nombreCurso: string): boolean {
    const curso = this.curricula.find(c => c.cCursoNombre === nombreCurso);
    return curso ? curso.mostrar : false;
  }

  obtenerEstadoMostrarActividad(nombreActividad: string): boolean {
    const actividad = this.actividades.find(c => c.cActTipoNombre === nombreActividad);
    return actividad ? actividad.mostrar : false;
  }
}
