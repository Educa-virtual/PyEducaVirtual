import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { ChartModule } from 'primeng/chart';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosInformesService } from '../../services/datos-informes.service';
import { MenuItem, MessageService } from 'primeng/api';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ChartOptions } from 'chart.js';
import {
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_UGEL,
  ESPECIALISTA_DREMO,
} from '@/app/servicios/seg/perfiles';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { SheetToMatrix } from '@/app/sistema/gestion-institucional/sincronizar-archivo/bulk-data-import/utils/sheetToMatrix';

@Component({
  selector: 'app-informes-comparar-ere',
  standalone: true,
  templateUrl: './informes-comparar-ere.component.html',
  styleUrls: ['./informes-comparar-ere.component.scss'],
  imports: [PrimengModule, ChartModule, TablePrimengComponent, NoDataComponent],
})
export class InformesCompararEreComponent implements OnInit {
  formFiltros: FormGroup;
  formFiltrosObtenido: FormGroup;
  data_doughnut: any;
  options_doughnut: any;
  data_bar: any;
  options_bar: ChartOptions;
  hide_filters: boolean = false;

  evaluacion1: string = 'EVALUACION 1';
  evaluacion2: string = 'EVALUACION 2';

  resultados1: Array<object>;
  resultados2: Array<object>;
  niveles1: Array<object>;
  niveles2: Array<object>;
  niveles: Array<object>;
  promedio: Array<object>;
  filtros: Array<object>;
  total1: number = 0;
  total2: number = 0;
  fullData: Array<object>;

  niveles_nombres: Array<any>;
  niveles_resumen: Array<any>;
  hay_resultados: boolean = false;
  puede_exportar: boolean = false;

  es_especialista: boolean = false;

  evaluaciones_cursos_ies: Array<object>;
  evaluaciones: Array<object>;
  areas: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  distritos: Array<object>;
  ies: Array<object>;
  secciones: Array<object>;
  sexos: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  tipos_reportes: Array<object>;

  private _MessageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private datosInformes: DatosInformesService
  ) {}

  ngOnInit() {
    const perfiles_permitidos = [ADMINISTRADOR_DREMO, ESPECIALISTA_DREMO, ESPECIALISTA_UGEL];
    if (perfiles_permitidos.includes(+this.datosInformes.perfil.iPerfilId)) {
      this.es_especialista = true;
    }
    try {
      this.formFiltros = this.fb.group({
        iYAcadId: [this.datosInformes.iYAcadId, Validators.required],
        iCredEntPerfId: [this.datosInformes.perfil.iCredEntPerfId, Validators.required],
        iEvaluacion1: [null, Validators.required],
        iEvaluacion2: [null, Validators.required],
        iCursoId: [null, Validators.required],
        iNivelTipoId: [null, Validators.required],
        iNivelGradoId: [null, Validators.required],
        iZonaId: [null],
        iTipoSectorId: [null],
        iUgelId: [null],
        iDsttId: [null],
        iIieeId: [null],
        iSeccionId: [null],
        cPersSexo: [null],
        cTipoReporte: ['ESTUDIANTES', Validators.required],
      });
    } catch (error) {
      console.log(error, 'error de formulario');
    }

    this.sexos = this.datosInformes.getSexos();
    this.tipos_reportes = this.datosInformes.getTiposReportes();
    this.datosInformes.obtenerParametros(this.formFiltros.value).subscribe((data: any) => {
      this.evaluaciones = this.datosInformes.getEvaluaciones(data?.evaluaciones);
      this.distritos = this.datosInformes.getDistritos(data?.distritos);
      this.secciones = this.datosInformes.getSecciones(data?.secciones);
      this.zonas = this.datosInformes.getZonas(data?.zonas);
      this.tipo_sectores = this.datosInformes.getTipoSectores(data?.tipo_sectores);
      this.ugeles = this.datosInformes.getUgeles(data?.ugeles);
      this.nivel_tipos = this.datosInformes.getNivelesTipos(data?.nivel_tipos);
      this.ies = this.datosInformes.getInstitucionesEducativas(data?.instituciones_educativas);

      this.datosInformes.getNivelesGrados(data?.nivel_grados);
      this.datosInformes.getAreas(data?.areas);
    });

    this.formFiltros.get('iNivelTipoId').valueChanges.subscribe(value => {
      this.formFiltros.get('iNivelGradoId')?.setValue(null);
      this.nivel_grados = null;
      this.filterNivelesGrados(value);

      this.formFiltros.get('iCursoId')?.setValue(null);
      this.areas = null;
      this.filterAreas(value);

      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iDsttId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iZonaId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iTipoSectorId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.get('iUgelId').valueChanges.subscribe(() => {
      this.formFiltros.get('iIieeId')?.setValue(null);
      this.ies = null;
      this.filterInstitucionesEducativas();
    });
    this.formFiltros.valueChanges.subscribe(value => {
      this.puede_exportar = JSON.stringify(value) === JSON.stringify(this.formFiltrosObtenido);
    });
  }

  barPlugin = [
    {
      afterDraw: chart => {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          if (dataset.data.length == 0) return;
          const isHidden = chart.legend.legendItems[i]?.hidden;
          if (isHidden) return;
          chart.getDatasetMeta(i).data.forEach((bar, index) => {
            const data = dataset.data[index];
            if (Number(data) == 0 || isHidden) return;
            ctx.font = '0.75em Arial';
            ctx.fillStyle = dataset.backgroundColor[index];
            ctx.fillText(data + '%', bar.x - 15, bar.y - 5);
          });
        });
      },
    },
  ];

  filterNivelesTipos() {
    this.nivel_tipos = this.datosInformes.filterNivelesTipos();
  }

  filterNivelesGrados(iNivelTipoId: number) {
    this.nivel_grados = this.datosInformes.filterNivelesGrados(iNivelTipoId);
  }

  filterAreas(iNivelTipoId: number) {
    this.areas = this.datosInformes.filterAreas(iNivelTipoId);
  }

  filterInstitucionesEducativas() {
    const iEvaluacion1 = this.formFiltros.get('iEvaluacion1')?.value;
    const iNivelTipoId = this.formFiltros.get('iNivelTipoId')?.value;
    const iDsttId = this.formFiltros.get('iDsttId')?.value;
    const iZonaId = this.formFiltros.get('iZonaId')?.value;
    const iTipoSectorId = this.formFiltros.get('iTipoSectorId')?.value;
    const iUgelId = this.formFiltros.get('iUgelId')?.value;
    this.ies = this.datosInformes.filterInstitucionesEducativas(
      iEvaluacion1,
      iNivelTipoId,
      iDsttId,
      iZonaId,
      iTipoSectorId,
      iUgelId
    );
  }

  btn_exportar: Array<MenuItem> = [
    {
      label: 'PDF',
      icon: 'pi pi-fw pi-file-pdf',
      command: () => {
        this.exportar(1);
      },
    },
    {
      label: 'EXCEL',
      icon: 'pi pi-fw pi-file-excel',
      command: () => {
        this.exportar(2);
      },
    },
  ];

  searchResultados() {
    if (this.formFiltros.invalid) {
      this._MessageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar los filtros obligatorios',
      });
      return;
    }
    if (this.formFiltros.value.iEvaluacion1 === this.formFiltros.value.iEvaluacion2) {
      this._MessageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La evaluación 1 y 2 deben ser diferentes',
      });
      return;
    }
    this.datosInformes.obtenerInformeComparacion(this.formFiltros.value).subscribe({
      next: (data: any) => {
        if (data.data.length > 0) {
          this.formFiltrosObtenido = this.formFiltros.value;
          this.puede_exportar = true;
          this.filtros = data.data[0][0];
          this.resultados1 = data.data[1];
          this.niveles1 = data.data[2];
          this.resultados2 = data.data[3];
          this.niveles2 = data.data[4];
          this.combinarNiveles();
          this.mostrarEstadisticaNivel();
          this.evaluacion1 = this.filtros['evaluacion'] ?? '';
          this.evaluacion2 = this.filtros['evaluacion2'] ?? '';
        } else {
          this.sinDatos();
        }
      },
      error: error => {
        console.error('Error consultando resultados:', error);
        this.sinDatos();
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  sinDatos() {
    this.formFiltrosObtenido = null;
    this.puede_exportar = false;
    this.hay_resultados = false;
    this.promedio = [];
    this.resultados1 = [];
    this.niveles1 = [];
    this.resultados2 = [];
    this.niveles2 = [];
    this.niveles = [];
    this.total1 = 0;
    this.total2 = 0;
    this.mostrarEstadisticaNivel();
    this.evaluacion1 = 'EVALUACION 1';
    this.evaluacion2 = 'EVALUACION 2';
  }

  combinarNiveles() {
    const niveles = this.niveles1.map((item: any) => item.nivel_logro);
    const valores1 = this.niveles1.map((item: any) => item.cantidad);
    const valores2 = this.niveles2.map((item: any) => item.cantidad);

    const total1 = valores1.reduce((acc, cur) => Number(acc) + Number(cur));
    const total2 = valores2.reduce((acc, cur) => Number(acc) + Number(cur));
    this.total1 = total1;
    this.total2 = total2;

    const porcentajes1 = valores1.map(valor => ((Number(valor) / Number(total1)) * 100).toFixed(2));
    const porcentajes2 = valores2.map(valor => ((Number(valor) / Number(total2)) * 100).toFixed(2));

    const data = [];
    for (let i = 0; i < niveles.length; i++) {
      data.push({
        nivel: niveles[i],
        valor1: valores1[i],
        porcentaje1: porcentajes1[i] + '%',
        porcentaje1_num: Number(porcentajes1[i]),
        valor2: valores2[i],
        porcentaje2: porcentajes2[i] + '%',
        porcentaje2_num: Number(porcentajes2[i]),
      });
    }
    this.niveles = data;
  }

  mostrarEstadisticaNivel() {
    if (
      !this.resultados1 ||
      this.resultados1.length == 0 ||
      !this.resultados2 ||
      this.resultados2.length == 0
    ) {
      this.hay_resultados = false;
      this.promedio = [];
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.hay_resultados = true;

    const niveles_nombres = this.niveles1.map((item: any) => item.nivel_logro);
    const valores1 = this.niveles1.map((item: any) => item.cantidad);
    const valores2 = this.niveles2.map((item: any) => item.cantidad);

    const total1 = valores1.reduce((acc, cur) => Number(acc) + Number(cur));
    const total2 = valores2.reduce((acc, cur) => Number(acc) + Number(cur));

    const porcentajes1 = valores1.map(valor => ((Number(valor) / Number(total1)) * 100).toFixed(2));
    const porcentajes2 = valores2.map(valor => ((Number(valor) / Number(total2)) * 100).toFixed(2));

    this.data_bar = {
      labels: niveles_nombres,
      datasets: [
        {
          label: this.filtros['evaluacion'],
          data: porcentajes1,
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--blue-400'),
        },
        {
          label: this.filtros['evaluacion2'],
          data: porcentajes2,
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--yellow-400'),
        },
      ],
    };

    this.options_bar = {
      plugins: {
        title: {
          display: true,
          text: 'Comparación de evaluaciones ERE (Según porcentaje)',
          font: {
            size: 12,
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
          },
        },
      },
    };
  }

  exportar(tipo: number) {
    if (this.formFiltros.invalid) {
      this._MessageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar los filtros obligatorios',
      });
      return;
    }
    if (tipo == 1) {
      this.datosInformes.exportarComparacionPdf(this.formFiltros.value).subscribe({
        next: response => {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          // link.download = 'INFORME-ERE.pdf'
          link.click();
          // window.URL.revokeObjectURL(url)
        },
        error: error => {
          console.log(error);
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
    } else {
      this.exportarExcelLocal();
      // this.exportarExcelAPI()
    }
  }

  exportarExcelLocal() {
    // Formatear parametros
    const parametros = [];
    const params = this.filtros;
    for (const index in params) {
      let index_formateado = index;
      if (['autor', 'year_oficial', 'tipo_reporte'].includes(index)) continue;
      switch (index) {
        case 'evaluacion':
          index_formateado = 'evaluación 1';
          break;
        case 'evaluacion2':
          index_formateado = 'evaluación 2';
          break;
        case 'cod_ie':
          index_formateado = 'institucion educativa';
          break;
        case 'curso':
          index_formateado = 'area';
          break;
      }
      parametros.push({
        titulo: index_formateado.toUpperCase(),
        valor: params[index],
      });
    }

    // Formatear hojas y columnas
    const worksheets = [
      {
        sheetName: 'Parametros',
        data: parametros,
        columns: [
          { key: 'titulo', header: 'PARÁMETRO' },
          { key: 'valor', header: 'VALOR' },
        ],
      },
      {
        sheetName: 'Comparacion',
        data: this.niveles,
        columns: [
          { key: 'nivel', header: 'NIVEL DE LOGRO' },
          { key: 'valor1', header: 'CANTIDAD 1' },
          { key: 'porcentaje1_num', header: 'PORCENTAJE 1' },
          { key: 'valor2', header: 'CANTIDAD 2' },
          { key: 'porcentaje2_num', header: 'PORCENTAJE 2' },
        ],
      },
      {
        sheetName: 'Evaluacion 1',
        data: this.resultados1,
        columns: [
          { key: 'index', header: 'ITEM' },
          { key: 'cod_ie', header: 'I.E.' },
          { key: 'distrito', header: 'DISTRITO' },
          { key: 'seccion', header: 'SECCIÓN' },
          { key: 'estudiante', header: 'ESTUDIANTE' },
          { key: 'aciertos', header: 'ACIERTOS' },
          { key: 'desaciertos', header: 'DESACIERTOS' },
          { key: 'blancos', header: 'BLANCOS' },
          { key: 'docente', header: 'DOCENTE' },
          { key: 'nivel_logro', header: 'NIVEL DE LOGRO' },
        ],
      },
      {
        sheetName: 'Evaluacion 2',
        data: this.resultados2,
        columns: [
          { key: 'index', header: 'ITEM' },
          { key: 'cod_ie', header: 'I.E.' },
          { key: 'distrito', header: 'DISTRITO' },
          { key: 'seccion', header: 'SECCIÓN' },
          { key: 'estudiante', header: 'ESTUDIANTE' },
          { key: 'aciertos', header: 'ACIERTOS' },
          { key: 'desaciertos', header: 'DESACIERTOS' },
          { key: 'blancos', header: 'BLANCOS' },
          { key: 'docente', header: 'DOCENTE' },
          { key: 'nivel_logro', header: 'NIVEL DE LOGRO' },
        ],
      },
    ];

    SheetToMatrix.exportToExcel(worksheets);
  }

  exportarExcelAPI() {
    this.datosInformes.exportarComparacionExcel(this.formFiltros.value).subscribe({
      next: response => {
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Comparacion-ERE.xlsx';
        link.target = '_blank';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  accionBtnItemTable({ accion, item }) {
    console.log(accion, item);
  }
  selectedItems = [];

  actions: IActionTable[] = [];

  actionsLista: IActionTable[];

  columns = [];

  columns_resultados = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '#',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cod_ie',
      header: 'I.E.',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'distrito',
      header: 'DISTRITO',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'seccion',
      header: 'SECCIÓN',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '25%',
      field: 'estudiante',
      header: 'ESTUDIANTE',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'aciertos',
      header: 'ACIERTOS',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'desaciertos',
      header: 'DESACIERTOS',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'blancos',
      header: 'BLANCOS',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'nivel_logro',
      header: 'Nivel de logro',
      text_header: 'center',
      text: 'center',
    },
  ];

  columns_niveles = [
    {
      type: 'text',
      width: '15rem',
      field: 'nivel',
      header: 'NIVEL DE LOGRO',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'valor1',
      header: 'CANTIDAD',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'porcentaje1',
      header: 'PORCENTAJE',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'valor2',
      header: 'CANTIDAD',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'porcentaje2',
      header: 'PORCENTAJE',
      text_header: 'center',
      text: 'center',
    },
  ];
}
