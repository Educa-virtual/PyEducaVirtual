import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { Button } from 'primeng/button';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import {
  IActionContainer,
  ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component';

@Component({
  selector: 'app-curricula-competencia',
  standalone: true,
  imports: [TablePrimengComponent, Button, NoDataComponent, ContainerPageComponent],
  templateUrl: './curricula-competencia.component.html',
  styleUrl: './curricula-competencia.component.scss',
})
export class CurriculaCompetenciaComponent implements OnChanges {
  @Output() asignarcompetencia = new EventEmitter();

  @Input() iCurrId: number = 0;

  titulo: string = 'Gestión de Competencias';
  competencias: any[];
  visible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {}

  frmCursos = this.fb.group({
    iCurrId: [''],
    iTipoCursoId: ['', Validators.required],
    cCursoNombre: [''],
    nCursoCredTeoria: [''],
    nCursoCredPractica: [''],
    cCursoDescripcion: [''],
    nCursoTotalCreditos: [''],
    cCursoPerfilDocente: [''],
    iCursoTotalHoras: [''],
    iCursoEstado: ['', Validators.required],
    cCursoImagen: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iCurrId'] && changes['iCurrId'].currentValue) {
      // Si iCurrId cambió y tiene valor válido
      this.inicializacion();
      // this.getTipoCurso();
      // this.getCapacidades();
    }

    // if (changes['curriculas'] && changes['curriculas'].currentValue) {
    //   // Si curriculas cambió
    //   this.curriculas = changes['curriculas'].currentValue;
    // }
  }

  inicializacion() {
    this.competencias = [];
    //const item = event.item || this.cursos || null
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCurrId: this.iCurrId,
        }),
        _opcion: 'getCompetenciasXiCurriculaId',
      })
      .subscribe({
        next: (data: any) => {
          // this.totalCursos = data.data;
          this.competencias = data.data;
        },
        error: error => {
          let message = error?.error?.message || 'Error desconocido';
          const match = message.match(/]([^\]]+?)\./);
          if (match && match[1]) {
            message = match[1].trim() + '.';
          }
          message = decodeURIComponent(message);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: message,
          });
        },
        complete: () => {
          if (this.competencias && this.competencias.length === 0) {
            this.messageService.add({
              severity: 'warning',
              summary: 'Mensaje del sistema',
              detail: 'La curricula no cuenta con competencias',
            });
            return;
          }
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Mensaje del sistema',
          //   detail: 'Se cargo exitosamente',
          // });
        },
      });
  }

  accionBtnItem(event: any) {
    const item = event.item || null;
    const accion = event.accion || null;

    switch (accion) {
      case 'asignar':
        this.asignarcompetencia.emit(item);
        break;
      case 'agregar':
        (this.titulo = 'Formulario para agregar  área curricular'), (this.visible = true);
        break;

      case 'editar':
        this.titulo = 'Formulario para editar áreas curriculares';
        this.frmCursos.reset();
        this.visible = true;

        break;

      default:
        break;
    }
  }

  accionesCompetencias: IActionContainer[] = [
    {
      labelTooltip: 'Agregar competencias',
      text: '',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
  ];

  accionesTablacompetencias: IActionTable[] = [
    {
      labelTooltip: 'Editar competencias',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar competencias',
      icon: 'pi pi-trash',
      accion: 'eliminar_curricula',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];
  competenciasColumns = [
    {
      type: 'text',
      width: '5%',
      field: 'cCompetenciaNro',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '70%',
      field: 'cCompetenciaNombre',
      header: 'Competencia',
      text_header: 'center',
      text: 'left',
    },

    {
      type: 'estado-activo',
      width: '5%',
      field: 'iEstado',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '20%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
