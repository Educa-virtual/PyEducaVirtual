import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ToolbarPrimengComponent } from '../../../shared/toolbar-primeng/toolbar-primeng.component';
import { FullCalendarioComponent } from '../../../shared/full-calendario/full-calendario.component'; // * traduce el Modulo de calendario a español
import { ConstantesService } from '@/app/servicios/constantes.service';
import { CalendarioService } from './services/calendario.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent, FullCalendarioComponent],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
})
export class CalendarioComponent implements OnInit {
  private ConstantesService = inject(ConstantesService);

  iDocenteId: string;
  iYAcadId: string;
  iIieeId: string;
  iSedeId: string;

  @Input() iCursoId: string;
  @Input() iSeccionId: string;

  curricula = [];
  festividades = [];
  actividades = [];
  events = []; // guarda los eventos para el calendario
  filtro = Array.from({ length: 12 }, () => []);
  constructor(private calendarioService: CalendarioService) {
    this.iDocenteId = this.ConstantesService.iDocenteId;
    this.iYAcadId = this.ConstantesService.iYAcadId;
    this.iIieeId = this.ConstantesService.iIieeId;
    this.iSedeId = this.ConstantesService.iSedeId;
  }

  ngOnInit() {
    this.getObtenerCurriculas();
    this.getObtenerCurriculasHorario();
  }

  // Obtener Areas curriculares para los checkbox
  getObtenerCurriculas() {
    const parametros = {
      iDocenteId: this.iDocenteId,
      iYAcadId: this.iYAcadId,
      iSedeId: this.iSedeId,
    };

    this.calendarioService.obtenerCalendarioAcademico(parametros).subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data;
        const curricula = JSON.parse(datos.curricula);
        const actividades = JSON.parse(datos.actividades);
        const festividades = JSON.parse(datos.festividades);

        this.curricula = [...curricula];
        this.curricula.forEach(caja => {
          caja.mostrar = true;
        });

        this.festividades = [...festividades];
        this.festividades.forEach(caja => {
          caja.mostrar = true;
        });

        this.actividades = [...actividades];
        this.actividades.forEach(caja => {
          caja.mostrar = true;
        });
      },
    });
  }

  getObtenerCurriculasHorario() {
    const parametros = {
      iDocenteId: this.ConstantesService.iDocenteId,
      iYAcadId: this.ConstantesService.iYAcadId,
      iIieeId: this.iIieeId,
      iSedeId: this.iSedeId,
    };

    this.calendarioService.obtenerCurriculaHorario(parametros).subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data;
        this.events = datos;
        this.events.forEach(evento => {
          evento.mostrar = true;
          evento.display = 'block';
        });
      },
    });
  }

  filterActividad(valor: any) {
    this.events
      .filter(evento => evento.grupo == valor.checkbox.grupo)
      .forEach(lista => {
        lista.mostrar = valor.checkbox.mostrar ? true : false;
        lista.display = lista.mostrar ? 'block' : 'none';
      });

    this.events = [...this.events];
  }
}
