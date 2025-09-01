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
