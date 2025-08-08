import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component';
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component'; // * traduce el Modulo de calendario a español

import { MessageService } from 'primeng/api';
import { CalendarioService } from './services/calendario.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
})
export class CalendarioComponent implements OnInit {
  //private GeneralService = inject(GeneralService);
  //private ConstantesService = inject(ConstantesService);

  /*iDocenteId: string;
    iYAcadId: string;
    iIieeId: string;
    iSedeId: string;*/

  //@Input() iCursoId: string;
  //@Input() iSeccionId: string;
  textoAnioAcademico: string = '';
  curricula = [];
  festividades = [];
  actividades = [];
  events = []; // guarda los eventos para el calendario

  constructor(
    private messageService: MessageService,
    private calendarioService: CalendarioService
  ) {
    /*this.iDocenteId = this.ConstantesService.iDocenteId;
        this.iYAcadId = this.ConstantesService.iYAcadId;
        this.iIieeId = this.ConstantesService.iIieeId;
        this.iSedeId = this.ConstantesService.iSedeId;*/
  }

  ngOnInit() {
    //console.log('CalendarioComponent initialized');
    //this.getObtenerCurriculas();
    //this.getObtenerCurriculasHorario();
    this.obtenerDiasFestivos();
    this.obtenerCalendarioAcademico();
    //this.obtenerAreasCurriculares();
    //this.getObtenerActividad();
  }

  obtenerDiasFestivos() {
    this.calendarioService.obtenerDiasFestivos().subscribe({
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
    this.calendarioService.obtenerCalendarioAcademico().subscribe({
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

  // Obtener Areas curriculares para los checkbox
  /*getObtenerCurriculas() {
      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'buscar_curso',
        ruta: 'curricula',
        data: {
          iDocenteId: this.iDocenteId,
          iYAcadId: this.iYAcadId,
          iIieeId: this.iIieeId,
          iSedeId: this.iSedeId,
        },
        params: { skipSuccessMessage: true },
      };
      this.getInformation(params, 'curriculas');
    }*/

  /*getObtenerFestividades() {
      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'asistencia',
        ruta: 'obtenerFestividad',
        data: {},
        params: { skipSuccessMessage: true },
      };
      this.getInformation(params, 'festividades');
    }*/

  /*getObtenerActividad() {
      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'buscar_curso',
        ruta: 'obtenerActividad',
        data: {},
        params: { skipSuccessMessage: true },
      };
      this.getInformation(params, 'actividades');
    }*/

  /*getObtenerCurriculasHorario() {
      const params = {
        petition: 'post',
        group: 'docente',
        prefix: 'buscar_curso',
        ruta: 'curriculaHorario',
        data: {
          iDocenteId: this.ConstantesService.iDocenteId,
          iYAcadId: this.ConstantesService.iYAcadId,
          iIieeId: this.iIieeId,
          iSedeId: this.iSedeId,
        },
        params: { skipSuccessMessage: true },
      };
      this.getInformation(params, 'curriculaHorario');
    }*/

  /*accionBtnItem(event) {
        const { accion } = event;
        const { item } = event;

        switch (accion) {
            case 'curriculas':
                this.curricula = item;
                this.curricula.map(caja => {
                    caja.mostrar = true;
                });
                break;
            case 'curriculaHorario':
                this.events = item;
                break;
            case 'festividades':
                this.festividades = item;
                this.festividades.map(caja => {
                    caja.mostrar = true;
                });
                break;
            case 'actividades':
                this.actividades = item;
                this.actividades.map(caja => {
                    caja.mostrar = true;
                });
                break;
            default:
                this.curricula = [];
                this.festividades = [];
                break;
        }
    }*/

  /*getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data });
            },
            complete: () => { },
        });
    }*/

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
