import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';
import { Usuario } from '../interfaces/usuario.interface';
import { AgregarUsuarioComponent } from '../agregar-usuario/agregar-ususario.component';
import { CambiarFechaCaducidadComponent } from '../cambiar-fecha-caducidad/cambiar-fecha-caducidad.component';
import { GestionUsuariosService } from '../services/gestion-usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
  DOCENTE,
  AUXILIAR,
  ESTUDIANTE,
  APODERADO,
  ASISTENTE_SOCIAL,
  ADMINISTRADOR,
} from '@/app/servicios/perfilesConstantes';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    PrimengModule,
    EditarPerfilComponent,
    AgregarUsuarioComponent,
    CambiarFechaCaducidadComponent,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss',
})
export class ListaUsuariosComponent implements OnInit {
  //private searchChanged: Subject<void> = new Subject<void>()
  private lastLazyEvent: LazyLoadEvent | undefined;
  formCriteriosBusqueda: FormGroup;
  dataUsuarios: Usuario[] = [];
  totalDataUsuarios: number = 0;

  fechaServidor: Date;
  columnaOrdenar: string = 'dtCredEntPerfActualizado';
  direccionOrdenar: number = -1;
  first: number = 0;
  rows: number = 20;

  usuarioSeleccionado: Usuario | null = null;
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  modalAsignarRolVisible: boolean = false;
  modalAgregarUsuariolVisible: boolean = false;
  modalCambiarFechaCaducidadVisible: boolean = false;
  modalPersonalVisible: boolean = false;

  opcionesBusqueda: Array<object> = [
    { label: 'DATOS', value: 'datos' },
    { label: 'PERFIL', value: 'perfil' },
    { label: 'ESTADO', value: 'estado' },
    { label: 'ACTUALIZADO', value: 'actualizado' },
  ];
  instituciones: Array<object> = [
    { label: 'DREMO', value: 1 },
    { label: 'UGEL', value: 2 },
    { label: 'INSTITUCIONES EDUCATIVAS', value: 3 },
  ];
  perfiles: Array<object>;
  nivel_tipos: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  instituciones_educativas: Array<object>;
  sedes: Array<object>;
  estados: Array<object>;

  buscarTexto: boolean = true;
  buscarPerfil: boolean = false;
  buscarEstado: boolean = false;
  buscarActualizado: boolean = false;
  buscarIe: boolean = false;
  buscarUgel: boolean = false;

  perfil: any = null;
  es_administrador: boolean = false;

  constructor(
    private messageService: MessageService,
    private usuariosService: GestionUsuariosService,
    private confirmationModalService: ConfirmationModalService,
    private fb: FormBuilder,
    private store: LocalStoreService
  ) {
    this.breadCrumbItems = [{ label: 'Gestión de usuarios' }];
    this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_administrador = [ADMINISTRADOR].includes(this.perfil.iPerfilId);
  }

  ngOnInit(): void {
    this.formCriteriosBusqueda = this.fb.group({
      opcionSeleccionada: ['datos', [Validators.required]],
      criterioBusqueda: [''],
      institucionSeleccionada: [''],
      iIieeId: [null],
      iNivelTipoId: [null],
      iUgelId: [null],
      iSedeId: [null],
      iPerfilId: [null],
      dDesde: [null],
      dHasta: [null],
      iHabilitado: [null],
    });

    this.usuariosService.crearUsuario().subscribe((data: any) => {
      this.perfiles = this.usuariosService.getPerfiles(data?.perfiles);
      this.nivel_tipos = this.usuariosService.getNivelesTipos(data?.nivel_tipos);
      this.ugeles = this.usuariosService.getUgeles(data?.ugeles);
      this.distritos = this.usuariosService.getDistritos(data?.distritos);
      this.instituciones_educativas = this.usuariosService.getInstitucionesEducativas(
        data?.instituciones_educativas
      );
      this.estados = this.usuariosService.getEstados();
    });

    this.formCriteriosBusqueda.get('opcionSeleccionada').valueChanges.subscribe(opcion => {
      this.buscarTexto = false;
      this.buscarPerfil = false;
      this.buscarEstado = false;
      this.buscarActualizado = false;
      this.buscarIe = false;
      this.buscarUgel = false;
      if (opcion == 'datos') {
        this.buscarTexto = true;
      } else if (opcion == 'perfil') {
        this.formCriteriosBusqueda.patchValue({
          iPerfilId: null,
          iNivelTipoId: null,
          iUgelId: null,
          iIieeId: null,
          iSedeId: null,
        });
        this.buscarPerfil = true;
      } else if (opcion == 'estado') {
        this.formCriteriosBusqueda.patchValue({ iHabilitado: null });
        this.buscarEstado = true;
      } else if (opcion == 'actualizado') {
        this.formCriteriosBusqueda.get('dDesde').setValue(null);
        this.formCriteriosBusqueda.get('dHasta').setValue(null);
        this.buscarActualizado = true;
      }
    });

    this.formCriteriosBusqueda.get('iPerfilId').valueChanges.subscribe(perfil => {
      this.buscarIe = false;
      this.buscarUgel = false;
      this.formCriteriosBusqueda.patchValue({
        iNivelTipoId: null,
        iUgelId: null,
        iIieeId: null,
        iSedeId: null,
      });
      if ([ESPECIALISTA_UGEL].includes(perfil)) {
        this.formCriteriosBusqueda.get('iNivelTipoId').setValue(null);
        this.formCriteriosBusqueda.get('iIieeId').setValue(null);
        this.formCriteriosBusqueda.get('iSedeId').setValue(null);
        this.buscarUgel = true;
      } else if (
        [
          DIRECTOR_IE,
          SUBDIRECTOR_IE,
          DOCENTE,
          AUXILIAR,
          ESTUDIANTE,
          APODERADO,
          ASISTENTE_SOCIAL,
        ].includes(perfil)
      ) {
        this.formCriteriosBusqueda.get('iUgelId').setValue(null);
        this.buscarIe = true;
      }
    });

    this.formCriteriosBusqueda.get('iNivelTipoId').valueChanges.subscribe(nivel => {
      this.formCriteriosBusqueda.get('iIieeId').setValue(null);
      this.formCriteriosBusqueda.get('iSedeId').setValue(null);
      this.instituciones_educativas = this.usuariosService.filterInstitucionesEducativas(nivel);
    });

    this.formCriteriosBusqueda.get('iIieeId').valueChanges.subscribe(ie => {
      this.formCriteriosBusqueda.get('iSedeId').setValue(null);
      this.sedes = this.usuariosService.getSedes(this.instituciones_educativas, ie);
      if (this.sedes && this.sedes.length == 1) {
        this.formCriteriosBusqueda.get('iSedeId').setValue(this.sedes[0]['value']);
      }
    });
  }

  obtenerListaUsuarios(params: any) {
    this.usuariosService.listarUsuarios(params).subscribe({
      next: (respuesta: any) => {
        this.totalDataUsuarios = respuesta.data.totalFilas;
        this.dataUsuarios = respuesta.data.dataUsuarios;
        this.dataUsuarios.forEach((usuario: any) => {
          const verifNombre = Number(usuario.bCredVerificado) === 1 ? 'Si' : 'No';
          const verifColor = Number(usuario.bCredVerificado) === 1 ? 'success' : 'danger';
          const estadoColor =
            Number(usuario.iCredEstado) === 0
              ? 'danger'
              : Number(usuario.bEstaCaducado) === 1
                ? 'warning'
                : 'success';
          usuario.bCredVerificadoNombre = verifNombre;
          usuario.bCredVerificadoColor = verifColor;
          usuario.cCredEstadoColor = estadoColor;
        });
        this.fechaServidor = new Date(respuesta.data.fechaServidor);
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener usuarios',
          detail: error.error.message,
        });
      },
    });
  }

  realizarBusqueda() {
    this.first = 0;
    this.loadUsuariosLazy({
      first: this.first,
      rows: this.rows,
      columnaOrdenar: this.columnaOrdenar,
      direccionOrdenar: this.direccionOrdenar,
    });
  }

  usuarioRegistrado(data) {
    this.modalAgregarUsuariolVisible = false;
    this.modalAsignarRolVisible = true;
    this.usuarioSeleccionado = data;
    this.loadUsuariosLazy(this.lastLazyEvent);
  }

  loadUsuariosLazy(event: any) {
    if (!event) {
      event = {
        first: 0,
        rows: 20,
        columnaOrdenar: this.columnaOrdenar,
        direccionOrdenar: this.direccionOrdenar,
      };
    }

    event.sortField = event.sortField ?? this.columnaOrdenar;
    event.sortOrder = event.sortOrder ?? this.direccionOrdenar;
    this.lastLazyEvent = event;
    this.first = event.first;

    const params = {
      offset: event.first,
      limit: event.rows,
      opcionSeleccionada: this.formCriteriosBusqueda.value.opcionSeleccionada,
      criterioBusqueda: this.formCriteriosBusqueda.value.criterioBusqueda,
      institucionSeleccionada: this.formCriteriosBusqueda.value.iIieeId,
      perfilSeleccionado: this.formCriteriosBusqueda.value.iPerfilId,
      iUgelSeleccionada: this.formCriteriosBusqueda.value.iUgelId,
      ieSedeSeleccionada: this.formCriteriosBusqueda.value.iSedeId,
      nivelSeleccionado: this.formCriteriosBusqueda.value.iNivelTipoId,
      estadoSeleccionado: this.formCriteriosBusqueda.value.iHabilitado,
      fechaDesde: this.formCriteriosBusqueda.value.dDesde,
      fechaHasta: this.formCriteriosBusqueda.value.dHasta,
      columnaOrdenar: event.sortField,
      direccionOrdenar: event.sortOrder,
    };
    this.columnaOrdenar = params.columnaOrdenar;
    this.direccionOrdenar = params.direccionOrdenar;
    this.obtenerListaUsuarios(params);
  }

  agregarUsuario() {
    this.usuarioSeleccionado = null;
    this.modalAgregarUsuariolVisible = true;
  }

  editarPerfilesUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalAsignarRolVisible = true;
  }

  visibilidadModalAsignarRol(visible: boolean) {
    this.modalAsignarRolVisible = visible;
    if (!visible) {
      this.loadUsuariosLazy(null);
    }
  }

  cambiarFechaCaducidad(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalCambiarFechaCaducidadVisible = true;
  }

  preguntarDesactivarUsuario(usuario: Usuario) {
    this.confirmationModalService.openConfirm({
      header: 'Desactivar usuario',
      message: `¿Está seguro de que desea desactivar el usuario de ${usuario.cApellidosNombres}?`,
      accept: () => {
        this.cambiarEstadoUsuario(usuario, 0);
      },
    });
  }

  preguntarReactivarUsuario(usuario: Usuario) {
    this.confirmationModalService.openConfirm({
      header: 'Activar usuario',
      message: `¿Está seguro de que desea activar el usuario de ${usuario.cApellidosNombres}?`,
      icon: 'pi pi-check-circle',
      accept: () => {
        this.cambiarEstadoUsuario(usuario, 1);
      },
    });
  }

  cambiarEstadoUsuario(usuario: Usuario, estado: number) {
    const data = { iCredEstado: estado };
    this.usuariosService.cambiarEstadoUsuario(usuario.iCredId, data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Datos actualizados con éxito',
        });
        this.loadUsuariosLazy(null);
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error desconocido',
        });
      },
    });
  }

  preguntarCambiarClave(usuario: Usuario) {
    this.confirmationModalService.openConfirm({
      header: 'Restablecer contraseña',
      message: `La contraseña de ${usuario.cApellidosNombres} será su usuario, ¿desea continuar?`,
      accept: () => {
        this.cambiarClaveUsuario(usuario);
      },
    });
  }

  cambiarClaveUsuario(usuario: Usuario) {
    this.usuariosService.restablecerClaveUsuario(usuario.iCredId).subscribe({
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
          summary: 'Error',
          detail: error.error.message || 'Error desconocido',
        });
      },
    });
  }
}
