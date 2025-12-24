import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Horario } from './interfaces/horario.interface';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { Dia } from './interfaces/dia.interface';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { GeneralService } from '@/app/servicios/general.service';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-horario-estudiante',
  standalone: true,
  imports: [PrimengModule, ContainerPageComponent, NoDataComponent],
  templateUrl: './horario-estudiante.component.html',
  styleUrl: './horario-estudiante.component.scss',
})
export class HorarioEstudianteComponent implements OnChanges {
  //breadCrumbItems: MenuItem[];
  //breadCrumbHome: MenuItem;

  @Input() lista; //listao de usuarios

  raw: Horario[] = [];
  bloques: number[] = [];
  detalleMatricula: string = '';
  franjas: { bloque: number; horario: string }[] = [];
  dias: Dia[] = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
  ];

  constructor(
    private query: GeneralService,
    private messageService: MessageService
    //private store: LocalStoreService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lista']?.currentValue) {
      this.lista = changes['lista'].currentValue;

      if (this.lista) {
        const iYAcadId = Number(this.lista.iYAcadId);
        const iSedeId = Number(this.lista.iSedeId);
        const iNivelGradoId = Number(this.lista.iNivelGradoId);
        const iSeccionId = Number(this.lista.iSeccionId);

        this.obtenerHorarios(iYAcadId, iSedeId, iNivelGradoId, iSeccionId);
      }
    }
  }

  obtenerHorarios(iYAcadId: number, iSedeId: number, iNivelGradoId: number, iSeccionId: number) {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iYAcadId: iYAcadId,
          iSedeId: iSedeId,
          iNivelGradoId: iNivelGradoId,
          iSeccionId: iSeccionId,
        }),
        _opcion: 'getHorarioEstudiante',
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'data');
          this.raw = data.data;
          this.detalleMatricula = this.lista.cMatriculaMostrar;
          //`${this.lista.cGradoAbreviacion} ${this.lista.cSeccionNombre} - ${this.lista.cNivelTipoNombre}`;

          this.bloques = Array.from(new Set(this.raw.map(h => h.iBloque))).sort((a, b) => a - b);
          this.franjas = this.bloques.map(b => {
            const h = this.raw.find(x => x.iBloque === b)!;
            const hi = h.tHoraInicio.slice(0, 5);
            const hf = h.tHoraFin.slice(0, 5);
            return { bloque: b, horario: `${hi} - ${hf}` };
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener horarios',
            detail: error.error.message,
          });
        },
      });
  }

  clase(diaId: number, bloque: number): Horario | null {
    return this.raw.find(h => h.iDiaId == diaId && h.iBloque == bloque) || null;
  }
}
