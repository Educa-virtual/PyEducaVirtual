import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  IActionContainer,
  ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { UsuarioPerfilComponent } from './usuario-perfil/usuario-perfil.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    ContainerPageComponent,
    FormUsuarioComponent,
    UsuarioPerfilComponent,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent implements OnInit {
  iSedeId: number;
  iYAcadId: number;
  iCredId: number;
  form_user: FormGroup;

  perfiles = []; // lista de perfiles
  search_perfiles: any[] = []; // lista de perfiles

  usuario: any; //Informacion del usuario seleccionado
  perfil_usuario: any; //Informacion del perfil seleccionado
  perfil: number = 0;
  option: string = 'Director';
  personas: any = []; //lista de personas

  modal_visible: boolean = false;
  tipo_documentos: any = []; //lista de tipo de documentos
  gestionar: boolean = true;
  condicion: string = '';
  titulo: string;
  btnValidar: boolean = false;

  selectedItemsPerfil: any;

  listaTipoPerfil: any = [
    { label: 'Todos', value: '0' },
    { label: 'Director', value: '1' },
    { label: 'Especialista UGEL', value: '2' },
    { label: 'Especialista DREMO', value: '3' },
  ];

  searchOpcionPersona: any = [
    { label: 'Documento', value: '0' },
    { label: 'Nombre', value: '1' },
    { label: 'Apellido Paterno', value: '2' },
    { label: 'Apellido Materno', value: '3' },
  ];

  constructor(
    private store: LocalStoreService,
    private messageService: MessageService,
    private query: GeneralService,
    private fb: FormBuilder
  ) {
    const perfil = this.store.getItem('dremoPerfil');

    this.iSedeId = perfil.iSedeId;
    this.iYAcadId = this.store.getItem('dremoiYAcadId');

    this.iCredId = perfil.iCredId;
  }

  ngOnInit(): void {
    // this.getPerfilSedes();
    this.getTipoDocumento();
    this.form_user = this.fb.group({
      iPerfilId: ['', [Validators.required]],
      iPersId: [''],
      iTipoIdentId: [1, [Validators.required]],
      cPersDocumento: [''],
      cPersNombre: ['', [Validators.required]],
      cPersMaterno: ['', [Validators.required]],
      cPersPaterno: [''],
      iTipoPerfilId: [''],
      tipoBusqueda: ['0'],
    });
  }
  cerrarModal($event) {
    this.modal_visible = $event.visible;
  }

  accionBtn(event: any, accion: string) {
    if (accion === 'nuevo_perfil_generado') {
      const item = [
        {
          iPersId: this.form_user.value.iPersId,
          iPerfilId: this.form_user.value.iPerfilId,
        },
      ];

      console.log(item);
    }

    if (accion === 'buscar') {
      const opcion = Number(this.form_user.value.tipoBusqueda);

      switch (opcion) {
        case 0:
          const condicion_0 = "cPersDocumento LIKE '" + this.form_user.value.cPersDocumento + "%'";
          this.getPersona(condicion_0);
          break;
        case 1:
          const condicion_1 = "cPersNombre LIKE '" + this.form_user.value.cPersDocumento + "%'";
          this.getPersona(condicion_1);
          break;
        case 2:
          const condicion_2 = "cPersPaterno LIKE '" + this.form_user.value.cPersDocumento + "%'";
          this.getPersona(condicion_2);
          break;
        case 3:
          const condicion_3 = "cPersMaterno LIKE '" + this.form_user.value.cPersDocumento + "%'";
          this.getPersona(condicion_3);
          break;
      }
      this.modal_visible = false;
    }
    if (accion === 'nuevo') {
      this.modal_visible = true;
    }
  }

  getPerfilSedes() {
    // obtiene los perfiles para la sede
    this.query
      .searchCalAcademico({
        esquema: 'seg',
        tabla: 'perfiles',
        campos: '*',
        condicion: this.condicion,
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

  getPersona(condicion: string): void {
    this.query
      .searchCalAcademico({
        esquema: 'grl',
        tabla: 'personas',
        campos: '*',
        condicion: condicion,
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data;
          this.personas = item.map(persona => ({
            ...persona,
            nombre_completo: (
              persona.cPersPaterno +
              ' ' +
              persona.cPersMaterno +
              ' ' +
              persona.cPersNombre
            ).trim(),
          }));
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
        //
        //    },
      });
  }

  generarCredencialesIE() {}

  accionBtnItemTable({ accion, item }) {
    // console.log(this.selectedItems, 'selectedItems')

    if (accion === 'editar') {
      // console.log(item, 'btnTable')
    }
    if (accion === 'asignar_perfil') {
      // envia la informacion del perfil seleccionado
      this.usuario = item;

      // this.getPerfilUsuario()
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

    if (accion === 'Director') {
      this.option = 'Director';

      this.modal_visible = false; //Mostrar modal para registro de usuarior
      this.option = 'Director';
      (this.condicion =
        'iTipoPerfilId = 7 or iTipoPerfilId = 4 or iTipoPerfilId = 10 or iTipoPerfilId = 12 or iTipoPerfilId = 9 or iTipoPerfilId = 8'),
        (this.titulo = 'Accesos de Director');
      this.iSedeId = 1;
      this.getPerfilSedes();
    }

    if (accion === 'especialista_ugel') {
      this.gestionar = false;
      this.option = 'Especialista_UGEL';
      this.condicion = 'iTipoPerfilId = 5 ';
      this.titulo = 'Accesos de Especialista UGEL';
      this.getPerfilSedes();
      // busca los perfiles
    }

    if (accion === 'especialista_dremo') {
      this.gestionar = false;
      this.condicion = 'iTipoPerfilId = 6 ';
      this.option = 'Especialista_DREMO';
      this.titulo = 'Accesos de Especialista DREMO';
      this.getPerfilSedes();
    }
    if (accion === 'retornar') {
      this.gestionar = true;
    }
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Crear credencial a usuario',
      text: 'Generar credencial',
      icon: 'pi pi-check-square',
      accion: 'nuevo_perfil_generado',
      class: 'p-button-primary',
    },
  ];
  //estructura de tabla
  actionsPerfil: IActionTable[] = [
    {
      labelTooltip: 'Seleccionar perfil',
      icon: 'pi pi-user', // pi pi-ban
      accion: 'asignar_perfil',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Eliminar perfil',
      icon: 'pi pi-trash', // pi pi-ban
      accion: 'eliminar_perfil',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  columa_personas = [
    {
      type: 'item',
      width: '2%',
      field: 'item',
      header: 'N°',
      text_header: 'left',
      text: 'left',
    },

    {
      type: 'text',
      width: '20%',
      field: 'cPersDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '60%',
      field: 'nombre_completo',
      header: 'Nombre',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cPersSexo',
      header: 'Sexo',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'actions',
      width: '8%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ]; // iCredEntId  iCredEntEstado
}
