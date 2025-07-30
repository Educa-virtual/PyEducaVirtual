import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { HorasAreasService } from '@/app/sistema/ere/services/horas-areas.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-asignar-horas-areas',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './asignar-horas-areas.component.html',
  styleUrl: './asignar-horas-areas.component.scss',
})
export class AsignarHorasAreasComponent implements OnInit {
  evaluacion: any;
  visible: boolean;
  //@Input() areas=[]

  private horasAreasService = inject(HorasAreasService);
  formAreas!: FormGroup;
  listaCursos: [];

  constructor(
    private fb: FormBuilder,
    private store: LocalStoreService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formAreas = this.fb.group({
      inputAreas: this.fb.array([this.createArea()]),
    });
  }

  mostrarDialog(evaluacion: any) {
    this.evaluacion = evaluacion;
    this.visible = true;
    this.obtenerHoras();
  }

  obtenerHoras() {
    this.horasAreasService
      .obtenerHorasAreasPorEvaluacionDirectorIe({
        iEvaluacionIdHashed: this.evaluacion?.iEvaluacionIdxHash,
        iieeId: this.store.getItem('dremoPerfil').iIieeId,
        iPersId: this.store.getItem('dremoUser').iPersId,
      })
      .subscribe({
        next: respuesta => {
          this.inputAreas.clear();
          respuesta.forEach((area: any) => {
            const form = this.fb.group({
              horaInicio: [this.convertirHoraADate(area.tInicio)],
              horaFin: [this.convertirHoraADate(area.tFin)],
              iCursosNivelGradId: [area.iCursoNivelGradId],
              cCursoNombre: [area.cCursoNombre],
              cGradoAbreviacion: [area.cGradoAbreviacion],
              dtExamenFechaInicio: [area.dtExamenFechaInicio],
              cNivelTipoNombre: [area.cNivelTipoNombre],
              iIeeParticipaId: [area.iIeeParticipaId],
              iExamCurId: [area.iExamCurId],
              iIeeCursoExamenId: [area.iIeeCursoExamenId],
            });
            this.inputAreas.push(form);
          });
        },
      });
  }

  registrarHoras() {
    this.horasAreasService
      .registrarHorasAreasPorEvaluacionDirectorIe(
        {
          iEvaluacionIdHashed: this.evaluacion?.iEvaluacionIdxHash,
          iieeId: this.store.getItem('dremoPerfil').iIieeId,
          iPersId: this.store.getItem('dremoUser').iPersId,
        },
        this.formAreas.value.inputAreas
      )
      .subscribe({
        next: respuesta => {
          this.messageService.add({
            severity: respuesta['status'].toLowerCase(),
            detail: respuesta['message'],
          });
          this.visible = false;
        },
        error: respuesta => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: respuesta,
          });
        },
      });
  }

  convertirHoraADate(hora: string): Date {
    if (hora == null) {
      return null;
    } else {
      const fecha: Date = new Date();
      const [hours, minutes, seconds] = hora.split(':').map(Number);
      fecha.setHours(hours, minutes, seconds, 0);
      return fecha;
    }
  }

  createArea(): FormGroup {
    return this.fb.group({
      horaInicio: [null],
      horaFin: [null],
      iCursosNivelGradId: [null],
      cCursoNombre: [null],
      cGradoAbreviacion: [null],
      dtExamenFechaInicio: [null],
      cNivelTipoNombre: [null],
      iIeeParticipaId: [null],
      iExamCurId: [null],
      iIeeCursoExamenId: [null],
    });
  }

  filteredInputAreas(nivel: string) {
    return this.inputAreas.controls.filter(area => area.get('cNivelTipoNombre')?.value === nivel);
    /*.sort((a, b) => {
                const gradoA = a.get('cGradoAbreviacion')?.value || ''
                const gradoB = b.get('cGradoAbreviacion')?.value || ''
                return gradoA.localeCompare(gradoB)
            })*/
  }

  get uniqueCNivel(): string[] {
    const niveles = this.inputAreas.controls.map(area => area.get('cNivelTipoNombre')?.value);
    return Array.from(new Set(niveles));
  }

  get inputAreas(): FormArray {
    return this.formAreas.get('inputAreas') as FormArray;
  }
}
