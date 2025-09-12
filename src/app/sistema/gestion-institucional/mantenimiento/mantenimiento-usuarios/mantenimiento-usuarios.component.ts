import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';

import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

import { MantenimientoSearchUsuarioComponent } from '../mantenimiento-search-usuario/mantenimiento-search-usuario.component';
import { MantenimientoAddPerfilComponent } from '../mantenimiento-add-perfil/mantenimiento-add-perfil.component';
import { MantenimientoAddUserComponent } from '../mantenimiento-add-user/mantenimiento-add-user.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
@Component({
  selector: 'app-mantenimiento-usuarios',
  standalone: true,
  imports: [
    PrimengModule,
    MantenimientoSearchUsuarioComponent,
    MantenimientoAddPerfilComponent,
    MantenimientoAddUserComponent,
  ],

  templateUrl: './mantenimiento-usuarios.component.html',
  styleUrl: './mantenimiento-usuarios.component.scss',
})
export class MantenimientoUsuariosComponent implements OnInit {
  iSedeId: number;
  iYAcadId: number;
  iCredId: number;

  perfiles = []; // lista de perfiles
  search_perfiles: any[] = []; // lista de perfiles

  usuario: any; //Informacion del usuario seleccionado
  perfil_usuario: any; //Informacion del perfil seleccionado
  perfil: number = 0;
  option: string = 'Director';

  modal_visible: boolean = false;
  tipo_documentos: any = []; //lista de tipo de documentos
  titulo: string = 'Accesos de usuario IE';

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private store: LocalStoreService,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    const perfil = this.store.getItem('dremoPerfil');

    this.iSedeId = perfil.iSedeId;
    this.iYAcadId = this.store.getItem('dremoiYAcadId');

    this.iCredId = perfil.iCredId;
  }

  ngOnInit(): void {
    this.getPerfilSedes();
    this.getTipoDocumento();
  }

  getPerfilSedes() {
    // obtiene los perfiles para la sede
    this.query
      .searchCalAcademico({
        esquema: 'seg',
        tabla: 'perfiles',
        campos: '*',
        condicion:
          'iTipoPerfilId = 7 or iTipoPerfilId = 4 or iTipoPerfilId = 10 or iTipoPerfilId = 12 or iTipoPerfilId = 9 or iTipoPerfilId = 8',
      })
      .subscribe({
        next: (data: any) => {
          this.search_perfiles = data.data;
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
        complete: () => {
          // this.search_perfiles.unshift({
          //     iPerfilId: '0',
          //     cPerfilNombre: 'Todos los perfiles',
          // }) // console.log('Request completed')
        },
      });
  }

  getTipoDocumento(): void {
    this.query
      .searchCalAcademico({
        esquema: 'grl',
        tabla: 'tipos_Identificaciones',
        campos: '*',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.tipo_documentos = data.data;
        },
        error: error => {
          console.error('Error fetching Tipo documentos:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
        //    complete: () => {
        //     console.log(this.tipo_documentos)
        //        // console.log('Request completed')
        //    },
      });
  }

  accionBtnItemTable({ accion, item }) {
    // console.log(this.selectedItems, 'selectedItems')
    console.log(accion, 'accion', item, 'item');
    if (accion === 'editar') {
      console.log(item, 'btnTable');
    }
    if (accion === 'asignar_perfil') {
      // envia la informacion del perfil seleccionado
      this.usuario = item;

      // this.getPerfilUsuario()
    }
    if (accion === 'resetear_perfil') {
      //implementar reseteo de contraseña

      this.resetearClave(item);
    }
    if (accion === 'nuevo_perfil') {
      // envia la informacion del perfil seleccionado
      this.option = 'Nuevo';
      this.modal_visible = true; //Mostrar modal para registro de usuarior
      // this.getPerfilUsuario()
    }
    if (accion === 'nuevo_perfil_generado') {
      // envia la informacion del perfil seleccionado
      this.option = 'Director';
      this.modal_visible = false; //Mostrar modal para registro de usuarior
      // this.getPerfilUsuario()
    }
  }

  resetearClave(event: any) {
    this._confirmService.openConfiSave({
      header: 'Advertencia de procesamiento ',
      message: 'Desea Resetear la contraseña del usuario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cambiarClaveUsuario(event);
      },
      reject: () => {
        // Acción a realizar si el usuario rechaza
      },
    });
  }

  cambiarClaveUsuario(item: any) {
    const params = {
      ...item,
      iCredId: this.iCredId,
    };

    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'reseteo',
      })
      .subscribe({
        next: (respuesta: any) => {
          this.messageService.add({
            severity: 'success',
            summary: `Contraseña restablecida`,
            detail: respuesta.message,
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al restablecer contraseña',
            detail: error.error.message,
          });
        },
      });
  }
}
