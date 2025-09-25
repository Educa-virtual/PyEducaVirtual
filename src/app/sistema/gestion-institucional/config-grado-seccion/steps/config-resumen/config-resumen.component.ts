import { Component, inject, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component';

import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import {
  TablePrimengComponent,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
@Component({
  selector: 'app-config-resumen',
  standalone: true,
  imports: [
    StepsModule,
    PrimengModule,
    ContainerPageComponent,
    TablePrimengComponent,
    ToolbarPrimengComponent,
  ],
  templateUrl: './config-resumen.component.html',
  styleUrl: './config-resumen.component.scss',
})
export class ConfigResumenComponent implements OnInit {
  items: MenuItem[];
  customers: any = [];

  nivelesCiclos: any = [];
  lista: any;
  groupedData: any;
  dynamicColumns: any;

  r_horas: any[];
  r_secciones: any[];
  configuracion: any[];
  perfil: any[];
  bConfigEsBilingue: any = 0;
  totalHoras: number = 0;
  totalHorasPendientes: number = 0;
  total_aulas: number = 0;

  tablaPivot: any[] = []; // Inicializar como un array vacío
  lista_grados: any[] = [];
  docentes_Asignados: number = 0;
  docentes_pendientes: number = 0;

  horas_Asignadas: number = 0;
  cantidad_ambientes: number = 0;
  anio: string = '';

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private store: LocalStoreService
  ) {
    this.items = this.stepService.itemsStep;
    this.configuracion = this.stepService.configuracion;
    this.perfil = this.stepService.perfil;
    console.log(this.perfil, 'this.perfil');
  }

  ngOnInit(): void {
    try {
      this.reporteHorasNivelGrado();
      this.reporteSeccionesNivelGrado();
      this.bConfigEsBilingue = this.configuracion[0].bConfigEsBilingue > 0 ? 'SI' : 'NO';
      this.anio = this.configuracion[0].cYAcadNombre;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en conexion al servidor',
        detail: 'La conexion excedió tiempo de espera',
      });
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }
  }

  //REPORTES
  reporteSeccionesNivelGrado() {
    this.query
      .reporteSeccionesNivelGrado({
        iNivelTipoId: this.configuracion[0].iNivelTipoId,
        iConfigId: this.configuracion[0].iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.r_secciones = data.data.map(item => ({
            ...item,
            parsedSecciones: item.secciones // Parsear, ordenar y convertir a cadena las secciones
              ? JSON.parse(item.secciones)
                  .map(sec => sec.cSeccionNombre)
                  // .filter((sec, index, self) => self.indexOf(sec) === index) // Quitar duplicados
                  .sort() // Ordenar alfabéticamente
                  .join(', ') // Convertir a cadena separada por comas
              : null, // Si no hay secciones, manejar como null
          }));
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en conexion al servidor',
            detail: 'La conexion excedió tiempo de espera ' + error,
          });
        },
      });
  }
  reporteHorasNivelGrado() {
    this.query
      .reporteHorasNivelGrado({
        iNivelTipoId: this.configuracion[0].iNivelTipoId,
        iProgId: this.configuracion[0].iProgId,
        iConfigId: this.configuracion[0].iConfigId,
        iYAcadId: this.configuracion[0].iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          // this.total_aulas = data.data[0].registrados
          this.r_horas = data.data;

          // Suponiendo que tu json se llama "registros"
          const datos: {
            iCursoId: number;
            iGradoId: number;
            iTotalHoras?: number;
            asig_docente?: number;
          }[] = data.data;
          //Ordenar registros
          const registros = [...datos].sort((a, b) => a.iGradoId - b.iGradoId);

          //Asignar la cantidad de docentes asignados
          this.docentes_Asignados = this.r_horas[0].docentesAsignados;
          this.docentes_pendientes =
            Number(this.r_horas[0].areas) - Number(this.r_horas[0].docentesAsignados);

          //Horas asignadas
          this.horas_Asignadas = this.r_horas[0].horaAsignadas;
          this.cantidad_ambientes = this.r_horas[0].cantidadAmbientes;
          this.total_aulas = this.r_horas[0].registrados;

          // Obtener lista única de cursos y grados
          const cursos = [...new Map(registros.map(item => [item.iCursoId, item])).values()];
          const grados = [
            ...new Map(registros.map(item => [Number(item.iGradoId), item])).values(),
          ];

          this.lista_grados = grados;

          // Crear estructura agrupada
          this.tablaPivot = cursos.map(curso => {
            const fila: any = {
              iCursoId: (curso as { iCursoId: number }).iCursoId,
              cursoNombre: (curso as { cCursoNombre?: string }).cCursoNombre || '', // si tienes campo de nombre de curso
            };

            grados.forEach(grado => {
              // Filtrar registros que coincidan con el curso y grado actual
              const registrosFiltrados = registros.filter(
                r => r.iCursoId === curso.iCursoId && r.iGradoId === grado.iGradoId
              );

              // Sumar las iTotalHoras de esos registros
              const sumaHoras = registrosFiltrados.reduce(
                (acc, curr) => acc + (Number(curr.iTotalHoras) || 0),
                0
              );

              // Sumar las asig_docente de esos registros
              const sumaHorasAsignadas = registrosFiltrados.reduce(
                (acc, curr) => acc + (Number(curr.asig_docente) || 0),
                0
              );

              // Agregar las propiedades dinámicamente a la fila
              fila[`grado_${grado.iGradoId}`] = sumaHoras;
              fila[`asig_${grado.iGradoId}`] = sumaHorasAsignadas;
            });

            return fila;
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en conexion al servidor',
            detail: 'La conexion excedió tiempo de espera ' + error.message,
          });
        },
        complete: () => {
          const totalHoras = this.r_horas.reduce(
            (sum, item) => sum + (Number(item.iTotalHoras) || 0),
            0
          );

          this.totalHoras = totalHoras;
          this.totalHorasPendientes =
            Number(this.totalHoras) - Number(this.r_horas[0].horaAsignadas);
        },
      });
  }

  reportePDFResumenAmbientes() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'gestionInstitucional',
      ruta: 'reportePDFResumenAmbientes',
      data: {
        iNivelTipoId: this.configuracion[0].iNivelTipoId,
        total_aulas: this.total_aulas,
        r_horas: this.r_horas,
        secciones: this.r_secciones,
        totalHoras: this.totalHoras,
        bConfigEsBilingue: this.bConfigEsBilingue,
        totalHorasPendientes: this.totalHorasPendientes,
        perfil: this.perfil,
        configuracion: this.configuracion,
        lista_grados: this.lista_grados,
        tablaPivot: this.tablaPivot,
      },
    };
    this.query.generarPdf(params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_ambientes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'Error en el procesamiento: ' + error.message,
        });
      },
    });
  }

  confirm() {
    this._confirmService.openConfiSave({
      message: '¿Estás seguro de que deseas guardar y continuar?',
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.router.navigate(['/gestion-institucional/configGradoSeccion']);
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

  accionBtnItemTable({ accion }) {
    if (accion === 'retornar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas regresar al paso anterior?',
        header: 'Advertencia de autoguardado',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.router.navigate(['/gestion-institucional/asignar-grado']);
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

    if (accion === 'reporte') {
      this.reportePDFResumenAmbientes();
    }
  }
  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    {
      labelTooltip: 'generar resumen',
      text: 'Generar resumen',
      icon: 'pi pi-file-pdf',
      accion: 'reporte',
      class: 'p-button-danger',
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
  ];
  columnSeccion = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'N°',
      text_header: 'left',
      text: 'left',
    },

    {
      type: 'text',
      width: '7rem',
      field: 'cNivelTipoNombre',
      header: 'Nivel',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'grado',
      header: 'Grado/ Edades',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'parsedSecciones',
      header: 'Secciones',
      text_header: 'center',
      text: 'left',
    },
  ];
}
