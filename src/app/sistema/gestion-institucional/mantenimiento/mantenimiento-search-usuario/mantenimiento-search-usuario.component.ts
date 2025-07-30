import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

//para formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-mantenimiento-search-usuario',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, ContainerPageComponent],
  templateUrl: './mantenimiento-search-usuario.component.html',
  styleUrl: './mantenimiento-search-usuario.component.scss',
})
export class MantenimientoSearchUsuarioComponent implements OnChanges, OnInit {
  @Output() crear_usuario = new EventEmitter(); // emite la lista de usuarios seleccionados
  @Output() select_usuarios = new EventEmitter(); // emite usuario selecionado

  // @Input() data_usuarios // array de usuarios a mostrar
  @Input() option: string; // opcion segun el modulo Director, Especialista DREMO, especialista UGEL
  @Input() lista_accesos; // lista de usuarios
  @Input() search_perfiles: any = []; //lista de perfiles
  @Input() iSedeId: number = 0; // id de isntitucion educativa
  @Input() titulo_cabecera: string = '';

  form_search: FormGroup; // variable para buscar usuarios
  selectedItems = [];

  perfil: number;

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lista_accesos || this.option) {
      this.getAccesos(this.option);
      //console.log(this.area, ' registro en com if visible_horario');
      //this.mostrarModal();
    }

    if (changes['lista_accesos'] && changes['lista_accesos'].currentValue) {
      this.getAccesos(this.option);
      //console.log(this.data_usuarios, ' registro en com if');
      if (this.option) {
        //  console.log(this.area, ' area en com if visible');
        //  this.mostrarModal();
      }
    }
  }

  ngOnInit() {
    this.form_search = this.fb.group({
      iPerfilId: ['', [Validators.required]],
    });
  }

  getAccesos(option: any) {
    switch (option) {
      case 'Director':
        this.getAccesosSedes(0, this.iSedeId);
        // this.titulo_cabecera = 'Accesos de usuario IE'
        break;

      case 'Especialista_UGEL':
        this.getAccesosSedes(3, 0);
        // this.titulo_cabecera = 'Accesos de Especialista UGEL'
        break;

      case 'Especialista_DREMO':
        this.getAccesosSedes(2, 0);
        //  this.titulo_cabecera = 'Accesos de Especialista DREMO'
        break;
    }
  }
  //Buscar usuarios asignados
  getAccesosSedes(option: number, iSedeId: number) {
    //obtiene los accesos de la sede
    // el perfil usuario permite identificar el filtro de usuarios
    this.perfil = option;
    this.query
      .obtenerCredencialesSede({
        iSedeId: iSedeId,
        option: option,
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data;
          this.lista_accesos = item.map(persona => ({
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
          console.error('Error fetching Años Académicos:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'editar') {
      console.log(item, 'btnTable');
    }
    if (accion === 'asignar_perfil') {
      // envia la informacion del perfil seleccionado
      const params = { accion: accion, item: item };
      this.select_usuarios.emit(params);
    }
    if (accion === 'habilitar_usuario') {
      this.btnItem(
        'Habilitar_usuario',
        '¿Desea habilitar los accesos de los usuarios seleccionados?'
      );
    }
    if (accion === 'Deshabilitar_usuario') {
      this.btnItem(
        'Deshabilitar_usuario',
        '¿Desea deshabilitar los accesos de los usuarios seleccionados?'
      );
    }

    if (accion === 'resetear_contrasena') {
      this.btnItem(
        'Resetea_contrasena',
        '¿Desea resetear la contraseña de los usuarios seleccionados?'
      );
    }
  }

  btnItem(accion: string, mensaje: string) {
    console.log(accion, 'accion_btn', mensaje);

    this._confirmService.openConfiSave({
      header: 'Advertencia de procesamiento ',
      message: mensaje,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (accion === 'nuevo_perfil') {
          // agregar

          const params = { accion: accion, item: 1 };
          this.crear_usuario.emit(params);
        }

        if (accion === 'Habilitar_usuario') {
          // habilita usuario
          this.habilitar_usuario('updateHabilitarAccesosIE');
        }
        if (accion === 'Deshabilitar_usuario') {
          // deshabilita usuario
          this.habilitar_usuario('updateDeshabilitarAccesosIE');
        }
        if (accion === 'Resetea_contrasena') {
          // resetea contraseña
          this.resetear_contrasena('resetear_contrasena');
        }

        if (accion === 'searh_perfil') {
          const id = this.form_search.value.iPerfilId;

          switch (id) {
            case '4':
              'Director IE';
              this.getAccesosSedes(4, this.iSedeId);
              break;
            case '7':
              'Docente';
              this.getAccesosSedes(7, this.iSedeId);
              break;
            case '80':
              'Estudiante';
              this.getAccesosSedes(80, this.iSedeId);
              break;
            case '90':
              'Apoderado';
              this.getAccesosSedes(90, this.iSedeId);
              break;
            case '100':
              'Asistencia social';
              this.getAccesosSedes(100, this.iSedeId);
              break;
            case '215':
              'Tutor de aula';
              this.getAccesosSedes(215, this.iSedeId);
              break;
            case '2':
              'Especialista DREMO';
              this.getAccesosSedes(2, 0);
              break;
            case '3':
              'Especialista UGEL';
              this.getAccesosSedes(3, 0);
              break;
            default:
              'all';
              this.getAccesosSedes(0, this.iSedeId);
              break;
          }
        }
        if (accion === 'searh_perfil_all') {
          this.getAccesosSedes(0, this.iSedeId);
        }
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

  habilitar_usuario(option: string) {
    // Extraer los iCredEntId
    const ids = this.selectedItems.map(item => ({
      iCredEntId: Number(item.iCredEntId),
    }));

    this.query
      .updateCalAcademico({
        json: JSON.stringify(ids),
        _opcion: option,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error. No se proceso petición ' + error,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          this.selectedItems = [];
          this.getAccesosSedes(this.perfil, this.iSedeId);
        },
      });
  }

  resetear_contrasena(option: string) {
    console.log(option, 'resetear_contrasena');
  }

  //Acciones del contenedor
  // container
  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Habilitar usuarios',
      text: 'Habilitar',
      icon: 'pi pi-check-square',
      accion: 'habilitar_usuario',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Resetear contraseña',
      text: 'Resetear',
      icon: 'pi pi-refresh',
      accion: 'habilitar_usuario',
      class: 'p-button-success',
    },
    {
      labelTooltip: 'Deshabilitar usuarios',
      text: 'Deshabilitar',
      icon: 'pi pi-ban',
      accion: 'Deshabilitar_usuario',
      class: 'p-button-danger',
    },
  ];

  // variables para table-primeng
  actionsUsuario: IActionTable[] = [
    {
      labelTooltip: 'Asignar perfil',
      icon: 'pi pi-user',
      accion: 'asignar_perfil',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];

  //estructura de tabla

  columns = [
    {
      type: 'checkbox',
      width: '2%',
      field: 'item',
      header: '',
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
      width: '40%',
      field: 'nombre_completo',
      header: 'Nombre y apellidos',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '18%',
      field: 'iCredEntEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '20%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
