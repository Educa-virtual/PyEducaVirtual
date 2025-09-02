import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, inject, Input, OnInit, Output, OnChanges } from '@angular/core';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { CapacitacionesService } from '@/app/servicios/cap/capacitaciones.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposIdentificacionesService } from '@/app/servicios/grl/tipos-identificaciones.service';
import { Message, MessageService } from 'primeng/api';
import { InscripcionesService } from '@/app/servicios/cap/inscripciones.service';
import { SubirArchivoComponent } from '@/app/shared/subir-archivo/subir-archivo.component';
import { environment } from '@/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-inscripcion',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent, SubirArchivoComponent],
  templateUrl: './detalle-inscripcion.component.html',
  styleUrl: './detalle-inscripcion.component.scss',
})
export class DetalleInscripcionComponent implements OnInit, OnChanges {
  @Input() id!: string;
  @Output() volver = new EventEmitter<void>();

  private _formBuilder = inject(FormBuilder);
  private _CapacitacionesService = inject(CapacitacionesService);
  private _ConstantesService = inject(ConstantesService);
  private _TiposIdentificacionesService = inject(TiposIdentificacionesService);
  private _constantesService = inject(ConstantesService);
  private _InscripcionesService = inject(InscripcionesService);
  private _MessageService = inject(MessageService);

  alumnos: any[];
  showModal: boolean = false;
  loading: boolean = false;
  showModalInscripcion: boolean = false;
  alumnoSelect: any;
  nombreAlumno: string;
  tiposIdentificaciones: any[] = [];
  persona: any; // variable para guardar al buscar dni
  uploadedFiles: any[] = [];
  datosCurso: any; // variable para guardar los datos del curso
  tituloCurso: Message[] = [];
  archivos = [];
  loadingFormulario: boolean = false;
  nombreCurso: string = '';
  pdfURL: SafeResourceUrl | null = null;

  public formIncripcion: FormGroup = this._formBuilder.group({
    iTipoIdentId: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    cPersNombre: ['', [Validators.required]],
    cPersPaterno: ['', [Validators.required]],
    cPersMaterno: ['', [Validators.required]],
    cPersDomicilio: ['', [Validators.required]],
    cInscripCorreo: ['', [Validators.required, Validators.email]],
    cInscripCel: ['', [Validators.required]],
    cIieeNombre: ['', [Validators.required]],
    cVoucher: [''],
    iPersId: [''],
  });
  constructor(private sanitizer: DomSanitizer) {}

  // changes
  ngOnChanges() {
    // console.log(changes);
    this.formIncripcion.reset();
  }
  ngOnInit(): void {
    this.obtenerSolicitudesXCurso();
    this.obtenerTipoIdentificaciones();

    this.nombreCurso = this.datosCurso.cCapTitulo;
  }
  // mostrar los headr de las tablas
  public columnasTabla: IColumn[] = [
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cNombresCompleto',
      header: 'Apellidos y Nombre',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'item-checkList',
      width: '2rem',
      field: 'iDocente',
      header: '¿Es Docente?',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cPersDocumento',
      header: 'DNI/CE',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cInscripCel',
      header: 'Celular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'item-innerHtml',
      width: '4rem',
      field: 'cEstado',
      header: 'Estado Solicitud',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '1rem',
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  // mostrar los botones de la tabla
  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Ver Solicitud',
      icon: 'pi pi-eye',
      accion: 'verSolicitud',
      type: 'item',
      class: 'p-button-rounded p-button-info p-button-text',
      // isVisible: (row) => row.iEstado === '1',
    },
  ];

  actionsContainer = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Regresar',
      text: 'Regresar',
      icon: 'pi pi-undo',
      accion: 'regresar',
      class: 'p-button-secondary',
    },
  ];

  // asignar la accion a los botones de la tabla
  accionBnt({ accion, item }): void {
    switch (accion) {
      case 'cerrar':
        this.showModal = false;
        break;
      case 'aceptar':
        console.log(item);
        // this.modoFormulario = 'editar'
        // this.iCapacitacionId = item.iCapacitacionId
        // // console.log('Editar', item)
        // this.formNuevaCapacitacion.patchValue(item)
        // // this.selectedItems = []
        // // this.selectedItems = [item]
        break;
      case 'denegar':
        // this.eliminarCapacitacion(item)
        break;
      case 'mostrarComprobante':
      case 'verSolicitud':
        this.verPdf(item);
        this.mostrarVoucher(item);
        break;
      case 'regresar':
        this.regresar();
        break;
      case 'agregar':
        this.mostrarInscripcion();
        break;
    }
  }
  cerrar() {
    this.showModal = false;
  }
  mostrarVoucher(voucher: any) {
    this.alumnoSelect = voucher;
    this.nombreAlumno = voucher.cPersNombre;
    this.showModal = true;
  }

  // obtener las solicitudes del curso
  obtenerSolicitudesXCurso() {
    this.datosCurso = this.id;
    const iCredId = this._ConstantesService.iCredId;
    const data = {
      iCapacitacionId: this.datosCurso.iCapacitacionId,
      iCredId: iCredId,
    };
    this._CapacitacionesService.listarInscripcionxcurso(data).subscribe({
      next: (res: any) => {
        this.alumnos = res['data'];
      },
    });
  }
  regresar() {
    this.volver.emit();
  }
  // metodo para buscar x dni
  buscarDni() {
    const idtipoDocumento = Number(this.formIncripcion.get('iTipoIdentId')?.value);
    const dni = this.formIncripcion.get('dni')?.value;

    if (!idtipoDocumento) {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un tipo de documento',
      });
    } else {
      // cargar los datos
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
      }, 2000);

      // Validar el tipo de documento
      switch (idtipoDocumento) {
        case 1: // DNI
          this.formIncripcion
            .get('dni')
            ?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
          if (!dni || dni.toString().length !== 8) {
            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ingrese un DNI válido de 8 dígitos numéricos',
            });
            return;
          } else {
            // Obtner datos para buscar la persona
            const params = {
              iCredId: this._ConstantesService.iCredId,
            };
            this._InscripcionesService
              .buscarPersonaInscripcionxiCapacitacionId(
                this.datosCurso.iCapacitacionId,
                idtipoDocumento,
                dni,
                params
              )
              .subscribe({
                next: resp => {
                  if (resp.validated) {
                    const data = resp.data;
                    this.formIncripcion.patchValue({
                      cPersNombre: data.cPersNombre,
                      cPersPaterno: data.cPersPaterno,
                      cPersMaterno: data.cPersMaterno,
                      cPersDomicilio: data.cPersDomicilio,
                      cInscripCorreo: data.cPersCorreo,
                      cInscripCel: data.cPersCel,
                      iPersId: data.iPersId,
                    });
                    this.instituciones = resp.instituciones;
                  } else {
                    this.mostrarMensajeToast({
                      severity: 'warning',
                      summary: '¡Atención!',
                      detail: resp.message,
                    });
                  }
                },
                error: error => {
                  const errores = error?.error?.errors;
                  if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach(campo => {
                      errores[campo].forEach((mensaje: string) => {
                        this.mostrarMensajeToast({
                          severity: 'error',
                          summary: 'Error de validación',
                          detail: mensaje,
                        });
                      });
                    });
                  } else {
                    // Error genérico si no hay errores específicos
                    this.mostrarMensajeToast({
                      severity: 'error',
                      summary: 'Error',
                      detail: error?.error?.message || 'Ocurrió un error inesperado',
                    });
                  }
                },
              });
          }
          break;
      }
    }
  }
  instituciones: any[] = []; // Datos de instituciones educativas

  // metodo para guardar inscripción
  guardarInscripcion() {
    if (this.loadingFormulario) return; // evitar doble clic
    this.loadingFormulario = true;

    const datos = this.formIncripcion.value;
    const data = {
      iCapacitacionId: this.datosCurso.iCapacitacionId,
      iPersId: datos.iPersId,
      cInscripCorreo: datos.cInscripCorreo,
      cInscripCel: datos.cInscripCel,
      iIieeId: datos.cIieeNombre, // Institución Educativa ID
      iCredId: this._constantesService.iCredId, // Credencial ID
      cVoucher: datos.cVoucher, // Nombre del archivo
      iTipoIdentId: datos.iTipoIdentId,
      cPersDocumento: datos.dni,
      cPersNombre: datos.cPersNombre,
      cPersPaterno: datos.cPersPaterno,
      cPersMaterno: datos.cPersMaterno,
      cPersDomicilio: datos.cPersDomicilio,
    };

    this._InscripcionesService.guardarInscripcion(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerSolicitudesXCurso();
          this.showModalInscripcion = false;
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          setTimeout(() => {
            this.showModalInscripcion = false;
          }, 2000);
        }
        this.loadingFormulario = false;
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
        this.loadingFormulario = false;
      },
    });
  }
  // obtener tipo de documentación
  obtenerTipoIdentificaciones(): void {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._TiposIdentificacionesService.obtenerTipoIdentificaciones(params).subscribe({
      next: (response: any) => {
        const data = response.data;
        if (data.length > 0) {
          this.formIncripcion.get('iTipoIdentId')?.setValue(data[0].iTipoIdentId);
        }
        this.tiposIdentificaciones = data.length ? [data[0]] : [];
      },
      error: error => {
        this.mostrarMensajeToast({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error || 'Ocurrió un error inesperado',
        });
      },
    });
  }
  // mostrar el modal para inscribir en el curso desde administrador
  mostrarInscripcion() {
    this.formIncripcion.reset();
    this.archivos = [];
    if (this.tiposIdentificaciones.length > 0) {
      this.formIncripcion.get('iTipoIdentId')?.setValue(this.tiposIdentificaciones[0].iTipoIdentId);
    }
    this.showModalInscripcion = true;
    this.tituloCurso = [
      {
        severity: 'info',
        detail: 'Título del curso: ' + this.datosCurso.cCapTitulo,
        // life: 5000,
      },
    ];
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
  obtenerArchivo(file) {
    const documentos = file[0]['path'];
    if (documentos.validated) {
      this.formIncripcion.patchValue({
        cVoucher: documentos.data,
      });
    } else {
      console.log('no tiene comprobante');
    }
  }

  // función para aprobar las inscripciones
  aprobarInscripcion(datos: any) {
    // console.log(datos)
    const iInscripId = datos.iInscripId;
    const data = {
      bEstado: true,
      iCredId: this._ConstantesService.iCredId,
    };
    this._InscripcionesService.aprobarInscripcion(iInscripId, data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.showModal = false;
          this.obtenerSolicitudesXCurso();
        }
      },
    });
  }
  // Función para denegar las inscripcion del estudiante
  denegarIncripcion(datos: any) {
    const iInscripId = datos.iInscripId;
    const data = {
      bEstado: false,
      iCredId: this._ConstantesService.iCredId,
    };
    this._InscripcionesService.aprobarInscripcion(iInscripId, data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.showModal = false;
          this.obtenerSolicitudesXCurso();
        }
      },
    });
  }

  // Función para visualizar el comprobante
  verPdf(data: any) {
    // console.log('data de pdf',data)
    const rutaRelativa = data.cVoucher;
    const baseURL = environment.backend + '/'; // cambia por tu URL real si estás en producción
    const url = baseURL + rutaRelativa;

    this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
