import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';
import { DatosEstudianteService } from '@/app/sistema/gestion-institucional/services/datos-estudiante-service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

@Component({
  selector: 'app-matricula-apoderado',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './matricula-apoderado.component.html',
  styleUrl: './matricula-apoderado.component.scss',
})
export class MatriculaApoderadoComponent implements OnChanges, OnInit {
  frmApoderado: FormGroup;
  form: FormGroup;
  @Input() iEstudianteId: number = 0;
  @Input() iCredId: number = 0;
  @Input() soloLectura: boolean = false;

  @Input() estudiante: any;
  // @Input() caption: string = 'Historial de Apoderados';

  selectedItems = [];
  apoderados: any[] = [];
  tipos_familiar: any[] = [];
  apoderado: any = {};
  bDocumentoValido: boolean = false;

  mensaje: string = '';
  sever: string = 'default';

  //validar se es edicion
  bEditar: boolean = false;

  //variables para registrar personas
  tipos_familiares: Array<object>;
  tipos_documentos: Array<object>;
  estados_civiles: Array<object>;
  sexos: Array<object>;
  nacionalidades: Array<object>;
  departamentos: Array<object>;
  provincias: Array<object>;
  distritos: Array<object>;
  lenguas: Array<object>;
  tipos_contacto: Array<object>;
  apoderado_registrado: boolean = false;
  longitud_documento: number;
  formato_documento: string = '99999999';
  es_peruano: boolean = true;
  documento_consultable: boolean = true;

  actions: IActionTable[];

  actionsLista: IActionTable[];

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cPersDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '9rem',
      field: 'apoderado',
      header: 'Apoderado',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cTipoFamiliarDescripcion',
      header: 'Tipo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cPersCorreo',
      header: 'Correo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cPersTelefono',
      header: 'Teléfono',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dtCreado',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dtDeshabilitado',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cObservacion',
      header: 'Observaciones',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '3rem',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
  ];

  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private fb: FormBuilder,
    private query: GeneralService,
    private datosEstudianteService: DatosEstudianteService,
    private messageService: MessageService
  ) {
    this.frmApoderado = this.fb.group({
      iApoderadoId: [null],
      iTipoIdentId: ['', Validators.required],
      cPersDocumento: ['', Validators.required],
      cNombreCompleto: [''], //tipo familiar
      iTipoFamiliarId: ['', Validators.required], //tipo familiar
      iPersId: [0], //persona
      dtCreado: [''],
      cObservacion: [''],
      dtDeshabilitado: [''],
      iEstado: [1],
    });

    this.form = this.fb.group({
      iPersApoderadoId: [0],
      iTipoFamiliarId: [null],
      iTipoIdentId: [null],
      cPersDocumento: [null],
      cPersNombre: [null],
      cPersPaterno: [null],
      cPersMaterno: [null],
      cPersSexo: [null],
      iTipoEstCivId: [null],
      iNacionId: [null],
      dPersNacimiento: [null],
      cPersDomicilio: [null],
      iPaisId: [null],
      iDptoId: [null],
      iPrvnId: [null],
      iDsttId: [null],
      cObservacion: [null],
      iEstado: [1],
    });
  }
  private inicializacionPendiente = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iEstudianteId'] && changes['iEstudianteId'].currentValue) {
      // this.getTipoFamiliares();
      this.apoderados = [];
      console.log(this.estudiante);
      this.inicializarFormulario();
      this.datosEstudiante();
      this.getTipoFamiliares();
      // if (!this.inicializacionPendiente) {
      //   this.inicializacionPendiente = true;
      //   setTimeout(() => {
      //     // this.inicializarFormulario();
      //     this.inicializacionPendiente = false;
      //   });
      // }
    }
  }

  ngOnInit(): void {
    if (!this.soloLectura) {
      this.actions = [
        {
          labelTooltip: 'Editar Matrícula',
          icon: 'pi pi-pencil',
          accion: 'editar_apoderado',
          type: 'item',
          class: 'p-button-rounded p-button-warning p-button-text',
        },

        {
          labelTooltip: 'Deshabilitar apoderado',
          icon: 'pi pi-trash',
          accion: 'Deshabilitar',
          type: 'item',
          class: 'p-button-rounded p-button-danger p-button-text',
          isVisible: rowData => {
            return rowData.iEstado === '1';
          },
        },
        {
          labelTooltip: 'Habilitar apoderado',
          icon: 'pi pi-check',
          accion: 'Habilitar',
          type: 'item',
          class: 'p-button-rounded p-button-success p-button-text',
          isVisible: rowData => {
            return rowData.iEstado === '0';
          },
        },
      ];

      this.columns.push({
        type: 'actions',
        width: '1rem',
        field: 'actions',
        header: 'Acciones',
        text_header: 'center',
        text: 'center',
      });
    }
  }

  inicializarFormulario() {
    this.frmApoderado.reset();
    const params = {
      iEstudianteId: this.iEstudianteId,
      iCredId: this.iCredId,
    };
    this.query
      .searchCalendario({
        json: JSON.stringify(params),
        _opcion: 'getApoderadoXEstudiante',
      })
      .subscribe({
        next: (data: any) => {
          this.apoderados = data.data;
        },
        error: error => {
          console.error('Error obteniendo matricula:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error, no se obtuvieron conexión: ' + error.error.message,
          });
        },
        // complete: () => {

        //   this.messageService.add({
        //     severity: 'success',
        //     summary: 'Mensaje del sistema',
        //     detail: 'Se obtuvo información de apoderados',
        //   });
        //    },
      });
  }

  datosEstudiante() {
    this.datosEstudianteService.getTiposDocumentos().subscribe(data => {
      this.tipos_documentos = data;
    });
    this.datosEstudianteService.getEstadosCiviles().subscribe(data => {
      this.estados_civiles = data;
    });
    this.datosEstudianteService.getNacionalidades().subscribe(data => {
      this.nacionalidades = data;
    });
    this.datosEstudianteService.getDepartamentos().subscribe(data => {
      this.departamentos = data;
    });

    this.sexos = this.datosEstudianteService.getSexos();
    this.lenguas = this.datosEstudianteService.getLenguas();

    try {
      this.form = this.fb.group({
        iEstudianteId: [this.iEstudianteId, Validators.required], // PK
        iPersApoderadoId: [null],
        iTipoFamiliarId: [null, Validators.required],
        iTipoIdentId: [null, Validators.required],
        cPersDocumento: [null, Validators.required],
        cPersPaterno: ['', Validators.required],
        cPersMaterno: [''],
        cPersNombre: ['', Validators.required],
        iTipoEstCivId: [null],
        cPersSexo: [null, Validators.required],
        iNacionId: [null],
        dPersNacimiento: ['', Validators.required],
        cPersDomicilio: [''],
        iPaisId: [null],
        iDptoId: [null],
        iPrvnId: [null],
        iDsttId: [null],
        iOcupacionId: [null],
        bFamiliarVivoConEl: [false],
        iGradoInstId: [null],
        iCredId: this.iCredId,
        cEstCodigo: [{ value: '', disabled: true }],
        cEstApenom: [{ value: '', disabled: true }],
      });
    } catch (error) {
      console.log(error, 'error de variables');
    }
  }

  getTipoFamiliares() {
    this.query
      .searchTablaXwhere({
        esquema: 'obe',
        tabla: 'tipo_familiares',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.tipos_familiar = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje del sistema',
            severity: 'error',
            detail:
              'Error. No se pudo obtener registro de tipos de familiares: ' + error.error.message,
          });
        },
        // complete: () => {
        //   this.messageService.add({
        //     summary: 'Mensaje del sistema',
        //     severity: 'success',
        //     detail: 'Se actualizo el registro de matrícula',
        //   });
        // },
      });
  }
  setFormApoderado(item) {
    this.form.get('iPersApoderadoId')?.setValue(item.iPersId);
    this.form.get('iTipoFamiliarId')?.setValue(item.iTipoFamiliarId);
    this.form.get('iTipoIdentId')?.setValue(item.iTipoIdentId);
    this.form.get('cPersDocumento')?.setValue(item.cPersDocumento);
    this.form.get('cPersNombre')?.setValue(item.cPersNombre);
    this.form.get('cPersPaterno')?.setValue(item.cPersPaterno);
    this.form.get('cPersMaterno')?.setValue(item.cPersMaterno);
    this.form.get('cPersSexo')?.setValue(item.cPersSexo);
    this.form.get('iTipoEstCivId')?.setValue(item.iTipoEstCivId);
    this.form.get('iNacionId')?.setValue(item.iNacionId);
    this.form.get('cPersDomicilio')?.setValue(item.cPersDomicilio);
    this.form.get('iPaisId')?.setValue(item.iPaisId);
    this.form.get('iDptoId')?.setValue(item.iDptoId);
    this.form.get('iPrvnId')?.setValue(item.iPrvnId);
    this.form.get('iDsttId')?.setValue(item.iDsttId);
    this.form
      .get('dPersNacimiento')
      ?.setValue(item.dPersNacimiento ? new Date(item.dPersNacimiento) : null);
  }

  validarPersona() {
    this.datosEstudianteService
      .validarPersona({
        iTipoIdentId: this.form.get('iTipoIdentId')?.value,
        cPersDocumento: this.form.get('cPersDocumento')?.value,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'validar persona');
          this.setFormApoderado(data.data);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: data.message,
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.menssage,
          });
        },
        // complete: () => {
        //     console.log('Request completed')
        // },
      });
  }

  validarDocumento() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          cPersDocumento: this.frmApoderado.get('cPersDocumento')?.value,
          iTipoIdentId: this.frmApoderado.get('iTipoIdentId')?.value,
        }),
        _opcion: 'getPersona',
      })
      .subscribe({
        next: (data: any) => {
          this.apoderado = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error al obtener datos del docuemento: ' + error.error.message,
          });
        },
        complete: () => {
          if (this.apoderado[0].iPersId > 0) {
            this.mensaje = this.apoderado[0].NombreCompleto;
            this.sever = 'success';
            this.form.patchValue({
              iPersId: this.apoderado[0].iPersId,
            });
            this.bDocumentoValido = true;
          } else {
            this.mensaje =
              this.frmApoderado.get('cPersDocumento')?.value +
              ' No cuenta con registro comunicarse con el Administrador';
            this.sever = 'error';
            this.bDocumentoValido = false;
          }
        },
      });
  }
  asignarApoderado() {
    this.query
      .addCalAcademico({
        json: JSON.stringify({
          iPersId: this.apoderado[0].iPersId,
          iEstudianteId: this.iEstudianteId,
          iTipoFamiliarId: this.frmApoderado.get('iTipoFamiliarId')?.value,
          cObservacion: this.frmApoderado.get('cObservacion')?.value,
          iSesionId: this.iCredId,
        }),
        _opcion: 'addApoderado',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje del sistema',
            detail: 'Se asignó el apoderado al estudiante',
          });
          this.inicializarFormulario();
        },
      });
  }

  accionBtnItemTable(event: any) {
    switch (event.accion) {
      case 'editar_apoderado':
        this.apoderado = event.item;
        console.log(this.apoderado, 'this.apoderado');
        this.frmApoderado.patchValue({
          iApoderadoId: event.item.iApoderadoId,
          iTipoIdentId: event.item.iTipoIdentId,
          cPersDocumento: event.item.cPersDocumento,
          cNombreCompleto: event.item.apoderado,
          iTipoFamiliarId: event.item.iTipoFamiliarId,
          iPersId: event.item.iPersId,
          dtCreado: event.item.dtCreado,
          cObservacion: event.item.cObservacion,
          dtDeshabilitado: event.item.dtDeshabilitado,
          iEstado: event.item.iEstado,
        });
        this.bEditar = true;
        this.apoderado = event.item;
        this.bDocumentoValido = true;

        this.mensaje = event.item.apoderado;
        this.sever = 'success';
        this.form.patchValue({
          iPersId: event.item.iPersId,
        });

        break;
      case 'editar':
        const params1 = {
          iApoderadoId: this.frmApoderado.get('iApoderadoId')?.value,
          cObservacion: this.frmApoderado.get('cObservacion')?.value,
          iTipoFamiliarId: this.frmApoderado.get('iTipoFamiliarId')?.value,
          iEstado: this.frmApoderado.get('iEstado')?.value,
          iSesionId: this.iCredId,
        };
        const mensaje1 = '¿Estás seguro de que deseas actualizar el apoderado?';
        this.actualizarApoderado(params1, mensaje1);

        break;
      case 'Deshabilitar':
        const params = {
          iApoderadoId: event.item.iApoderadoId,
          cObservacion: event.item.cObservacion,
          iTipoFamiliarId: event.item.iTipoFamiliarId,
          iEstado: 0,
          iSesionId: this.iCredId,
        };
        const mensaje = '¿Estás seguro de que deseas deshabilitar al apoderado?';
        this.actualizarApoderado(params, mensaje);
        break;
      case 'Habilitar':
        const params2 = {
          iApoderadoId: event.item.iApoderadoId,
          cObservacion: event.item.cObservacion,
          iTipoFamiliarId: event.item.iTipoFamiliarId,
          iEstado: 1,
          iSesionId: this.iCredId,
        };
        const mensaje2 = '¿Estás seguro de que deseas habilitar al apoderado?';
        this.actualizarApoderado(params2, mensaje2);
        break;
    }
    console.log(event);
  }
  actualizarApoderado(params: any, mensaje: string) {
    this._confirmService.openConfiSave({
      header: 'Advertencia de autoguardado',
      message: mensaje,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.query
          .updateCalAcademico({
            json: JSON.stringify(params),
            _opcion: 'updateApoderado',
          })
          .subscribe({
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Mensaje del Sistema',
                detail: 'Error al actualizar información:: ' + error.error.message,
              });
            },
            complete: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje del sistema',
                detail: 'Se actualizo información del apoderado',
              });
              this.bEditar = false;
              this.bDocumentoValido = false;
              this.mensaje = '';
              this.sever = 'default';
              this.inicializarFormulario();
            },
          });
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
  }

  exportarApoderados() {
    if (!this.apoderados || this.apoderados.length === 0) {
      /*this.messageService.add({
                severity: 'warn',
                summary: 'Sin datos',
                detail: 'No hay apoderados para exportar',
            });*/
      return;
    }

    // Crear el libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Definir las columnas a exportar
    const columnasExportar = [
      { key: 'cTipoFamiliarDescripcion', header: 'Tipo Familiar' },
      { key: 'cPersDocumento', header: 'Documento' },
      { key: 'apoderado', header: 'Apoderado' },
      { key: 'cPersCorreo', header: 'Correo' },
      { key: 'cPersTelefono', header: 'Teléfono' },
      { key: 'iEstado', header: 'Estado' },
    ];

    // Crear cabeceras
    const headers = columnasExportar.map(col => col.header);

    // Crear los datos transformando el iEstado
    const dataRows = this.apoderados.map(apoderado =>
      columnasExportar.map(col => {
        if (col.key === 'iEstado') {
          return apoderado[col.key] === '1' || apoderado[col.key] === 1
            ? 'Habilitado'
            : 'Inhabilitado';
        }
        return apoderado[col.key] || '';
      })
    );

    // Combinar todas las filas: Fila 1 (Estudiante label), Fila 2 (Nombre estudiante), Fila 3 (Cabeceras), Fila 4+ (Datos)
    const data = [
      ['Estudiante:', this.estudiante?._cPersNomape, '', '', '', ''], // Fila 1
      ['', '', '', '', '', ''], // Fila 2
      headers, // Fila 3 - Cabeceras
      ...dataRows, // Fila 4+ - Datos
    ];

    // Crear la hoja de trabajo
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Estilo para "Estudiante" (A1)
    const estudianteLabelStyle = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    // Estilo para el nombre del estudiante (A2)
    const estudianteNombreStyle = {
      font: { size: 11 },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    // Aplicar estilos a las cabeceras (fila 3, índice 2)
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    };

    // Aplicar estilo a A1
    const cellA1 = XLSX.utils.encode_cell({ r: 0, c: 0 });
    if (!worksheet[cellA1]) worksheet[cellA1] = {};
    worksheet[cellA1].s = estudianteLabelStyle;

    // Aplicar estilo a B1 (nombre del estudiante)
    const cellB1 = XLSX.utils.encode_cell({ r: 0, c: 1 });
    if (!worksheet[cellB1]) worksheet[cellB1] = {};
    worksheet[cellB1].s = estudianteNombreStyle;

    // Hacer merge de B1 hasta F1
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({
      s: { r: 0, c: 1 }, // B1 (start)
      e: { r: 0, c: 5 }, // F1 (end)
    });

    // Aplicar estilo a las celdas de cabecera (fila 3, índice 2)
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: index });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = headerStyle;
    });

    // Ajustar ancho de columnas automáticamente
    const colWidths = columnasExportar.map((col, index) => {
      // Para la primera columna (Estudiante:), usar un ancho fijo pequeño
      if (index === 0) {
        return { wch: 15 }; // Ancho fijo de 15 caracteres para "Estudiante:"
      }

      const maxLength = Math.max(
        col.header.length,
        ...this.apoderados.map(apoderado => {
          let valor = apoderado[col.key];
          if (col.key === 'iEstado') {
            valor =
              apoderado[col.key] === '1' || apoderado[col.key] === 1
                ? 'Habilitado'
                : 'Inhabilitado';
          }
          return String(valor || '').length;
        })
      );
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = colWidths;

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Apoderados');

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const nombreArchivo = `Apoderados_${this.estudiante?._cPersNomape}.xlsx`;
    saveAs(blob, nombreArchivo);
  }
}
