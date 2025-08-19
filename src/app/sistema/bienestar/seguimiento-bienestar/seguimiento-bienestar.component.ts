import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DatosSeguimientoBienestarService } from '../services/datos-seguimiento-bienestar.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FuncionesBienestarService } from '../services/funciones-bienestar.service';
import { DIRECTOR_IE } from '@/app/servicios/perfilesConstantes';
import { Dropdown } from 'primeng/dropdown';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-seguimiento-bienestar',
  standalone: true,
  imports: [PrimengModule, TextFieldModule, TablePrimengComponent],
  templateUrl: './seguimiento-bienestar.component.html',
  styleUrl: './seguimiento-bienestar.component.scss',
})
export class SeguimientoBienestarComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('filtro_tipo') filtro_tipo: Dropdown;
  @ViewChild('filtro_persona') filtro_persona: ElementRef;
  @ViewChild('fileUpload') fileUpload: FileUpload;

  perfil: any;
  iYAcadId: number;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  visibleDialog: boolean = false;
  formSeguimiento: any;
  seguimientos: Array<object> = [];
  seguimientos_filtrados: Array<object> = [];
  seguimiento_registrado: boolean = false;
  seguimiento_bloqueado: boolean = false;

  visibleDialogPersona: boolean = false;
  seguimientos_persona: Array<object> = [];
  seguimientos_persona_filtrados: Array<object> = [];

  nivel_tipos: Array<object>;
  ies: Array<object>;

  es_director: boolean = false;
  longitud_documento: number = 10;
  formato_documento: string = '9999999999';
  tipos_documentos: Array<object>;

  tipos_seguimiento: Array<object>;
  SEGUIMIENTO_ESTUDIANTE: number = this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE;
  SEGUIMIENTO_DOCENTE: number = this.datosSeguimiento.SEGUIMIENTO_DOCENTE;
  SEGUIMIENTO_DIRECTIVO: number = this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO;

  prioridades: Array<object>;
  PRIORIDAD_NORMAL: number = this.datosSeguimiento.PRIORIDAD_NORMAL;
  PRIORIDAD_ALERTA: number = this.datosSeguimiento.PRIORIDAD_ALERTA;
  PRIORIDAD_URGENTE: number = this.datosSeguimiento.PRIORIDAD_URGENTE;

  fases: Array<object>;
  FASE_ATENDIDO: number = this.datosSeguimiento.FASE_ATENDIDO;
  FASE_PENDIENTE: number = this.datosSeguimiento.FASE_PENDIENTE;
  FASE_DERIVADO: number = this.datosSeguimiento.FASE_DERIVADO;

  archivoSeleccionado: File | null = null;
  fecha_actual: Date = new Date();

  private _confirmService = inject(ConfirmationModalService);
  private _messageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private store: LocalStoreService,
    private datosSeguimiento: DatosSeguimientoBienestarService,
    private funcionesBienestar: FuncionesBienestarService,
    private cf: ChangeDetectorRef
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.es_director = Number(this.perfil.iPerfilId) === Number(DIRECTOR_IE);
    this.breadCrumbItems = [
      {
        label: 'Bienestar Social',
      },
      {
        label: 'Seguimiento de bienestar',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    this.formSeguimiento = this.fb.group({
      iCredEntPerfId: [this.perfil.iCredEntPerfId],
      iYAcadId: [this.iYAcadId],
      iNivelTipoId: [null, Validators.required],
      iSedeId: [null, Validators.required],
      iSeguimId: [null],
      iPersId: [null, Validators.required],
      iMatrId: [null],
      iPersIeId: [null],
      iTipoSeguimId: [null, Validators.required],
      iPrioridad: [null, Validators.required],
      iFase: [null],
      dSeguimFecha: [null, Validators.required],
      archivo: [null, Validators.required],
      cSeguimDescripcion: [null],
      cSeguimArchivo: [null],
      cInstitucionDatos: [null],
      iTipoIdentId: [null, Validators.required],
      cPersDocumento: [null, Validators.required],
      cPersDatos: [null],
    });

    this.tipos_seguimiento = this.datosSeguimiento.getTiposSeguimiento();
    this.prioridades = this.datosSeguimiento.getPrioridades();
    this.fases = this.datosSeguimiento.getFases();

    this.datosSeguimiento
      .getSeguimientoParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.nivel_tipos = this.datosSeguimiento.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.datosSeguimiento.getInstitucionesEducativas(data?.instituciones_educativas);
        this.tipos_documentos = this.datosSeguimiento.getTiposDocumentos(data?.tipos_documentos);
      });

    this.formSeguimiento.get('iNivelTipoId').valueChanges.subscribe(() => {
      this.formSeguimiento.get('iSedeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
      if (this.es_director) {
        const ie = this.ies && this.ies.length > 0 ? this.ies[0]['value'] : null;
        this.formSeguimiento.get('iSedeId')?.setValue(ie);
      }
    });

    this.formSeguimiento.get('iTipoIdentId').valueChanges.subscribe(value => {
      const tipo_doc = this.tipos_documentos.find((item: any) => item.value === value);
      if (tipo_doc) {
        const longitud = this.formSeguimiento.get('cPersDocumento')?.value;
        if (longitud && longitud.length > tipo_doc['longitud']) {
          this.formSeguimiento.get('cPersDocumento').setValue(null);
        }
        this.longitud_documento = tipo_doc['longitud'];
        this.formato_documento = '9'.repeat(this.longitud_documento);
      }
    });

    this.formSeguimiento.get('iTipoSeguimId').valueChanges.subscribe(value => {
      this.obtenerTiposDocumento(value);
    });
    this.listarSeguimientos();
  }

  listarSeguimientos() {
    this.datosSeguimiento
      .listarSeguimientos({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data.length > 0) {
            this.seguimientos = data.data;
            this.filtrarTabla();
          } else {
            this.seguimientos = null;
            this.seguimientos_filtrados = null;
          }
        },
        error: error => {
          console.error('Error obteniendo seguimientos:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  obtenerTiposDocumento(tipo_seguimiento: any) {
    this.tipos_documentos = this.tipos_documentos.filter((doc: any) => {
      return doc.value !== 0;
    });
    if (tipo_seguimiento === this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE) {
      this.tipos_documentos.unshift({
        value: 0,
        label: 'CODIGO DE ESTUDIANTE',
        longitud: 15,
      });
    }
  }

  filterInstitucionesEducativas() {
    const iNivelTipoId = this.formSeguimiento.get('iNivelTipoId')?.value;
    this.ies = this.datosSeguimiento.filterInstitucionesEducativas(iNivelTipoId);
  }

  agregarSeguimiento() {
    this.visibleDialog = true;
    this.seguimiento_bloqueado = false;
    this.seguimiento_registrado = false;
    this.setFormSeguimiento(null);
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    const filtro_tipo = this.filtro_tipo?.value;
    this.seguimientos_filtrados = this.seguimientos.filter((seguimiento: any) => {
      if (
        !filtro_tipo ||
        (seguimiento?.iTipoSeguimId && Number(seguimiento?.iTipoSeguimId) === Number(filtro_tipo))
      ) {
        if (
          seguimiento?.cPersDocumento &&
          seguimiento?.cPersDocumento.toLowerCase().includes(filtro)
        )
          return seguimiento;
        if (
          seguimiento?.cPersNombreApellidos &&
          seguimiento?.cPersNombreApellidos.toLowerCase().includes(filtro)
        )
          return seguimiento;
        if (
          seguimiento?.dSeguimFechaUltima &&
          seguimiento?.dSeguimFechaUltima.toLowerCase().includes(filtro)
        )
          return seguimiento;
      }
      return null;
    });
  }

  filtrarTablaPersona() {
    const filtro_persona = this.filtro_persona.nativeElement.value.toLowerCase();
    this.seguimientos_persona_filtrados = this.seguimientos_persona.filter((seguimiento: any) => {
      if (
        seguimiento?.dSeguimFecha &&
        seguimiento?.dSeguimFecha.toLowerCase().includes(filtro_persona)
      )
        return seguimiento;
      if (
        seguimiento?.cSeguimPrioridad &&
        seguimiento?.cSeguimPrioridad.toLowerCase().includes(filtro_persona)
      )
        return seguimiento;
      if (
        seguimiento?.cIieeNombre &&
        seguimiento?.cIieeNombre.toLowerCase().includes(filtro_persona)
      )
        return seguimiento;
      return null;
    });
  }

  verSeguimiento(item: any) {
    this.datosSeguimiento
      .verSeguimiento({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iSeguimId: item.iSeguimId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.setFormSeguimiento(data.data);
          } else {
            this.setFormSeguimiento(null);
          }
        },
        error: error => {
          console.error('Error obteniendo seguimiento:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setFormSeguimiento(data: any) {
    let datos_persona: string = '';
    switch (Number(data?.iTipoSeguimId)) {
      case this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE:
        datos_persona = data
          ? data?.cPersNombreApellidos +
            ' (' +
            data?.cGradoNombre +
            ' ' +
            data?.cSeccionNombre +
            ')'
          : null;
        break;
      case this.datosSeguimiento.SEGUIMIENTO_DOCENTE:
      case this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO:
        datos_persona = data ? data?.cPersNombreApellidos : null;
        break;
    }

    this.formSeguimiento.reset();
    this.formSeguimiento.patchValue({
      iCredEntPerfId: this.perfil.iCredEntPerfId,
      iYAcadId: data ? Number(data?.iYAcadId) : this.iYAcadId,
      iSeguimId: data ? data?.iSeguimId : null,
      iPersId: data ? data?.iPersId : null,
      iTipoSeguimId: data ? Number(data?.iTipoSeguimId) : null,
      iPrioridad: data ? Number(data?.iPrioridad) : null,
      iFase: data ? Number(data?.iFase) : null,
      dSeguimFecha: data ? this.funcionesBienestar.formaterarFormFecha(data?.dSeguimFecha) : null,
      cSeguimArchivo: data ? data?.cSeguimArchivo : null,
      cSeguimDescripcion: data ? data?.cSeguimDescripcion : null,
      iTipoIdentId: data ? Number(data?.iTipoIdentId) : null,
      cPersDocumento: data ? data?.cPersDocumento : null,
      cPersDatos: datos_persona,
      iNivelTipoId: data ? Number(data?.iNivelTipoId) : null,
    });
    this.datosSeguimiento.filterInstitucionesEducativas(data?.iNivelTipoId);
    this.formSeguimiento.patchValue({
      iSedeId: data?.value,
    });
    this.formSeguimiento.get('cPersDocumento').setValue(data?.cPersDocumento);
    this.seguimiento_registrado = this.formSeguimiento.value.iSeguimId ? true : false;
    this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento);
    if (this.seguimiento_bloqueado) {
      this.formSeguimiento.disable();
    } else {
      this.formSeguimiento.enable();
    }
    this.cf.detectChanges();
  }

  buscarPersona() {
    if (
      this.formSeguimiento.value.iTipoSeguimId === null ||
      this.formSeguimiento.value.iNivelTipoId === null ||
      this.formSeguimiento.value.iSedeId === null ||
      this.formSeguimiento.value.iTipoIdentId === null ||
      this.formSeguimiento.value.cPersDocumento === null
    ) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe indicar el tipo de seguimiento, la sede y el documento de la persona',
      });
      this.formSeguimiento.get('iTipoSeguimId').markAsDirty();
      this.formSeguimiento.get('iNivelTipoId').markAsDirty();
      this.formSeguimiento.get('iSedeId').markAsDirty();
      this.formSeguimiento.get('iTipoIdentId').markAsDirty();
      this.formSeguimiento.get('cPersDocumento').markAsDirty();
      return;
    }
    const tipo_doc = Number(this.formSeguimiento.value.iTipoIdentId);
    this.datosSeguimiento
      .verDatosPersona({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iSedeId: this.formSeguimiento.value.iSedeId,
        iTipoPers: this.formSeguimiento.value.iTipoSeguimId,
        cEstCodigo: tipo_doc === 0 ? this.formSeguimiento.value.cPersDocumento : null,
        iTipoIdentId: this.formSeguimiento.value.iTipoIdentId,
        cPersDocumento: this.formSeguimiento.value.cPersDocumento,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            let datos_persona: string = '';
            switch (this.formSeguimiento.value.iTipoSeguimId) {
              case this.datosSeguimiento.SEGUIMIENTO_ESTUDIANTE:
                datos_persona = data.data
                  ? data.data?.cPersNombreApellidos +
                    ' (' +
                    data.data?.cGradoNombre +
                    ' ' +
                    data.data?.cSeccionNombre +
                    ')'
                  : null;
                break;
              case this.datosSeguimiento.SEGUIMIENTO_DOCENTE:
              case this.datosSeguimiento.SEGUIMIENTO_DIRECTIVO:
                datos_persona = data.data ? data.data?.cPersNombreApellidos : null;
                break;
            }
            this.formSeguimiento.patchValue({
              cPersDatos: datos_persona,
              iPersId: data.data?.iPersId ?? null,
              iMatrId: data.data?.iMatrId ?? null,
              iPersIeId: data.data?.iPersIeId ?? null,
            });
          } else {
            this.formSeguimiento.patchValue({
              iPersId: null,
              cPersDatos: null,
              iMatrId: null,
              iPersIeId: null,
            });
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se encontró la persona',
            });
          }
        },
        error: error => {
          this.formSeguimiento.patchValue({
            iPersId: null,
            cPersDatos: null,
            iMatrId: null,
            iPersIeId: null,
          });
          console.error('Error obteniendo datos de la persona:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  handleArchivo(event: any) {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (file) {
      this.archivoSeleccionado = file;
      this.formSeguimiento.get('archivo').setValue(file);
    } else {
      this.archivoSeleccionado = null;
      this.formSeguimiento.get('archivo').setValue(null);
    }
  }

  guardarSeguimiento() {
    if (this.formSeguimiento.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos y cargar un archivo PDF',
      });
      this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento);
      return;
    }

    const formData: FormData = new FormData();
    formData.append('iCredEntPerfId', this.perfil.iCredEntPerfId);
    formData.append('iYAcadId', String(this.iYAcadId));
    formData.append('iNivelTipoId', this.formSeguimiento.value.iNivelTipoId);
    formData.append('iSedeId', this.formSeguimiento.value.iSedeId);
    formData.append('iPersId', this.formSeguimiento.value.iPersId);
    formData.append('iMatrId', this.formSeguimiento.value.iMatrId);
    formData.append('iPersIeId', this.formSeguimiento.value.iPersIeId);
    formData.append('iTipoSeguimId', this.formSeguimiento.value.iTipoSeguimId);
    formData.append('iPrioridad', this.formSeguimiento.value.iPrioridad);
    formData.append('iFase', this.formSeguimiento.value.iFase);
    formData.append('dSeguimFecha', this.formSeguimiento.value.dSeguimFecha);
    formData.append('cSeguimDescripcion', this.formSeguimiento.value.cSeguimDescripcion);
    formData.append('iTipoIdentId', this.formSeguimiento.value.iTipoIdentId);
    formData.append('cPersDocumento', this.formSeguimiento.value.cPersDocumento);
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.archivoSeleccionado);
    }

    this.datosSeguimiento.guardarSeguimiento(formData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.visibleDialog = false;
        this.listarSeguimientos();
      },
      error: error => {
        console.error('Error guardando seguimiento:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al guardar datos',
        });
      },
    });
  }

  actualizarSeguimiento() {
    if (this.formSeguimiento.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.funcionesBienestar.formMarkAsDirty(this.formSeguimiento);
      return;
    }
    this.datosSeguimiento.actualizarSeguimiento(this.formSeguimiento.value).subscribe({
      next: (data: any) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Atualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        if (this.archivoSeleccionado) {
          this.actualizarArchivo(data.data?.iSeguimId);
        }
        this.visibleDialog = false;
      },
      error: error => {
        console.error('Error actualizando seguimiento:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al actualizar datos',
        });
      },
    });
  }

  actualizarArchivo(iSeguimId: any) {
    const formData: FormData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('iSeguimId', iSeguimId);
    formData.append('iCredEntPerfId', this.perfil.iCredEntPerfId);
    this.datosSeguimiento.actualizarSeguimientoArchivo(formData).subscribe({
      next: () => {
        this.listarSeguimientos();
      },
      error: error => {
        console.error('Error subiendo archivo:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al subir archivo',
        });
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  verHistorialSeguimiento(item: any): void {
    this.seguimientos_persona_filtrados = null;
    this.seguimientos_persona = null;
    this.datosSeguimiento
      .verSeguimientosPersona({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iPersId: item.iPersId,
        iTipoSeguimId: item.iTipoSeguimId,
      })
      .subscribe({
        next: (data: any) => {
          this.seguimientos_persona = data.data;
          this.filtrarTablaPersona();
        },
        error: error => {
          console.error('Error obteniendo historial de seguimiento:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  descargarSeguimiento(item: any = null) {
    if (!item) {
      item.iSeguimId = this.formSeguimiento.value.iSeguimId;
      item.cSeguimArchivo = this.formSeguimiento.value.cSeguimArchivo;
    }
    this.datosSeguimiento
      .descargarSeguimiento({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iSeguimId: item.iSeguimId,
        cSeguimArchivo: item.cSeguimArchivo,
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

  clearForm() {
    this.setFormSeguimiento(null);
    this.fileUpload.clear();
    this.archivoSeleccionado = null;
    this.seguimiento_registrado = false;
    this.seguimiento_bloqueado = false;
  }

  borrarSeguimiento(item: any) {
    this.datosSeguimiento
      .borrarSeguimiento({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iSeguimId: item.iSeguimId,
      })
      .subscribe({
        next: (data: any) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Eliminación exitosa',
            detail: 'Se eliminaron los datos',
          });
          if (data.data) {
            this.seguimientos_persona = this.seguimientos_persona.filter(
              (seguimiento: any) => item.iSeguimId != seguimiento.iSeguimId
            );
            this.filtrarTablaPersona();
            if (this.seguimientos_persona.length === 0) {
              this.salirHistorial();
              this.listarSeguimientos();
            }
          }
        },
      });
  }

  salirHistorial() {
    this.seguimientos_persona = null;
    this.seguimientos_persona_filtrados = null;
    this.visibleDialogPersona = false;
  }

  salir() {
    this.clearForm();
    this.visibleDialog = false;
  }

  accionBnt({ accion, item }) {
    switch (accion) {
      case 'seguimiento':
        this.visibleDialogPersona = true;
        this.verHistorialSeguimiento(item);
        break;
      case 'editar':
        this.visibleDialog = true;
        this.seguimiento_bloqueado = false;
        this.verSeguimiento(item);
        break;
      case 'ver':
        this.visibleDialog = true;
        this.seguimiento_bloqueado = true;
        this.verSeguimiento(item);
        break;
      case 'descargar':
        this.descargarSeguimiento(item);
        break;
      case 'borrar':
        this._confirmService.openConfirm({
          header: '¿Realmente desea eliminar el seguimiento seleccionado?',
          accept: () => {
            this.borrarSeguimiento(item);
          },
        });
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Seguimiento',
      icon: 'pi pi-folder-open',
      accion: 'seguimiento',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  public columnasTabla: IColumn[] = [
    {
      field: 'item',
      header: 'N°',
      type: 'item',
      width: '5%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cTipoSeguimNombre',
      header: 'Tipo',
      type: 'text',
      width: '15%',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cPersDocumento',
      header: 'Documento',
      type: 'text',
      width: '15%',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cPersNombreApellidos',
      header: 'Nombres',
      type: 'text',
      width: '40%',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'dSeguimFechaUltima',
      header: 'Actualizado en',
      type: 'date',
      width: '15%',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  public accionesTablaPersona: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'borrar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
    {
      labelTooltip: 'Descargar ficha',
      icon: 'pi pi-download',
      accion: 'descargar',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
    },
    {
      labelTooltip: 'Ver seguimiento',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];

  public columnasTablaPersona: IColumn[] = [
    {
      field: 'item',
      header: 'N°',
      type: 'item',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'dSeguimFecha',
      header: 'Fecha',
      type: 'date',
      width: '10%',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cSeguimPrioridad',
      header: 'Prioridad',
      type: 'tag',
      width: '10%',
      text_header: 'center',
      text: 'center',
      styles: {
        NORMAL: 'success',
        ALERTA: 'warning',
        URGENTE: 'danger',
      },
    },
    {
      field: 'cSeguimDescripcion',
      header: 'Descripción',
      type: 'text',
      width: '30%',
      text_header: 'left',
      text: 'left',
    },
    {
      field: 'cIieeNombre',
      header: 'Institución',
      type: 'text',
      width: '30%',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
