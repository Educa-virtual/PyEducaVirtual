import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-docente',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './add-docente.component.html',
  styleUrl: './add-docente.component.scss',
})
export class AddDocenteComponent implements OnChanges, OnInit {
  @Output() filtrarDocente = new EventEmitter();

  @Input() configuracion;
  @Input() minimo;
  @Input() caption;
  @Input() visible_docente;
  @Input() turnos;
  @Input() grados;
  @Input() secciones;
  @Input() areas;
  @Input() docentes;
  @Input() c_accion;
  @Input() horas_asignadas;
  @Input() lista_areas_docente;
  @Input() area;

  @Input() iTurnoId;
  @Input() iNivelGradoId;
  @Input() iSeccionId;
  @Input() iModalServId;

  form: FormGroup;

  open_modal: boolean = false;

  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,

    private messageService: MessageService,
    private query: GeneralService
  ) {}

  ngOnInit() {
    console.log(this.visible_docente, 'this.visible com add-docente');
    this.open_modal = false;
    if (this.visible_docente) {
      this.open_modal = true;
      console.log(this.area, ' registro en com if visible');
      this.formulario();
    }

    this.form = this.fb.group({
      idDocCursoId: [0], // PK,
      iSemAcadId: [0], // tabla docente_curso (FK)
      iYAcadId: [0], // tabla docente_curso (FK)
      iDocenteId: [0, Validators.required], // tabla docente_curso (FK)
      iIeCursoId: [{ value: 0, disabled: true }],

      iModalServId: [0],

      iSeccionId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
      iTurnoId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
      cDocCursoObsevaciones: [''], // tabla docente_curso (FK)
      // iDocCursoHorasLectivas: [0, [Validators.pattern(/^\d+$/),  Validators.min(4), Validators.max(40)]],
      iEstado: [1],
      iCursoId: [{ value: 0, disabled: true }],

      iNivelGradoId: [{ value: 0, disabled: true }],
      cCicloNombre: [{ value: '', disabled: true }],
      cNivelNombre: [{ value: '', disabled: true }],
      cNivelTipoNombre: [{ value: '', disabled: true }],
      ihora_disponible: [{ value: 0 }],
      ihora_total: [
        { value: 0, disabled: true },
        [Validators.pattern(/^\d+$/)],
        Validators.required,
      ],
      ihora_asignada: [
        { value: 0, disabled: true },
        [Validators.pattern(/^\d+$/)],
        Validators.required,
      ],

      iCursosNivelGradId: [],
      iCursosNivelGradId_ies_cursos: [],
      iDocenteId_ies_curso: [],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.visible_docente, 'this.visible com add-docente  en change');
    this.open_modal = false;
    if (this.visible_docente) {
      this.formulario();
    }
    if (changes['visible'] && changes['visible'].currentValue) {
      if (this.visible_docente) {
        this.formulario();
      }
    }
  }

  formulario() {
    this.form.get('iYAcadId').setValue(this.configuracion[0].iYAcadId);
    this.form.get('iTurnoId').setValue(this.iTurnoId);
    this.form.get('iNivelGradoId').setValue(this.area.iNivelGradoId);
    this.form.get('iSeccionId').setValue(this.iSeccionId);
    this.form.get('iModalServId').setValue(this.iModalServId);
    this.form.get('iCursoId').setValue(this.area.iCursoId);

    console.log(this.configuracion, 'configuracion');
    console.log(this.minimo, 'minimo');
    console.log(this.caption, 'caption');
    console.log(this.visible_docente, 'visible');
    console.log(this.turnos, 'turnos');
    console.log(this.grados, 'grados');
    console.log(this.secciones, 'secciones');
    console.log(this.areas, 'areas');
    console.log(this.docentes, 'docentes');
    console.log(this.c_accion, 'c_accion');
    console.log(this.horas_asignadas, 'horas_asignadas');
    console.log(this.lista_areas_docente, 'lista_areas_docente');
    console.log(this.area, 'area');
    this.open_modal = true;
  }

  onChange(event: any, action: string) {
    switch (action) {
      case 'docente':
        console.log(event, 'event onchange');
        break;
      case 'grado':
        console.log(event, 'event onchange');
        break;
    }
  }
  accionBtnItem(accion) {
    switch (accion) {
      case 'guardar':
        //this.addPersonal();

        break;
      case 'editar':
        //this.updatePersonal();

        break;
    }
  }
  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'eliminar':
        this._confirmService.openConfirm({
          message: '¿Estás seguro de que deseas eliminar este registro?',
          header: 'Confirmación de eliminación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            // Acción para eliminar el registro
            this.deleteAsignacionArea(item.idDocCursoId);
          },
          reject: () => {
            // Mensaje de cancelación (opcional)
            this.messageService.add({
              severity: 'error',
              summary: 'Cancelado',
              detail: 'Acción cancelada',
            });
          },
        });
        break;
    }
  }
  searchListaAreaDocente() {
    const iDocenteId = this.form.get('iDocenteId')?.value ?? null;
    const registro = this.docentes.find(option => option.iDocenteId === iDocenteId); // devuelve el campo
    this.form.get('ihora_total')?.setValue(registro.iHorasLabora);
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iProgId: this.configuracion[0].iProgId ?? 1,
          iYAcadId: this.configuracion[0].iYAcadId,
          iDocenteId: iDocenteId,
        }),
        _opcion: 'listarAreaXDocenteSedeAnio',
      })
      .subscribe({
        next: (data: any) => {
          this.lista_areas_docente = data.data;
          const datos = data.data;
          this.horas_asignadas = datos.reduce(
            (sum, docente) => Number(sum) + Number(docente.nCursoTotalHoras),
            0
          );
          console.log(datos, 'datos');
          // this.seccionesAsignadas = data.data
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en conexión',
            detail: 'Error en listar docentes asignados',
          });
          console.error('Error fetching  lista de Áreas curriculares:', error);
        },
        complete: () => {
          const total = this.form.get('ihora_total')?.value;
          if (iDocenteId > 0) {
            const disponible = total - Number(this.horas_asignadas);
            const valor = !isNaN(disponible) ? disponible : 0;
            this.form.get('ihora_disponible')?.setValue(valor);
            this.actualizarMinimo(this.form.get('ihora_asignada')?.value);
          } else {
            this.form.get('ihora_disponible')?.setValue(0);
          }
        },
      });
  }
  // Método para actualizar dinámicamente el validador
  actualizarMinimo(nuevoMinimo: number): void {
    const iDocenteId = this.form.get('iDocenteId')?.value ?? 0;
    const iDocenteId_ies_curso = this.form.get('iDocenteId_ies_curso')?.value ?? 0;
    this.minimo = nuevoMinimo; // Actualiza el valor de mínimo

    if (iDocenteId_ies_curso > 0 && iDocenteId === iDocenteId_ies_curso) {
      //se valida que el registro existente sea del docente y pueda agregar observaciones
      this.form.get('ihora_disponible').setValidators([
        Validators.required,
        Validators.pattern(/^\d+$/),
        //Validators.min(0)  // Asegura que haya al menos una hora disponible ! No es necesario para editar el mismo registro existente
      ]);

      // Reevaluar el estado del campo después de cambiar los validadores
      this.form.get('ihora_disponible')?.updateValueAndValidity();
    } else {
      // delimita crear un registro que no cumpla con la cantidad de horas
      this.form.get('ihora_disponible').setValidators([
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(this.minimo), // Asegura que haya al menos una hora disponible
      ]);

      // Reevaluar el estado del campo después de cambiar los validadores
      this.form.get('ihora_disponible')?.updateValueAndValidity();
    }
  }

  deleteAsignacionArea(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'Docente_cursos',
      campo: 'idDocCursoId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      next: (data: any) => {
        console.log(data.data);
      },
      error: error => {
        // console.error('Error fetching ambiente:', error)
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de error',
          detail: 'NO se pudo eliminar registro' + error,
        });
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Registro eliminado correctamente',
        });
        console.log('Request completed');
        this.searchListaAreaDocente();
      },
    });
  }

  selectedItems = [];

  actionsArea: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];
  columnaArea = [
    {
      type: 'item',
      width: '3%',
      field: 'item',
      header: '',
      text_header: 'left',
      text: 'left',
    },

    {
      type: 'text',
      width: '1rem',
      field: 'cCursoNombre',
      header: 'Área',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '1rem',
      field: 'cGradoNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '1rem',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '6rem',
      field: 'nCursoTotalHoras',
      header: 'Hora',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '3rem',
      field: 'actionsArea',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
