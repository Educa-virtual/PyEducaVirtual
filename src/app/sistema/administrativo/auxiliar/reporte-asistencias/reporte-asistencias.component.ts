import { Component, inject, OnInit } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
@Component({
  selector: 'app-reporte-asistencias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-asistencias.component.html',
  styleUrl: './reporte-asistencias.component.scss',
})
export class ReporteAsistenciasComponent implements OnInit {
  private servicioGeneral = inject(GeneralService);
  dremoiYAcadId: any;
  dremoPerfil: any;
  dias: any = [];
  barra: any[] = [[], [], [], [], [], [], []];
  configuracion: any = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    aspectRatio: 0.4,
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
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            weight: 500,
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

  grafico: any;

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
      textColor: 'cyan-50-boton',
      bgColor: 'bg-yellow-500',
    },
    {
      iTipoAsiId: '7',
      cTipoAsiLetra: '-',
      cTipoAsiNombre: 'Sin Registro',
      textColor: 'yellow-50-boton',
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
  }

  ReporteGraficoEstudiante() {
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
        const dato = data.data;
        const nombres = dato.map(item => item.completo);
        const documentStyle = getComputedStyle(document.documentElement);

        dato.forEach(lista => {
          lista.asistencia = JSON.parse(lista.asistencia);
          const indice = lista.asistencia[0];
          const resta =
            indice.total -
            indice.sinRegistro -
            indice.inasistencia -
            indice.inasistenciaJustificada -
            indice.tardanza -
            indice.tardanzaJustificada;

          const totalPorcentaje = ((resta / indice.total) * 100).toFixed(2);
          const asistio = ((indice.asistio / indice.total) * 100).toFixed(2);
          const inasistencia = ((indice.inasistencia / indice.total) * 100).toFixed(2);
          const inasistenciaJustificada = (
            (indice.inasistenciaJustificada / indice.total) *
            100
          ).toFixed(2);
          const sinRegistro = ((indice.sinRegistro / indice.total) * 100).toFixed(2);
          const tardanza = (indice.tardanza / indice.total).toFixed(2);
          const tardanzaJustificada = (indice.tardanzaJustificada / indice.total).toFixed(2);

          this.barra[0].push(asistio);
          this.barra[1].push(inasistencia);
          this.barra[2].push(inasistenciaJustificada);
          this.barra[3].push(sinRegistro);
          this.barra[4].push(tardanza);
          this.barra[5].push(tardanzaJustificada);
          this.barra[6].push(totalPorcentaje);
        });

        this.grafico = {
          labels: nombres,
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
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: this.barra[4],
            },
            {
              label: 'Tardanza Justificada',
              backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
              data: this.barra[5],
            },
            {
              label: 'Total de Clases',
              backgroundColor: documentStyle.getPropertyValue('--black-500'),
              data: this.barra[6],
            },
          ],
        };
      },
      error: err => {
        console.log(err);
      },
    });
  }

  buscarReporteEstudiante() {
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
          list.asistencia = JSON.parse(list.asistencia);

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
}
