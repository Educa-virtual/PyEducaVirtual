import { PrimengModule } from '@/app/primeng.module';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { environment } from '@/environments/environment';
import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-actividad-estudiantes-tarea-room',
  standalone: true,
  imports: [ToolbarPrimengComponent, PrimengModule, CardOrderListComponent],
  templateUrl: './actividad-estudiantes-tarea-room.component.html',
  styleUrl: './actividad-estudiantes-tarea-room.component.scss',
})
export class ActividadEstudiantesTareaRoomComponent {
  @Input() data: any = {};

  tareaOptions = [
    { name: 'Individual', value: 0 },
    { name: 'Grupal', value: 1 },
  ];
  tareaAsignar: number;
  tareasFalta: number = 0;
  tareasCulminado: number = 0;
  gruposFalta: number = 0;
  gruposCulminado: number = 0;
  grupoSeleccionado;
  showModal: boolean = false;
  grupos: any[] = [];
  estudiantes: any[] = [];
  nEstudiante: number = null;
  nGrupal: number = null;
  estudianteSeleccionado;
  cTareaTitulo: string;
  cTareaDescripcion: string;
  cTareaEstudianteUrlEstudiante;
  escalaCalificaciones = [];
  iEscalaCalifId;
  cTareaEstudianteComentarioDocente;
  grupoSeleccionadoCalificar = [];
  iTareaCabGrupoId;
  cTareaGrupoUrl;
  cTareaGrupoComentarioDocente;
  nTareaGrupoNota;
  updateTareas() {
    // this.estudianteSeleccionado = null
    // const params = {
    //     petition: 'post',
    //     group: 'aula-virtual',
    //     prefix: 'tareas',
    //     ruta: 'updatexiTareaId',
    //     data: {
    //         opcion: 'ACTUALIZARxiTareaId',
    //         iTareaId: this.iTareaId,
    //         bTareaEsGrupal: this.tareaAsignar ? true : false,
    //     },
    //     params: { skipSuccessMessage: true },
    // }
    // this.getInformation(params, 'update-tareas')
  }

  seleccionarGrupo(item) {
    console.log(item);
    // this.grupoSeleccionadoCalificar = []
    // this.grupoSeleccionadoCalificar.push(item)
    // this.iTareaCabGrupoId = item.iTareaCabGrupoId
    // this.cTareaGrupoUrl = item.cTareaGrupoUrl
    //     ? JSON.parse(item.cTareaGrupoUrl)
    //     : []
    // this.iEscalaCalifId = item.iEscalaCalifId
    // this.cTareaGrupoComentarioDocente = item.cTareaGrupoComentarioDocente
  }
  eliminarTareaCabeceraGrupos(item) {
    console.log(item);
    // this._confirmService.openConfirm({
    //     header:
    //         '¿Esta seguro de eliminar el grupo ' +
    //         item.cTareaGrupoNombre +
    //         ' ?',
    //     accept: () => {
    //         const params = {
    //             petition: 'post',
    //             group: 'aula-virtual',
    //             prefix: 'tarea-cabecera-grupos',
    //             ruta: 'eliminarTareaCabeceraGrupos',
    //             data: item,
    //             params: { skipSuccessMessage: true },
    //         }
    //         this.getInformation(params, 'eliminar-' + params.prefix)
    //     },
    // })
  }

  onGlobalFilter(table: Table, event: Event) {
    if (!table) return;
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  eliminarEstudiante(item) {
    console.log(item);
    // this.confirmationService.confirm({
    //     message:
    //         'Deseas eliminar del grupo al estudiante ' +
    //         item.cPersNombre +
    //         ' ?',
    //     header: 'Eliminar Estudiante del Grupo',
    //     // icon: 'pi pi-info-circle', // Se ha activado el icono predeterminado
    //     acceptButtonStyleClass: 'p-button-success  ', // Estilo para el botón de aceptar
    //     rejectButtonStyleClass: 'p-button-danger', // Estilo para el botón de rechazar
    //     acceptIcon: 'pi pi-check', // Icono de aceptación
    //     rejectIcon: 'pi pi-times', // Icono de rechazo
    //     acceptLabel: 'SI',
    //     rejectLabel: 'No',

    //     accept: () => {
    //         const params = {
    //             petition: 'post',
    //             group: 'aula-virtual',
    //             prefix: 'tarea-estudiantes',
    //             ruta: 'eliminarEstudianteTarea',
    //             data: {
    //                 opcion: 'ACTUALIZARxiTareaEstudianteIdxiEstudianteId-iTareaCabGrupoId',
    //                 iTareaEstudianteId: item.iTareaEstudianteId,
    //                 iEstudianteId: item.iEstudianteId,
    //             },
    //         }
    //         this.getInformation(params, 'eliminar-tareas-estudiantes')
    //     },
    //     reject: () => {},
    // })
  }

  goLinkDocumento(ruta: string) {
    const backend = environment.backend;
    window.open(backend + '/' + ruta, '_blank');
  }

  guardarTareaEstudiantesxDocente() {
    // if (!this.iEscalaCalifId) {
    //     this.messageService.add({
    //         severity: 'warn',
    //         summary: 'Falta Entregar su tarea',
    //         detail: 'Seleccione calaficación para guardar',
    //     })
    //     return
    // }
    // // Verifica que los datos requeridos estén completos antes de continuar
    // if (this.iTareaEstudianteId && this.iEscalaCalifId) {
    //     const params = {
    //         petition: 'post',
    //         group: 'aula-virtual',
    //         prefix: 'tarea-estudiantes',
    //         ruta: 'guardar-calificacion-docente',
    //         data: {
    //             opcion: 'GUARDAR-CALIFICACION-DOCENTE',
    //             iTareaEstudianteId: this.iTareaEstudianteId,
    //             iEscalaCalifId: this.iEscalaCalifId,
    //             cTareaEstudianteComentarioDocente:
    //                 this.cTareaEstudianteComentarioDocente,
    //             nTareaEstudianteNota: 0,
    //         },
    //     }
    //     this.getInformation(params, 'guardar-calificacion-docente')
    // }
  }

  guardarTareaCabeceraGruposxDocente() {
    // if (!this.iEscalaCalifId) {
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Falta Entregar su tarea',
    //     detail: 'Seleccione calaficación para guardar',
    //   })
    //   return
    // }
    // const params = {
    //   petition: 'post',
    //   group: 'aula-virtual',
    //   prefix: 'tarea-cabecera-grupos',
    //   ruta: 'guardarCalificacionTareaCabeceraGruposDocente',
    //   data: {
    //     opcion: 'GUARDAR-CALIFICACION-DOCENTE',
    //     iTareaCabGrupoId: this.iTareaCabGrupoId,
    //     iEscalaCalifId: this.iEscalaCalifId,
    //     cTareaGrupoComentarioDocente: this.cTareaGrupoComentarioDocente,
    //     nTareaGrupoNota: 0,
    //   },
    // }
    // this.getInformation(
    //   params,
    //   'guardar-calificacion-tarea-cabecera-grupos-docente'
    // )
  }
}
