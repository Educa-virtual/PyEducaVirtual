import { Component, OnInit } from '@angular/core';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { AuditoriaService } from '../services/auditoria.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { optionsDropdownConfig } from './config/dropdown/dropdown';
import { UtilService } from '@/app/servicios/utils.service';
import { PrimengModule } from '@/app/primeng.module';

@Component({
  selector: 'app-accesos',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule],
  templateUrl: './accesos.component.html',
  styleUrl: './accesos.component.scss',
  providers: [],
})
export class AccesosComponent implements OnInit {
  form: FormGroup;
  data;
  selectRowData;
  visible: boolean = false;
  options = optionsDropdownConfig;

  columnsDetail = [
    {
      type: 'text',
      width: '5rem',
      field: 'property',
      header: 'Propiedad',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'oldValue',
      header: 'Datos antiguos',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'newValue',
      header: 'Datos nuevos',
      text_header: 'left',
      text: 'left',
    },
  ];

  columns;

  dataExport;

  constructor(
    private auditoria: AuditoriaService,
    private fb: FormBuilder,
    private utils: UtilService
  ) {
    this.form = this.fb.group({
      selectedTable: [this.options[0]],
      filtroDesde: [new Date(new Date().setDate(new Date().getDate() - 30))],
      filtroHasta: [new Date()],
    });
  }

  ngOnInit() {
    this.refrescar();
    this.form.valueChanges.subscribe(curr => {
      this.getData(curr);
    });
  }

  refrescar() {
    this.getData(this.form.value);
  }

  getData(curr) {
    const option = curr.selectedTable.value;
    this.auditoria.endpoint = option.endPoint;

    if (curr.filtroDesde != null && curr.filtroHasta != null) {
      this.auditoria
        .getData({
          filtroFechaInicio: this.utils.convertirAFechaSegura(this.form.value.filtroDesde),
          filtroFechaFin: this.utils.convertirAFechaSegura(this.form.value.filtroHasta),
        })
        .subscribe({
          next: res => {
            this.data = option.response(res);
          },

          complete: () => {
            this.columns = option.columns;
          },
        });
    }
  }

  selectRow(data) {
    this.selectRowData = data;
    this.visible = true;
  }

  cerrarDialogo() {
    this.visible = false;
  }

  generarExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.data);

    // Crear un libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Exportar el archivo Excel
    XLSX.writeFile(workbook, 'Auditoria.xlsx');
  }
}
