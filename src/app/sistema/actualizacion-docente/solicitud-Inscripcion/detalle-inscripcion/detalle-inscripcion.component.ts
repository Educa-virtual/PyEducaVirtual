import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { CapacitacionesServiceService } from '@/app/servicios/cap/capacitaciones-service.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposIdentificacionesService } from '@/app/servicios/grl/tipos-identificaciones.service';
import { Message, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-detalle-inscripcion',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    ContainerPageComponent,
    ModalPrimengComponent,
    FileUploadModule,
  ],
  templateUrl: './detalle-inscripcion.component.html',
  styleUrl: './detalle-inscripcion.component.scss',
})
export class DetalleInscripcionComponent implements OnInit {
  @Input() id!: string;
  @Output() volver = new EventEmitter<void>();

  private _formBuilder = inject(FormBuilder);
  private _capService = inject(CapacitacionesServiceService);
  private _ConstantesService = inject(ConstantesService);
  private _TiposIdentificacionesService = inject(TiposIdentificacionesService);
  private _constantesService = inject(ConstantesService);
  private GeneralService = inject(GeneralService);

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

  public formIncripcion: FormGroup = this._formBuilder.group({
    iTipoIdentId: ['', [Validators.required]],
    dni: ['', [Validators.required]],
    cPersNombre: ['', [Validators.required]],
    cPersPaterno: ['', [Validators.required]],
    cPersMaterno: ['', [Validators.required]],
    cPersDomicilio: ['', [Validators.required]],
    cInscripCorreo: ['', [Validators.required]],
    cInscripCel: ['', [Validators.required]],
    cIieeNombre: ['', [Validators.required]],
    cVoucher: ['', [Validators.required]],
  });
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.obtenerSolicitudesXCurso();
    this.obtenerTipoIdentificaciones();
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
    // {
    //     labelTooltip: 'Aceptar ',
    //     icon: 'pi pi-check-circle',
    //     accion: 'aceptar',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-succes p-button-text',
    //     // isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
    // },
    // {
    //     labelTooltip: 'Denegar',
    //     icon: 'pi pi-times-circle',
    //     accion: 'denegar',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-danger p-button-text',
    //     // isVisible: (row) => row.iEstado === '1',
    // },
    // {
    //     labelTooltip: 'Comprobante',
    //     icon: 'pi pi-file-pdf',
    //     accion: 'mostrarComprobante',
    //     type: 'item',
    //     class: 'p-button-rounded p-button-danger p-button-text',
    //     // isVisible: (row) => row.iEstado === '1',
    // },
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
  mostrarVoucher(voucher: any) {
    this.alumnoSelect = voucher;
    this.nombreAlumno = voucher.cPersNombre;
    console.log(this.alumnoSelect);
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
    this._capService.listarInscripcionxcurso(data).subscribe({
      next: (res: any) => {
        this.alumnos = res['data'];
        console.log('datos del Alumnos incritos', this.alumnos);
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
      this.messageService.add({
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
      console.log('guardar');

      // Validar el tipo de documento
      switch (idtipoDocumento) {
        case 1: // DNI
          this.formIncripcion
            .get('dni')
            ?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
          if (!dni || dni.toString().length !== 8) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ingrese un DNI válido de 8 dígitos numéricos',
            });
            return;
          } else {
            // Obtner datos para buscar la persona
            const data = {
              iTipoIdentId: idtipoDocumento,
              iPersId: '',
              cPersDocumento: dni,
            };
            const params = {
              petition: 'post',
              group: 'cap',
              prefix: 'inscripciones',
              ruta: 'persona-inscripcion',
              data: data,
              params: {
                iCredId: this._constantesService.iCredId,
              },
            };
            // Servicio para buscar la persona
            this.GeneralService.getGralPrefixx(params).subscribe((Data: any) => {
              // this.persona = (Data as any)['data']
              this.persona = Data.data; // ← Accede al primer objeto del array "data"
              this.instituciones = Data.instituciones || []; // ← Asigna el segundo array
              // console.log('Datos persona:', this.persona);
              // console.log('Otra data:', this.instituciones);
              // Aquí actualizas el nombre en el formulario
              this.formIncripcion.patchValue({
                cPersNombre: this.persona.cPersNombre,
                cPersPaterno: this.persona.cPersPaterno,
                cPersMaterno: this.persona.cPersMaterno,
                cPersDomicilio: this.persona.cPersDomicilio,
                // nombreLargo: `${this.persona.cPersPaterno} ${this.persona.cPersMaterno} ${this.persona.cPersNombre}`,
              });
            });
          }

          break;
        case 2: // RUC
          console.log('RUC');
          break;
      }
    }
  }
  instituciones: any[] = []; // Datos de instituciones educativas

  // metodo para subir el archivo
  onUpload(event: any) {
    const file = event.files?.[0];

    if (file) {
      console.log('File uploaded:', file.name);
    }

    this.formIncripcion.patchValue({
      cVoucher: event.files,
    });

    const data = this.formIncripcion.value;
    console.log('guardar:', data);

    this.messageService.add({
      severity: 'success',
      summary: 'Archivo cargado',
      detail: '',
    });
  }
  // metodo para guardar inscripción
  guardarInscripcion() {
    const datos = this.formIncripcion.value;
    const data = {
      iCapacitacionId: this.datosCurso.iCapacitacionId,
      iPersId: this.persona.iPersId,
      cInscripCorreo: datos.cInscripCorreo,
      cInscripCel: datos.cInscripCel,
      iIieeId: datos.cIieeNombre, // Institución Educativa ID
      iCredId: this._constantesService.iCredId, // Credencial ID
      cVoucher: 'noGuarda_DX.png', // Nombre del archivo
    };
    // console.log('datos de guardar', data)
    // /cap/inscripciones/inscripcion`,
    const params = {
      petition: 'post',
      group: 'cap',
      prefix: 'inscripciones',
      ruta: 'inscripcion',
      data: data,
      params: { iCredId: this._constantesService.iCredId },
    };
    console.log('datos a guardar', params);
    // Servicio para buscar la persona
    this.GeneralService.getGralPrefixx(params).subscribe(Data => {
      const response = (Data as any)['data'];
      console.log(response);
      this.formIncripcion.reset();
      this.showModalInscripcion = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Inscripción exitosa',
      });
    });
  }
  // obtener tipo de documentación
  obtenerTipoIdentificaciones(): void {
    this._TiposIdentificacionesService.obtenerTipoIdentificaciones().subscribe({
      next: (response: any) => {
        this.tiposIdentificaciones = response.data;
        // console.log('tipodedato', this.tiposIdentificaciones)
      },
      error: error => {
        console.error('Error al obtener tipos de identificaciones:', error);
      },
    });
  }
  // mostrar el modal para inscribir en el curso desde administrador
  mostrarInscripcion() {
    this.showModalInscripcion = true;

    this.tituloCurso = [
      {
        severity: 'info',
        detail: 'Título del curso: ' + this.datosCurso.cCapTitulo,
        // life: 5000,
      },
    ];
  }
}
