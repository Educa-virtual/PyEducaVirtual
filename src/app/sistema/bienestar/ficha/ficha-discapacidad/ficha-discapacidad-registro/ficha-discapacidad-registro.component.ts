import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { APODERADO, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service';
import { FuncionesBienestarService } from '../../../services/funciones-bienestar.service';
import { DropdownSimpleComponent } from '../../shared/dropdown-simple/dropdown-simple.component';
import { InputSimpleComponent } from '../../shared/input-simple/input-simple.component';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-ficha-discapacidad-registro',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, DropdownSimpleComponent, InputSimpleComponent],
  templateUrl: './ficha-discapacidad-registro.component.html',
  styleUrl: './ficha-discapacidad-registro.component.scss',
})
export class FichaDiscapacidadRegistroComponent implements OnInit {
  @Input() iFichaDGId: any;
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('fileUpload') fileUpload: FileUpload;

  formDiscapacidad: FormGroup;
  discapacidades: Array<object>;

  discapacidad: any[];
  discapacidad_registrada: boolean = false;
  registro_bloqueado: boolean = true;
  hay_archivo: boolean = false;

  visible: boolean = false;
  caption: string = 'Registrar discapacidad';
  fecha_actual: Date = new Date();

  discapacidades_ficha: any[];
  discapacidades_ficha_filtradas: any[];

  perfil: any;
  iYAcadId: number;
  es_estudiante_apoderado: boolean = false;
  formLabels: any;

  archivoSeleccionado: File | null = null;

  constructor(
    private fb: FormBuilder,
    private store: LocalStoreService,
    private datosFichaBienestar: DatosFichaBienestarService,
    private funcionesBienestar: FuncionesBienestarService,
    private _messageService: MessageService,
    private _confirmService: ConfirmationModalService,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.es_estudiante_apoderado = [ESTUDIANTE, APODERADO].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    try {
      this.formDiscapacidad = this.fb.group({
        iYAcadId: [this.iYAcadId],
        iFichaDGId: [this.iFichaDGId, Validators.required],
        iDiscFichaId: [null],
        iDiscId: [null, Validators.required],
        cDiscFichaObs: [null, Validators.required],
        cDiscFichaArchivoNombre: [null],
        archivo: [null],
      });
    } catch (error) {
      console.log(error, 'error de formulario');
    }

    this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
      this.discapacidades = this.datosFichaBienestar.getDiscapacidades(data?.discapacidades);
    });

    if (this.iFichaDGId) {
      this.listarDiscapacidadesFicha();
    }

    this.funcionesBienestar.formMarkAsDirty(this.formDiscapacidad);
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    this.discapacidades_ficha_filtradas = this.discapacidades_ficha.filter((disc: any) => {
      if (disc.cDiscNombre && disc.cDiscNombre.toLowerCase().includes(filtro)) return disc;
      if (disc.cDiscObs && disc.cDiscObs.toLowerCase().includes(filtro)) return disc;
      return null;
    });
  }

  listarDiscapacidadesFicha() {
    this.datosFichaBienestar
      .listarDiscapacidadesDetalle({
        iFichaDGId: this.iFichaDGId,
      })
      .subscribe({
        next: (data: any) => {
          this.discapacidades_ficha = data.data;
          this.discapacidades_ficha_filtradas = this.discapacidades_ficha;
          this.filtrarTabla();
        },
      });
  }

  verDiscapacidadDetalle(iDiscFichaId: any) {
    this.datosFichaBienestar
      .verDiscapacidadDetalle({
        iDiscFichaId: iDiscFichaId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormDiscapacidad(data.data);
        },
        error: error => {
          console.error('Error al obtener discapacidad:', error);
        },
      });
  }

  //Maquetar tablas
  handleActions(actions) {
    console.log(actions);
  }

  clearForm() {
    this.setFormDiscapacidad(null);
    this.fileUpload.clear();
    this.archivoSeleccionado = null;
    this.hay_archivo = false;
    this.discapacidad_registrada = false;
  }

  setFormDiscapacidad(data: any) {
    this.formDiscapacidad.reset();
    this.formDiscapacidad.patchValue({
      iYAcadId: this.iYAcadId,
      iFichaDGId: this.iFichaDGId,
      iDiscFichaId: data?.iDiscFichaId ? Number(data.iDiscFichaId) : null,
      iDiscId: data?.iDiscId ? Number(data.iDiscId) : null,
      cDiscFichaObs: data?.cDiscFichaObs,
      cDiscFichaArchivoNombre: data?.cDiscFichaArchivoNombre,
    });
    this.hay_archivo = data?.cDiscFichaArchivoNombre ? true : false;
    this.discapacidad_registrada = this.formDiscapacidad.value.iDiscFichaId ? true : false;
    this.funcionesBienestar.formMarkAsDirty(this.formDiscapacidad);
    this.cf.detectChanges();
  }

  handleArchivo(event: any) {
    if (event && event?.files) {
      const file = event.files && event.files.length > 0 ? event.files[0] : null;
      this.archivoSeleccionado = file;
      this.formDiscapacidad.get('archivo').setValue(file);
      this.hay_archivo = false;
      this.formDiscapacidad.get('cDiscFichaArchivoNombre').setValue(null);
    } else {
      this.archivoSeleccionado = null;
      this.formDiscapacidad.get('archivo').setValue(null);
    }
  }

  agregarDiscapacidadDetalle() {
    this.caption = 'Registrar discapacidad';
    this.clearForm();
    this.funcionesBienestar.formMarkAsDirty(this.formDiscapacidad);
    this.visible = true;
  }

  borrarDiscapacidadDetalle(iDiscFichaId: any) {
    this.datosFichaBienestar
      .borrarDiscapacidadDetalle({
        iDiscFichaId: iDiscFichaId,
      })
      .subscribe({
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: 'Se eliminaron los datos',
          });
          this.discapacidades_ficha = this.discapacidades_ficha.filter(
            (disc: any) => disc.iDiscFichaId !== iDiscFichaId
          );
          this.discapacidades_ficha_filtradas = this.discapacidades_ficha;
        },
        error: error => {
          console.error('Error eliminando discapacidad:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  guardarDiscapacidadDetalle() {
    if (this.formDiscapacidad.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    if (this.formDiscapacidad.value.archivo === null) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe añadir un documento sustentario',
      });
      return;
    }

    const formData: FormData = new FormData();
    formData.append('iYAcadId', String(this.iYAcadId));
    formData.append('iFichaDGId', String(this.iFichaDGId));
    formData.append('iDiscId', this.formDiscapacidad.value.iDiscId);
    formData.append('cDiscFichaObs', this.formDiscapacidad.value.cDiscFichaObs);
    if (this.archivoSeleccionado) {
      formData.append('cDiscFichaArchivoNombre', null);
      formData.append('archivo', this.archivoSeleccionado);
    } else {
      formData.append(
        'cDiscFichaArchivoNombre',
        this.formDiscapacidad.value.cDiscFichaArchivoNombre
      );
    }

    this.datosFichaBienestar.guardarDiscapacidadDetalle(formData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.visible = false;
        this.listarDiscapacidadesFicha();
      },
      error: error => {
        console.error('Error guardando discapacidad:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarDiscapacidadDetalle() {
    if (this.formDiscapacidad.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    if (!this.archivoSeleccionado && !this.formDiscapacidad.value.cDiscFichaArchivoNombre) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe añadir un documento sustentario',
      });
      return;
    }

    const formData: FormData = new FormData();
    formData.append('iYAcadId', String(this.iYAcadId));
    formData.append('iFichaDGId', String(this.iFichaDGId));
    formData.append('iDiscFichaId', this.formDiscapacidad.value.iDiscFichaId);
    formData.append('iDiscId', this.formDiscapacidad.value.iDiscId);
    formData.append('cDiscFichaObs', this.formDiscapacidad.value.cDiscFichaObs);
    formData.append('cDiscFichaArchivoNombre', this.formDiscapacidad.value.cDiscFichaArchivoNombre);
    if (this.archivoSeleccionado) {
      formData.append('cDiscFichaArchivoNombre', null);
      formData.append('archivo', this.archivoSeleccionado);
    }

    this.datosFichaBienestar.actualizarDiscapacidadDetalle(formData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.visible = false;
        this.listarDiscapacidadesFicha();
      },
      error: error => {
        console.error('Error actualizando discapacidad:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  descargarArchivo(item: any = null, event = null) {
    event?.preventDefault();
    if (!item) {
      item = {
        iDiscFichaId: this.formDiscapacidad.value.iDiscFichaId,
        cDiscFichaArchivoNombre: this.formDiscapacidad.value.cDiscFichaArchivoNombre,
      };
    }
    this.datosFichaBienestar
      .descargarDiscapacidadDetalle({
        iDiscFichaId: item.iDiscFichaId,
        iYAcadId: this.iYAcadId,
        cDiscFichaArchivoNombre: item.cDiscFichaArchivoNombre,
      })
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
        },
        error: error => {
          console.error('Error descargando archivo:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'No se pudo descargar el archivo',
          });
        },
      });
  }

  salir() {
    this.clearForm();
    this.visible = false;
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.visible = true;
        this.clearForm();
        this.caption = 'Editar discapacidad';
        this.verDiscapacidadDetalle(item?.iDiscFichaId);
        break;
      case 'anular':
        this._confirmService.openConfirm({
          message: '¿Está seguro de anular el registro seleccionado?',
          header: 'Anular discapacidad',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarDiscapacidadDetalle(item?.iDiscFichaId);
          },
        });
        break;
      case 'descargar':
        this.descargarArchivo(item);
        break;
    }
  }

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Descargar sustento',
      icon: 'pi pi-download',
      accion: 'descargar',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
    },
    {
      labelTooltip: 'Borrar',
      icon: 'pi pi-trash',
      accion: 'anular',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  actionsLista: IActionTable[];

  columns = [
    {
      type: 'item',
      width: '10%',
      field: 'item',
      header: '#',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '70%',
      field: 'cDiscNombre',
      header: 'Discapcidad',
      text_header: 'left',
      text: 'left',
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
