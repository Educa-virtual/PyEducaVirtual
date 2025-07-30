import { PrimengModule } from '@/app/primeng.module';
//import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core'; //inject,
//import { MessageService } from 'primeng/api'
//import { Router } from '@angular/router'
import { RegistrarSugerenciaComponent } from './registrar-sugerencia/registrar-sugerencia.component';
import { BuzonSugerenciasService } from './services/buzon-sugerencias.service';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { VerSugerenciaComponent } from './ver-sugerencia/ver-sugerencia.component';
//import { BuzonSugerenciasService } from './services/buzon-sugerencias.service'

@Component({
  selector: 'app-buzon-sugerencias',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarSugerenciaComponent,
    VerSugerenciaComponent,
  ],
  templateUrl: './buzon-sugerencias.component.html',
  styleUrl: './buzon-sugerencias.component.scss',
})
export class BuzonSugerenciasComponent implements OnInit {
  prioridades: any[];
  formularioNuevoHeader: string;
  mostrarFormularioNuevo: boolean = false;
  formularioVerHeader: string;
  mostrarFormularioVer: boolean = false;
  perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'));
  usuarioEstudiante: boolean = this.perfil.iPerfilId == 80;
  //form: FormGroup
  dataSugerencias: any[];
  selectedItem: any;
  actionsLista: IActionTable[];

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dtFechaCreacion',
      header: 'Fecha',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'cAsunto',
      header: 'Asunto',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'tag',
      width: '2rem',
      field: 'cPrioridadNombre',
      header: 'Prioridad',
      styles: {
        Alta: 'danger',
        Baja: 'success',
        Media: 'warning',
      },
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cNombreDirector',
      header: 'Nombre del Director',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cRespuesta',
      header: 'Respuesta del director',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  constructor(
    //private fb: FormBuilder,
    private buzonSugerenciasService: BuzonSugerenciasService,
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit() {
    this.obtenerListaSugerencias();
  }

  listenSugerenciaRegistrada(event: boolean) {
    if (event == true) {
      this.mostrarFormularioNuevo = false;
      this.obtenerListaSugerencias();
    }
  }

  listenDialogVerSugerencia(event: boolean) {
    if (event == false) {
      this.mostrarFormularioVer = false;
    }
  }

  nuevaSugerencia() {
    this.formularioNuevoHeader = 'Nueva sugerencia';
    this.mostrarFormularioNuevo = true;
  }

  verSugerencia() {
    this.formularioVerHeader = 'Ver sugerencia';
    this.mostrarFormularioVer = true;
  }

  /*resetearInputs() {
        this.form.reset()
    }*/

  obtenerListaSugerencias() {
    this.buzonSugerenciasService.obtenerListaSugerencias().subscribe({
      next: (data: any) => {
        this.dataSugerencias = data.data;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener sugerencias',
          detail: error.error.message,
        });
      },
    });
  }

  /**
   * Eliminar sugerencia segun id
   * @param item sugerencia a eliminar
   */
  eliminarSugerencia(item: any) {
    this.buzonSugerenciasService.eliminarSugerencia(item.iSugerenciaId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se ha eliminado la sugerencia',
        });
        this.dataSugerencias = this.dataSugerencias.filter(
          (sug: any) => sug.iSugerenciaId !== item.iSugerenciaId
        );
      },
      error: error => {
        console.error('Error eliminando sugerencia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  /**
   * Mostrar modal para editar sugerencia
   * @param item sugerencia seleccionada en tabla
   */
  /*editarSugerencia(item: any) {
        this.formularioHeader = 'Editar sugerencia'
        this.disable_form = false
        this.setFormSugerencia(item)
        this.registrar_visible = true
    }*/

  /**
   * Mostrar modal para ver sugerencia
   * @param item sugerencia seleccionada en tabla
   */
  /*mostrarSugerencia(item: any) {
        this.formularioHeader = 'Ver sugerencia'
        this.disable_form = true
        this.setFormSugerencia(item)
        this.registrar_visible = true
        this.disableForm(true)
    }*/

  /**
   * Limpiar formulario
   */

  /**
   * Deshabilitar inputs de formulario
   * @param disable booleano para deshabilitar o habilitar
   */
  /*disableForm(disable: boolean) {
        if (disable) {
            this.form.get('cAsunto')?.disable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.disable()
            this.form.get('iPrioridadId')?.disable()
        } else {
            this.form.get('cAsunto')?.enable()
            this.form.get('cSugerencia')?.enable()
            this.form.get('iDestinoId')?.enable()
            this.form.get('iPrioridadId')?.enable()
        }
    }*/

  /**
   * Rellenar formulario con datos de sugerencia
   * @param item sugerencia seleccionada en tabla
   */
  /*setFormSugerencia(item: any) {
        this.form.get('cAsunto')?.setValue(item.asunto)
        this.form.get('cSugerencia')?.setValue(item.sugerencia)
        this.form.get('iDestinoId')?.setValue(item.destino_id)
        this.form.get('iPrioridadId')?.setValue(item.prioridad_id)
        this.registrar_visible = true
    }
*/

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'eliminar':
        this.confirmationModalService.openConfirm({
          header: '¿Está seguro de eliminar la sugerencia?',
          accept: () => {
            this.eliminarSugerencia(item);
          },
        });
        break;
      case 'ver':
        this.selectedItem = item;
        this.verSugerencia();
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Ver sugerencia',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Eliminar sugerencia',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      /*isVisible: (row) => {
                return row.iEstado === 1 && 2 == this.perfil.iCredId
            },*/
    },
  ];
}
