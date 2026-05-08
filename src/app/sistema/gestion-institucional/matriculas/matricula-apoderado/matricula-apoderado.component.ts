import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { DatosMatriculaService } from '../../services/datos-matricula.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-matricula-apoderado',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './matricula-apoderado.component.html',
  styleUrl: './matricula-apoderado.component.scss',
})
export class MatriculaApoderadoComponent implements OnChanges, OnInit {
  formApoderado: FormGroup;
  form: FormGroup;
  private _iEstudianteId: number = 0;

  @Input()
  set iEstudianteId(value: number) {
    if (this._iEstudianteId !== value && value) {
      this._iEstudianteId = value;
    }
  }

  get iEstudianteId(): number {
    return this._iEstudianteId;
  }

  @Input() iCredId: number = 0;
  @Input() soloLectura: boolean = false;
  @Input() visible: boolean = false;

  @Input() estudiante: any;
  // @Input() caption: string = 'Historial de Apoderados';

  selectedItems = [];
  apoderados: any[] = [];
  apoderado: any = {};
  iApoderadoId: number = 0;
  perfil: any;
  iYAcadId: number;

  //validar se es edicion
  solo_ver: boolean = false;

  //variables para registrar personas
  tipos_familiares: Array<object>;
  tipos_documentos: Array<object>;
  sexos: Array<object>;
  nacionalidades: Array<object>;
  longitud_documento: number;
  formato_documento: string = '99999999';

  activeTab: number = 0;

  columns = [
    {
      type: 'date',
      width: '10%',
      field: 'dtCreado',
      header: 'Asignado',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cPersDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '35%',
      field: 'cPersNombreCompleto',
      header: 'Apoderado',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cTipoFamiliarDescripcion',
      header: 'Relación',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cPersTelefono',
      header: 'Teléfono',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '1rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar Matrícula',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Deshabilitar apoderado',
      icon: 'pi pi-trash',
      accion: 'borrar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return Number(rowData.iEstado) === 1;
      },
    },
    {
      labelTooltip: 'Habilitar apoderado',
      icon: 'pi pi-check',
      accion: 'Habilitar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: rowData => {
        return Number(rowData.iEstado) === 0;
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private matriculaService: DatosMatriculaService,
    private messageService: MessageService,
    private confirmService: ConfirmationModalService,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true && this.iEstudianteId) {
      this.activeTab = 0;
      this.solo_ver = true;
      this.apoderados = [];
      this.iApoderadoId = null;
      this.formApoderado.reset({
        iEstudianteId: this.iEstudianteId,
      });
      this.listarApoderados();
    }
  }

  ngOnInit(): void {
    try {
      this.formApoderado = this.fb.group({
        iApoderadoId: [null],
        iTipoFamiliarId: [null, Validators.required],
        iEstudianteId: [this.iEstudianteId],
        iPersId: [null],
        cPersPaterno: ['', Validators.required],
        cPersMaterno: [''],
        cPersNombre: ['', Validators.required],
        iTipoIdentId: [null, Validators.required],
        cPersDocumento: ['', Validators.required],
        cPersSexo: [null, Validators.required],
        iNacionId: [null],
        dPersNacimiento: [null, Validators.required],
        cPersTelefono: [''],
        cPersCorreo: [''],
        cObservacion: [''],
      });
    } catch (error) {
      console.log(error, 'error de variables');
    }

    this.matriculaService
      .crearMatricula({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.tipos_documentos = this.matriculaService.getTiposDocumentos(data?.tipos_documentos);
        this.nacionalidades = this.matriculaService.getNacionalidades(data?.nacionalidades);
        this.tipos_familiares = this.matriculaService.getTiposFamiliares(data?.tipos_familiares);
        this.sexos = this.matriculaService.getSexos();
      });
  }

  listarApoderados() {
    this.apoderados = [];
    this.apoderado = null;
    this.iApoderadoId = null;
    this.formApoderado.reset({
      iEstudianteId: this.iEstudianteId,
    });
    this.matriculaService
      .listarApoderados({
        iEstudianteId: this.iEstudianteId,
      })
      .subscribe({
        next: (data: any) => {
          this.apoderados = data.data;
        },
        error: error => {
          console.error('Error obteniendo apoderados:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'Error, no se obtuvieron conexión: ' + error.error.message,
          });
        },
      });
  }

  nuevoApoderado() {
    this.apoderado = null;
    this.iApoderadoId = null;
    this.formApoderado.reset();
    this.solo_ver = false;
    this.activeTab = 1;
  }

  verTodosApoderados() {
    if (!this.solo_ver) {
      this.confirmService.openConfirm({
        header: 'Confirmación',
        message: '¿Realmente desea salir sin guardar los cambios?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.formApoderado.reset({
            iEstudianteId: this.iEstudianteId,
          });
          this.iApoderadoId = null;
          this.solo_ver = false;
          this.activeTab = 0;
        },
      });
    }
  }

  searchPersona() {
    this.formApoderado.patchValue({
      iPersId: null,
    });
    this.matriculaService
      .buscarPersonaApoderado({
        iEstudianteId: this.iEstudianteId,
        iTipoIdentId: this.formApoderado.value.iTipoIdentId,
        cPersDocumento: this.formApoderado.value.cPersDocumento,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormApoderado(data.data);
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

  setFormApoderado(apoderado) {
    apoderado.iEstudianteId = this.iEstudianteId;
    this.formApoderado.patchValue(apoderado);
    this.matriculaService.formatearFormControl(
      this.formApoderado,
      'iTipoFamiliarId',
      apoderado.iTipoFamiliarId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formApoderado,
      'iTipoIdentId',
      apoderado.iTipoIdentId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formApoderado,
      'iNacionId',
      apoderado.iNacionId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formApoderado,
      'dPersNacimiento',
      apoderado.dPersNacimiento,
      'date'
    );
    if (this.solo_ver) {
      this.formApoderado.disable();
    }
  }

  accionBtnItemTable(event: any) {
    switch (event.accion) {
      case 'editar':
        this.apoderado = event.item;
        this.iApoderadoId = this.apoderado.iApoderadoId;
        this.verApoderado();
        this.activeTab = 1;
        this.solo_ver = false;
        break;
      case 'borrar':
        this.iApoderadoId = event.item.iApoderadoId;
        this.confirmService.openConfirm({
          header: 'Confirmación',
          message: '¿Realmente desea borrar al apoderado?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarApoderado();
          },
        });
        break;
    }
  }

  verApoderado() {
    this.matriculaService
      .verApoderado({
        iApoderadoId: this.iApoderadoId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormApoderado(data.data);
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

  guardarApoderado() {
    this.matriculaService.guardarApoderado(this.formApoderado.value).subscribe({
      next: () => {
        this.formApoderado.reset({
          iEstudianteId: this.iEstudianteId,
        });
        this.solo_ver = false;
        this.listarApoderados();
        this.activeTab = 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Datos registrados',
        });
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarApoderado() {
    this.confirmService.openConfiSave({
      header: 'Confirmación',
      message: '¿Desea actualizar los datos?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.matriculaService.actualizarApoderado(this.formApoderado.value).subscribe({
          next: () => {
            this.formApoderado.reset({
              iEstudianteId: this.iEstudianteId,
            });
            this.solo_ver = false;
            this.listarApoderados();
            this.activeTab = 0;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Datos actualizados',
            });
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
      },
    });
  }

  borrarApoderado() {
    this.matriculaService
      .borrarApoderado({
        iApoderadoId: this.iApoderadoId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Apoderado borrado',
          });
          this.formApoderado.reset();
          this.solo_ver = false;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  exportarApoderados() {
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
