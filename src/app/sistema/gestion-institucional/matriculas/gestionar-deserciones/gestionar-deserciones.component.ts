import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosMatriculaService } from '../../services/datos-matricula.service';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { PrimengModule } from '@/app/primeng.module';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-gestionar-deserciones',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './gestionar-deserciones.component.html',
  styleUrl: './gestionar-deserciones.component.scss',
})
export class GestionarDesercionesComponent implements OnInit, OnChanges {
  formDesercion: FormGroup;
  form: FormGroup;
  private _iMatrId: number = 0;

  @Input()
  set iMatrId(value: number) {
    if (this._iMatrId !== value && value) {
      this._iMatrId = value;
    }
  }

  get iMatrId(): number {
    return this._iMatrId;
  }

  @Input() soloLectura: boolean = false;
  @Input() visible: boolean = false;

  @Input() estudiante: any;

  selectedItems = [];
  deserciones: any[] = [];
  desercion: any = {};
  iDesercionId: number = 0;
  perfil: any;
  iYAcadId: number;

  //validar si es edicion
  solo_ver: boolean = false;

  //variables para registrar desercion
  tipos_deserciones: Array<object>;
  estados: Array<object>;

  activeTab: number = 0;

  columns: IColumn[] = [
    {
      type: 'text',
      width: '15%',
      field: 'cTipoDesercionDescripcion',
      header: 'Tipo',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dInicioDesercion',
      header: 'Desde',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dFinDesercion',
      header: 'Hasta',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'tag',
      width: '15%',
      field: 'bActivaNombre',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
      styles: {
        ACTIVA: 'success',
        INACTIVA: 'secondary',
      },
    },
    {
      type: 'text',
      width: '40%',
      field: 'cMotivoDesercion',
      header: 'Motivo',
      text_header: 'left',
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

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'borrar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
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
    if (changes['visible'] && changes['visible'].currentValue === true && this.iMatrId) {
      this.activeTab = 0;
      this.solo_ver = true;
      this.deserciones = [];
      this.iDesercionId = null;
      this.formDesercion.reset({
        iMatrId: this.iMatrId,
      });
      this.listarDeserciones();
    }
  }

  ngOnInit(): void {
    try {
      this.formDesercion = this.fb.group({
        iDesercionId: [null],
        iTipoDesercionId: [null, Validators.required],
        iMatrId: [this.iMatrId],
        cMotivoDesercion: [''],
        dInicioDesercion: [null, Validators.required],
        dFinDesercion: [null, Validators.required],
      });
    } catch (error) {
      console.error(error, 'error de variables');
    }

    this.matriculaService
      .crearMatricula({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.tipos_deserciones = this.matriculaService.getTiposDeserciones(data?.tipos_deserciones);
      });
  }

  listarDeserciones() {
    this.deserciones = [];
    this.desercion = null;
    this.iDesercionId = null;
    this.formDesercion.reset({
      iMatrId: this.iMatrId,
    });
    this.matriculaService
      .listarDeserciones({
        iMatrId: this.iMatrId,
      })
      .subscribe({
        next: (data: any) => {
          this.deserciones = data.data;
        },
        error: error => {
          console.error('Error obteniendo deserciones:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Error al obtener datos',
          });
        },
      });
  }

  nuevaDesercion() {
    this.desercion = null;
    this.iDesercionId = null;
    this.formDesercion.reset({
      iMatrId: this.iMatrId,
    });
    this.solo_ver = false;
    this.activeTab = 1;
  }

  verTodasDeserciones() {
    if (!this.solo_ver) {
      this.confirmService.openConfirm({
        header: 'Confirmación',
        message: '¿Realmente desea salir sin guardar los cambios?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.formDesercion.reset({
            iMatrId: this.iMatrId,
          });
          this.iDesercionId = null;
          this.solo_ver = false;
          this.activeTab = 0;
        },
      });
    }
  }

  setformDesercion(desercion) {
    desercion.iMatrId = this.iMatrId;
    this.formDesercion.patchValue(desercion);
    this.matriculaService.formatearFormControl(
      this.formDesercion,
      'iTipoDesercionId',
      desercion.iTipoDesercionId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formDesercion,
      'dInicioDesercion',
      desercion.dInicioDesercion,
      'date'
    );
    this.matriculaService.formatearFormControl(
      this.formDesercion,
      'dFinDesercion',
      desercion.dFinDesercion,
      'date'
    );
    if (this.solo_ver) {
      this.formDesercion.disable();
    }
  }

  accionBtnItemTable(event: any) {
    switch (event.accion) {
      case 'editar':
        this.desercion = event.item;
        this.iDesercionId = this.desercion.iDesercionId;
        this.verDesercion();
        this.activeTab = 1;
        this.solo_ver = false;
        break;
      case 'borrar':
        this.iDesercionId = event.item.iDesercionId;
        this.confirmService.openConfirm({
          header: 'Confirmación',
          message: '¿Realmente desea borrar la desercion?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarDesercion();
          },
        });
        break;
    }
  }

  verDesercion() {
    this.matriculaService
      .verDesercion({
        iDesercionId: this.iDesercionId,
      })
      .subscribe({
        next: (data: any) => {
          this.setformDesercion(data.data);
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

  guardarDesercion() {
    this.matriculaService.guardarDesercion(this.formDesercion.value).subscribe({
      next: () => {
        this.formDesercion.reset({
          iMatrId: this.iMatrId,
        });
        this.solo_ver = false;
        this.listarDeserciones();
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

  actualizarDesercion() {
    this.confirmService.openConfiSave({
      header: 'Confirmación',
      message: '¿Desea actualizar los datos?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.matriculaService.actualizarDesercion(this.formDesercion.value).subscribe({
          next: () => {
            this.formDesercion.reset({
              iMatrId: this.iMatrId,
            });
            this.solo_ver = false;
            this.listarDeserciones();
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

  borrarDesercion() {
    this.matriculaService
      .borrarDesercion({
        iDesercionId: this.iDesercionId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Deserción borrada con éxito',
          });
          this.solo_ver = false;
          this.listarDeserciones();
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

  exportarDeserciones() {
    // Crear el libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Definir las columnas a exportar
    const columnasExportar = [
      { key: 'cTipoDesercionDescripcion', header: 'Tipo Deserción' },
      { key: 'dInicioDesercion', header: 'Desde' },
      { key: 'dFinDesercion', header: 'Hasta' },
      { key: 'bActivaNombre', header: 'Estado' },
      { key: 'cDesercionMotivo', header: 'Motivo' },
    ];

    // Crear cabeceras
    const headers = columnasExportar.map(col => col.header);

    // Crear los datos transformando el iEstado
    const dataRows = this.deserciones.map(desercion =>
      columnasExportar.map(col => {
        return desercion[col.key] || '';
      })
    );

    // Combinar todas las filas: Fila 1 (Estudiante label), Fila 2 (Nombre estudiante), Fila 3 (Cabeceras), Fila 4+ (Datos)
    const data = [
      ['Estudiante:', this.estudiante?.cPersNombreCompleto, '', '', ''], // Fila 1
      ['', '', '', '', ''], // Fila 2
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
        ...this.deserciones.map(desercion => {
          const valor = desercion[col.key];
          return String(valor || '').length;
        })
      );
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = colWidths;

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DESERCIONES');

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fechaHora = formatDate(new Date(), 'yyyyMMdd_HHmmss', 'es-ES');
    const nombreSubguiones = this.estudiante.cPersNombreCompleto.replace(' ', '_');
    const nombreArchivo = `DESERCIONES_${nombreSubguiones}_${fechaHora}.xlsx`;
    saveAs(blob, nombreArchivo);
  }
}
