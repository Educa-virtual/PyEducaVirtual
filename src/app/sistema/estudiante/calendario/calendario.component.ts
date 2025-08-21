import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component';
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component'; // * traduce el Modulo de calendario a español

import { MessageService } from 'primeng/api';
import { CalendarioService } from './services/calendario.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
})
export class CalendarioComponent implements OnInit {
  textoAnioAcademico: string = '';
  curricula = [];
  festividades = [];
  actividades = [];
  events = []; // guarda los eventos para el calendario
  iYAcadId = '';

  constructor(
    private messageService: MessageService,
    private calendarioService: CalendarioService,
    private store: LocalStoreService
  ) {}

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.obtenerDiasFestivos();
    this.obtenerCalendarioAcademico();
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

  formatAnioAcademico(anioAcademico: any) {
    const fechaInicio = new Date(anioAcademico.dtYAcadInicio);
    const fechaFin = new Date(anioAcademico.dYAcadFin);
    this.textoAnioAcademico = `Del ${fechaInicio.toLocaleDateString('es-PE')} al ${fechaFin.toLocaleDateString('es-PE')}`;
  }

  obtenerCalendarioAcademico() {
    this.calendarioService.obtenerCalendarioAcademico(this.iYAcadId).subscribe({
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
    });
  }

  filterCurso(valor: any) {
    console.log('valor', valor);
    this.events.map(evento => {
      if (evento.cCursoNombre == valor.checkbox.cCursoNombre && valor.checkbox.mostrar == true) {
        evento.display = 'block';
      }
      if (evento.cCursoNombre == valor.checkbox.cCursoNombre && valor.checkbox.mostrar == false) {
        evento.display = 'none';
      }
    });
    this.events = Object.assign([], this.events);
  }

  filterActividad(valor: any) {
    this.events.map(evento => {
      if (
        evento.cActTipoNombre == valor.checkbox.cActTipoNombre &&
        valor.checkbox.mostrar == true
      ) {
        evento.display = 'block';
      }
      if (
        evento.cActTipoNombre == valor.checkbox.cActTipoNombre &&
        valor.checkbox.mostrar == false
      ) {
        evento.display = 'none';
      }
    });
    this.events = Object.assign([], this.events);
  }
}
