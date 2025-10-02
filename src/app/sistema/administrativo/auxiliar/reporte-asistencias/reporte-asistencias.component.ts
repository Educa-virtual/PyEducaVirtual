import { Component, inject, OnInit } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-reporte-asistencias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-asistencias.component.html',
  styleUrl: './reporte-asistencias.component.scss',
})
export class ReporteAsistenciasComponent implements OnInit {
  private servicioGeneral = inject(GeneralService);
  estudiante: any = {};
  plugin = ChartDataLabels;
  dremoiYAcadId: any;
  dremoPerfil: any;
  nombres: any = [];
  total: any;
  dias: any = [];
  barra: any[] = [[], [], [], [], [], []];
  inhabilitar: boolean = true;
  inhabilitarBoton: boolean = true;
  registros: any[] = [];
  configuracion: any = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.3,
    plugins: {
      legend: {
        labels: {
          color: 'text-white',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        axis: 'y',
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: '#000',
        formatter: (value: number) => {
          const porcentaje = ((value / this.total) * 100).toFixed(2);
          return value === 0 ? '' : value + ' - ' + porcentaje + '%';
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: 200,
          },
        },
        grid: {
          drawBorder: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false,
        },
        grid: {
          drawBorder: false,
        },
      },
    },
  };

  opcionDona: any = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',
        formatter: value => {
          return value ? value : '';
        },
        font: {
          weight: 'bold' as const,
          size: 14,
        },
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  grafico: any;
  dona: any;

  meses: any = [
    { nombre: 'Enero', numero: '01', dia: '31' },
    { nombre: 'Febrero', numero: '02', dia: '28' },
    { nombre: 'Marzo', numero: '03', dia: '31' },
    { nombre: 'Abril', numero: '04', dia: '30' },
    { nombre: 'Mayo', numero: '05', dia: '31' },
    { nombre: 'Junio', numero: '06', dia: '30' },
    { nombre: 'Julio', numero: '07', dia: '31' },
    { nombre: 'Agosto', numero: '08', dia: '31' },
    { nombre: 'Septiembre', numero: '09', dia: '30' },
    { nombre: 'Octubre', numero: '10', dia: '31' },
    { nombre: 'Noviembre', numero: '11', dia: '30' },
    { nombre: 'Diciembre', numero: '12', dia: '31' },
  ];

  opcion: any = [
    { id: 1, nombre: 'reporte por grado y Seccion' },
    { id: 2, nombre: 'reporte por alumno' },
    { id: 3, nombre: 'reporte grafico Grado y Seccion' },
    { id: 4, nombre: 'reporte grafico por alumno' },
  ];

  asistencias = [
    {
      id: undefined,
      indice: undefined,
      nombre: 'Todos',
      seccion: '',
      color: '',
    },
    {
      id: 0,
      indice: 1,
      nombre: 'Asistencia',
      seccion: 'asistio',
      color: '--green-500',
    },
    {
      id: 1,
      indice: 2,
      nombre: 'Tardanza',
      seccion: 'tardanza',
      color: '--orange-500',
    },
    {
      id: 2,
      indice: 3,
      nombre: 'Inasistencia',
      seccion: 'inasistencia',
      color: '--red-500',
    },
    {
      id: 3,
      indice: 4,
      nombre: 'Inasistencia Justificada',
      seccion: 'inasistenciaJustificada',
      color: '--primary-500',
    },
    {
      id: 4,
      indice: 5,
      nombre: 'Sin Registro',
      seccion: 'sinRegistro',
      color: '--yellow-500',
    },
    {
      id: 5,
      indice: 6,
      nombre: 'Tardanza Justificada',
      seccion: 'tardanzaJustificada',
      color: '--cyan-500',
    },
  ];

  tipoAsistencia = [
    {
      iTipoAsiId: '1',
      cTipoAsiLetra: 'X',
      cTipoAsiNombre: 'Asistio',
      textColor: 'green-50-boton',
      bgColor: 'bg-green-500',
    },
    {
      iTipoAsiId: '2',
      cTipoAsiLetra: 'T',
      cTipoAsiNombre: 'Tardanza',
      textColor: 'red-50-boton',
      bgColor: 'bg-orange-500',
    },
    {
      iTipoAsiId: '3',
      cTipoAsiLetra: 'I',
      cTipoAsiNombre: 'Inasistencia',
      textColor: 'primary-50-boton',
      bgColor: 'bg-red-500',
    },
    {
      iTipoAsiId: '4',
      cTipoAsiLetra: 'J',
      cTipoAsiNombre: 'Inasistencia Justificada',
      textColor: 'orange-50-boton',
      bgColor: 'bg-primary-500',
    },
    {
      iTipoAsiId: '9',
      cTipoAsiLetra: 'P',
      cTipoAsiNombre: 'Tardanza Justificada',
      textColor: 'yellow-50-boton',
      bgColor: 'bg-yellow-500',
    },
    {
      iTipoAsiId: '7',
      cTipoAsiLetra: '-',
      cTipoAsiNombre: 'Sin Registro',
      textColor: 'cyan-50-boton',
      bgColor: 'bg-cyan-500',
    },
  ];

  aulas: any = [];
  alumnos: any = [];
  tipo: any = {};
  datos: any = {};
  grado: any = [];
  seccion: any = [];
  finalizar: boolean = false;

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService
  ) {
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.dremoPerfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    this.buscarAulas();
  }

  ReporteGraficoGradoSeccion() {
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'buscar-reporte',
      data: {
        opcion: 'reporte-aula',
        iGradoId: this.datos.iGradoId,
        iSeccionId: this.datos.iSeccionId,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
      },
    };
    this.conecionReporteGrafico(enlace);
    this.inhabilitar = false;
  }

  ReporteGraficoEstudiante() {
    if (!this.datos.cPersDocumento && !this.datos.cEstCodigo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fallo en la Busqueda',
        detail: 'Falta Ingresar Datos para la Busqueda',
      });
      return;
    }

    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'buscar-reporte',
      data: {
        opcion: 'reporte-estudiante',
        cPersDocumento: this.datos.cPersDocumento,
        cEstCodigo: this.datos.cEstCodigo,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
      },
    };
    this.conecionReporteGrafico(enlace);
  }

  conecionReporteGrafico(enlace: any) {
    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: data => {
        this.registros = data.data;
        this.registros.forEach(lista => {
          lista.asistencia = JSON.parse(lista.asistencia);
        });
        if (this.tipo.id === 3) {
          this.filtrarGrafica();
        }
        if (this.tipo.id === 4) {
          this.filtrarDona();
        }
      },
      error: err => {
        console.log(err);
        this.inhabilitar = true;
      },
    });
  }
  filtrarDona() {
    const tipo = this.registros[0].asistencia[0];
    this.estudiante.nombre = this.registros[0].completo;
    this.estudiante.codigo = this.registros[0].cEstCodigo;
    this.estudiante.dni = this.registros[0].cPersDocumento;
    this.estudiante.grado = this.registros[0].cGradoNombre;
    this.estudiante.seccion = this.registros[0].cSeccionNombre;
    const documentStyle = getComputedStyle(document.documentElement);

    const conjunto = [
      tipo.asistio,
      tipo.tardanza,
      tipo.inasistencia,
      tipo.inasistenciaJustificada,
      tipo.sinRegistro,
      tipo.tardanzaJustificada,
    ];

    const etiquetas = [
      'Asistencia',
      'Tardanza',
      'Inasistencia',
      'Inasistencia Justificada',
      'Sin Registro',
      'Tardanza Justificada',
    ];
    const color = [
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--orange-500'),
      documentStyle.getPropertyValue('--red-500'),
      documentStyle.getPropertyValue('--primary-500'),
      documentStyle.getPropertyValue('--cyan-500'),
      documentStyle.getPropertyValue('--yellow-500'),
    ];

    const hover = [
      documentStyle.getPropertyValue('--green-400'),
      documentStyle.getPropertyValue('--orange-400'),
      documentStyle.getPropertyValue('--red-400'),
      documentStyle.getPropertyValue('--primary-400'),
      documentStyle.getPropertyValue('--cyan-400'),
      documentStyle.getPropertyValue('--yellow-400'),
    ];

    this.dona = {
      labels: etiquetas,
      datasets: [
        {
          data: conjunto,
          backgroundColor: color,
          hoverBackgroundColor: hover,
        },
      ],
    };
  }

  /**
     * Se recorre la lista de alumnos
    // @param filtrar
  */
  filtrarGrafica() {
    this.inhabilitarBoton = true;
    this.barra = [[], [], [], [], [], []];
    this.total = [];
    this.nombres = [];
    this.total = this.registros[0].asistencia[0].total;

    const documentStyle = getComputedStyle(document.documentElement);

    const datos = this.tipo.tipoAsistencia;

    const tipo = this.asistencias.find(list => list.indice === datos);
    const filtrar = !datos
      ? this.registros
      : this.registros.sort(
          (a, b) => b.asistencia[0][tipo.seccion] - a.asistencia[0][tipo.seccion]
        );
    filtrar.forEach(lista => {
      const nombre = lista.completo;

      const indice = lista.asistencia[0];
      const asistio = indice.asistio;
      const inasistencia = indice.inasistencia;
      const inasistenciaJustificada = indice.inasistenciaJustificada;
      const sinRegistro = indice.sinRegistro;
      const tardanza = indice.tardanza;
      const tardanzaJustificada = indice.tardanzaJustificada;

      this.nombres.push(nombre);
      this.barra[0].push(asistio);
      this.barra[1].push(tardanza);
      this.barra[2].push(inasistencia);
      this.barra[3].push(inasistenciaJustificada);
      this.barra[4].push(sinRegistro);
      this.barra[5].push(tardanzaJustificada);
      if (!this.tipo.tipoAsistencia) {
        this.grafico = {
          labels: this.nombres,
          datasets: [
            {
              label: 'Asistencia',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              data: this.barra[0],
            },
            {
              label: 'Tardanza',
              backgroundColor: documentStyle.getPropertyValue('--orange-500'),
              data: this.barra[1],
            },
            {
              label: 'Inasistencia',
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
              data: this.barra[2],
            },
            {
              label: 'Inasistencia Justificada',
              backgroundColor: documentStyle.getPropertyValue('--primary-500'),
              data: this.barra[3],
            },
            {
              label: 'Sin Registro',
              backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
              data: this.barra[4],
            },
            {
              label: 'Tardanza Justificada',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: this.barra[5],
            },
          ],
        };
      } else {
        const tipo = this.asistencias.find(lista => {
          return lista.indice === this.tipo.tipoAsistencia;
        });

        this.grafico = {
          labels: this.nombres,
          datasets: [
            {
              label: tipo.nombre,
              backgroundColor: documentStyle.getPropertyValue(tipo.color),
              data: this.barra[tipo.id],
            },
          ],
        };
      }
    });
  }

  buscarReporteEstudiante() {
    if (!this.tipo.numero && (!this.datos.cEstCodigo || !this.datos.cPersDocumento)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fallo en la Busqueda',
        detail: 'Falta Ingresar Datos para la Busqueda',
      });
      return;
    }

    const year = this.dremoiYAcadId;
    const filtrar = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    this.meses[1].dia = filtrar ? '29' : '28';

    const revisar = this.meses.find(item => item.numero === this.tipo.numero).dia;
    this.dias = Array.from({ length: revisar }, (_, i) => i + 1);
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'buscar-reporte',
      data: {
        opcion: 'buscar-estudiante',
        mes: this.tipo.numero,
        cPersDocumento: this.datos.cPersDocumento,
        cEstCodigo: this.datos.cEstCodigo,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
      },
    };

    this.conexionReporte(enlace);
  }

  buscarReporteAula() {
    if (!this.datos.iGradoId || !this.datos.iSeccionId || !this.tipo.numero) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fallo en la Busqueda',
        detail: 'Falta Ingresar Datos para la Busqueda',
      });
      return;
    }

    const year = this.dremoiYAcadId;
    const filtrar = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    this.meses[1].dia = filtrar ? '29' : '28';

    const revisar = this.meses.find(item => item.numero === this.tipo.numero).dia;
    this.dias = Array.from({ length: revisar }, (_, i) => i + 1);
    const enlace = {
      petition: 'post',
      group: 'asi',
      prefix: 'grupos',
      ruta: 'buscar-reporte',
      data: {
        opcion: 'buscar-aula',
        mes: this.tipo.numero,
        iGradoId: this.datos.iGradoId,
        iSeccionId: this.datos.iSeccionId,
        iSedeId: this.dremoPerfil.iSedeId,
        iYAcadId: this.dremoiYAcadId,
      },
    };

    this.conexionReporte(enlace);
  }

  conexionReporte(enlace: any) {
    this.servicioGeneral.getRecibirDatos(enlace).subscribe({
      next: data => {
        this.alumnos = data.data;

        this.alumnos.forEach(list => {
          list.asistencia = list.asistencia ? JSON.parse(list.asistencia) : [];

          list.asistencia.forEach(item => {
            const index = parseInt(item.dtAsistencia.split('-')[2]);
            item.diaEspecifico = index;
            const lista = this.tipoAsistencia.find(grupo => grupo.iTipoAsiId == item.iTipoAsiId);
            item.bgColor = lista.bgColor;
            item.textColor = 'text-white';
          });

          this.dias.forEach(item => {
            const lista = list.asistencia.find(list => list.diaEspecifico === item);
            if (!lista) {
              const nuevo = {
                diaEspecifico: item,
                iTipoAsiId: 7,
                cTipoAsiLetra: '-',
                dtAsistencia: '',
                textColor: 'text-white',
                bgColor: 'bg-cyan-500',
              };
              list.asistencia.push(nuevo);
            }
          });
          list.asistencia.sort((a, b) => a.diaEspecifico - b.diaEspecifico);
        });
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.finalizar = false;
      },
    });
  }

  buscarAulas() {
    this.finalizar = true;

    const buscar = {
      iSedeId: this.dremoPerfil.iSedeId,
      iYAcadId: this.dremoiYAcadId,
    };

    this.servicioGeneral
      .getRecibirDatos({
        petition: 'post',
        group: 'acad',
        prefix: 'calendarioAcademico',
        ruta: 'searchAcademico',
        data: {
          json: JSON.stringify(buscar),
          _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
        },
      })
      .subscribe({
        next: data => {
          this.aulas = data.data;
          this.grado = this.removeDuplicatesByiGradoId(this.aulas);
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.finalizar = false;
        },
      });
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }

  filtrarSeccion() {
    const gruposUnicos = new Set();
    this.seccion = this.aulas
      .filter(item => item.iGradoId === this.datos.iGradoId)
      .filter(item => {
        if (gruposUnicos.has(item.iSeccionId)) return false;
        gruposUnicos.add(item.iSeccionId);
        return true;
      });
  }

  exportarExcel() {
    const titulo = this.opcion.find((m: any) => m.id === this.tipo.id)?.nombre || '';
    const mes = this.meses.find((m: any) => m.numero === this.tipo.numero)?.nombre || '';
    const grado =
      this.grado.find((m: any) => m.iGradoId === this.datos.iGradoId)?.cSeccionNombre || '';
    const seccion =
      this.seccion.find((m: any) => m.iSeccionId === this.datos.iSeccionId)?.cSeccionNombre || '';

    const encabezado = [
      ['REPORTE DE ASISTENCIA ( ' + titulo + ')'],
      [`Mes: ${mes}`, `Grado: ${grado}`, `Sección: ${seccion}`],
      [`Fecha: ${new Date().toLocaleDateString()}`],
      [''],
      ['Leyenda:'],
      [this.tipoAsistencia.map((l: any) => `${l.cTipoAsiNombre} (${l.cTipoAsiLetra})`).join(' | ')],
      [''],
    ];
    // Transformar los datos en un formato plano para Excel
    const alumnos = this.alumnos;
    const dataExport = alumnos.map(alumno => {
      const fila: any = {
        Nombre: alumno.completo,
        Documento: alumno.cPersDocumento,
      };

      alumno.asistencia.forEach((a: any, index: number) => {
        fila[`Día ${index + 1}`] = a.cTipoAsiLetra; // ej: P, F, T, -
      });

      return fila;
    });
    // 2️⃣ Crear worksheet vacío
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    //  1️⃣Agregar cabecera y leyenda
    XLSX.utils.sheet_add_aoa(worksheet, encabezado, { origin: 'A1' });
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Título "REPORTE..." ocupa A1:F1
      { s: { r: 5, c: 0 }, e: { r: 5, c: 10 } }, // Leyenda ocupa A6:F6
    ];

    // 3️⃣ Insertar los datos desde la fila 7 en adelante
    XLSX.utils.sheet_add_json(worksheet, dataExport, { origin: 'A8', skipHeader: false });
    // Crear hoja
    //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { Asistencia: worksheet },
      SheetNames: ['Asistencia'],
    };

    // Generar buffer y guardar archivo
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  //apersonamiento de los proceso
}
