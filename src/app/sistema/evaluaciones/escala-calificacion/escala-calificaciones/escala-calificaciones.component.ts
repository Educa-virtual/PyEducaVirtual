import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ReactiveFormService } from '@/app/servicios/reactive-form.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';

@Component({
  selector: 'app-escala-calificacion',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './escala-calificaciones.component.html',
  styleUrl: './escala-calificaciones.component.scss',
})
export class EscalaCalificacionComponent {
  titulo: string = 'Nueva escala';

  estados: any[] = [
    { label: 'ACTIVO', value: 1 },
    { label: 'INACTIVO', value: 0 },
  ];

  escalas: any[] = [];
  iYAcadId: number;

  iTipoEscalaId: number;
  tipo: any = {};

  escala: any = {};
  bEditar: boolean = false;
  visible: boolean = false;

  formEscala: FormGroup;

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  constructor(
    private formService: ReactiveFormService,
    private store: LocalStoreService,
    private fb: FormBuilder,
    private router: Router,
    private logroService: LogroAlcanzadoService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.params.subscribe((params: any) => {
      this.iTipoEscalaId = params?.iTipoEscalaId;
    });
    this.setBreadCrumbItems();
  }

  ngOnInit(): void {
    this.formEscala = this.fb.group({
      iEscalaCalifId: [null],
      iTipoEscalaId: [null],
      cEscalaCalifNombre: ['', Validators.required],
      cEscalaCalifDescripcion: [''],
      cEscalaCalifLetra: ['', Validators.required],
      nEscalaCalifEquivalente: [0, Validators.required],
    });
    this.verTipoEscala();
    this.listarEscalas();
  }

  setBreadCrumbItems() {
    this.breadCrumbItems = [
      {
        label: 'Tipo de escala',
        routerLink: ['/evaluaciones/tipo-escala'],
      },
      { label: this.tipo ? this.tipo.cTipoEscalaNombre : 'Tipo' },
      { label: 'Escalas' },
    ];
  }

  verTipoEscala() {
    this.logroService
      .verTipoEscala({
        iTipoEscalaId: this.iTipoEscalaId,
      })
      .subscribe({
        next: (data: any) => {
          this.tipo = data.data;
          this.setBreadCrumbItems();
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  listarEscalas() {
    this.logroService
      .listarEscalaCalificaciones({
        iTipoEscalaId: this.iTipoEscalaId,
      })
      .subscribe({
        next: (data: any) => {
          this.escalas = data.data;
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  limpiarModal() {
    this.setFormEscala({
      iTipoEscalaId: this.iTipoEscalaId,
    });
  }

  crearEscala() {
    this.limpiarModal();
    this.bEditar = false;
    this.visible = true;
    this.titulo = 'Nuevo tipo de escala';
  }

  editarEscala() {
    this.limpiarModal();
    this.bEditar = true;
    this.visible = true;
    this.titulo = 'Editar tipo de escala';
  }

  setFormEscala(escala: any) {
    this.formEscala.patchValue(escala);
    this.formService.validarFormulario(this.formEscala);
  }

  actualizarEscala() {
    this.logroService.actualizarEscalaCalificaciones(this.formEscala.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se actualizaron los datos correctamente.',
        });
        this.cerrarModal();
        this.listarEscalas();
      },
      error: error => {
        console.error('Error actualizando tipo de escala:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  guardarEscala() {
    this.logroService.guardarEscalaCalificaciones(this.formEscala.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se guardaron los datos correctamente.',
        });
        this.cerrarModal();
        this.listarEscalas();
      },
      error: error => {
        console.error('Error guardando tipo de escala:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  cerrarModal() {
    this.visible = false;
    this.limpiarModal();
  }

  /** Datos para la tabla de tipos de escala */

  accionBtnItem({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.editarEscala();
        this.setFormEscala(item);
        break;
      case 'escalas':
        this.router.navigate([`/tipo-escala/${item.iTipoEscalaId}/escalas`]);
        break;
    }
  }

  acciones: IActionTable[] = [
    {
      labelTooltip: 'Editar escala',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'text',
      width: '20%',
      field: 'cEscalaCalifNombre',
      header: 'Nombre',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '40%',
      field: 'cEscalaCalifDescripcion',
      header: 'Descripción',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cEscalaCalifLetra',
      header: 'Representación',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'nEscalaCalifEquivalente',
      header: 'Equivalente numérico',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
