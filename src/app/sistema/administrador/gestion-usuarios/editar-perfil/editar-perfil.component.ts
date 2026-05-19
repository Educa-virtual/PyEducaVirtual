import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { DialogModule } from 'primeng/dialog';
import { Usuario } from '../interfaces/usuario.interface';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { PerfilAsignado } from '../interfaces/perfil-asignado.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionUsuariosService } from '../services/gestion-usuarios.service';
import {
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
  DOCENTE,
  AUXILIAR,
  ESTUDIANTE,
  APODERADO,
  ASISTENTE_SOCIAL,
} from '@/app/servicios/perfilesConstantes';

/*interface AsignacionRol {
    id: number
    rol: string
    nivel: string
    institucion: string
    fechaAsignacion: string
}*/

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [PrimengModule, DialogModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
})
export class EditarPerfilComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() usuario: Usuario = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() refrescarLista = new EventEmitter<boolean>();

  formAgregarPerfil: FormGroup;
  dataPerfilesUsuario: any[] = [];
  ENTIDAD: number = 10; // DREMO

  nivelSeleccionado: any | null = null;
  moduloSeleccionado: any | null = null;
  perfilUsuarioSeleccionado: PerfilAsignado | null = null;
  perfilCreado: boolean = false;

  perfiles: Array<object>;
  nivel_tipos: Array<object>;
  ugeles: Array<object>;
  distritos: Array<object>;
  instituciones_educativas: Array<object>;
  sedes: Array<object>;
  estados: Array<object>;

  buscarIe: boolean = false;
  buscarUgel: boolean = false;

  constructor(
    private messageService: MessageService,
    private usuariosService: GestionUsuariosService,
    private confirmationModalService: ConfirmationModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formAgregarPerfil = this.fb.group({
      iIieeId: [null],
      iNivelTipoId: [null],
      iUgelId: [null],
      iSedeId: [null],
      iPerfilId: [null, [Validators.required]],
    });

    this.usuariosService.crearUsuario().subscribe((data: any) => {
      this.perfiles = this.usuariosService.getPerfiles(data?.perfiles);
      this.nivel_tipos = this.usuariosService.getNivelesTipos(data?.nivel_tipos);
      this.ugeles = this.usuariosService.getUgeles(data?.ugeles);
      this.distritos = this.usuariosService.getDistritos(data?.distritos);
      this.instituciones_educativas = this.usuariosService.getInstitucionesEducativas(
        data?.instituciones_educativas
      );
    });

    this.formAgregarPerfil.get('iPerfilId').valueChanges.subscribe(perfil => {
      this.buscarIe = false;
      this.buscarUgel = false;
      this.formAgregarPerfil.patchValue({
        iNivelTipoId: null,
        iUgelId: null,
        iIieeId: null,
        iSedeId: null,
      });
      if ([ESPECIALISTA_UGEL].includes(perfil)) {
        this.formAgregarPerfil.get('iNivelTipoId').setValue(null);
        this.formAgregarPerfil.get('iIieeId').setValue(null);
        this.formAgregarPerfil.get('iSedeId').setValue(null);
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
        this.formAgregarPerfil.get('iUgelId').setValue(null);
        this.buscarIe = true;
      }
    });

    this.formAgregarPerfil.get('iNivelTipoId').valueChanges.subscribe(nivel => {
      this.formAgregarPerfil.get('iIieeId').setValue(null);
      this.formAgregarPerfil.get('iSedeId').setValue(null);
      this.instituciones_educativas = this.usuariosService.filterInstitucionesEducativas(nivel);
    });

    this.formAgregarPerfil.get('iIieeId').valueChanges.subscribe(ie => {
      this.formAgregarPerfil.get('iSedeId').setValue(null);
      this.sedes = this.usuariosService.getSedes(this.instituciones_educativas, ie);
      if (this.sedes && this.sedes.length == 1) {
        this.formAgregarPerfil.get('iSedeId').setValue(this.sedes[0]['value']);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.formAgregarPerfil.reset();
      this.perfilCreado = false;
      this.obtenerPerfilesUsuario();
    }
  }

  obtenerPerfilesUsuario() {
    this.usuariosService.obtenerPerfilesUsuario(this.usuario.iCredId).subscribe({
      next: (respuesta: any) => {
        this.dataPerfilesUsuario = respuesta.data;
        this.dataPerfilesUsuario.forEach(perfil => {
          const ugel = perfil.cUgelNombre;
          const ie = perfil.cIieeCodigoModular
            ? perfil.cIieeCodigoModular + ' - ' + perfil.cIieeNombre
            : null;
          perfil.cInstitucionNombre = ugel ?? ie ?? null;
        });
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener perfiles de usuario',
          detail: error,
        });
      },
    });
  }

  preguntarDesactivarPerfil(perfil: any) {
    const perfil_institucion =
      perfil.cPerfilNombre + (perfil.cInstitucionNombre ? ' - ' + perfil.cInstitucionNombre : '');
    this.confirmationModalService.openConfirm({
      header: 'Desactivar perfil',
      message: `El perfil ${perfil_institucion} será desactivado, ¿desea continuar?IMPORTANTE: Si desactiva el perfil entonces el usuario ya no tendrá acceso a los datos que generó.`,
      accept: () => {
        this.cambiarEstadoPerfil(perfil.iCredEntPerfId, 0);
      },
    });
  }

  preguntarActivarPerfil(perfil: any) {
    const perfil_institucion =
      perfil.cPerfilNombre + (perfil.cInstitucionNombre ? ' - ' + perfil.cInstitucionNombre : '');
    this.confirmationModalService.openConfirm({
      header: 'Activar perfil',
      message: `El perfil ${perfil_institucion} será activado, ¿desea continuar?`,
      accept: () => {
        this.cambiarEstadoPerfil(perfil.iCredEntPerfId, 1);
      },
    });
  }

  cambiarEstadoPerfil(iCredEntPerfId: number, estado: number) {
    const data = { iCredEntPerfEstado: estado };
    this.usuariosService
      .actualizarPerfilUsuario(this.usuario.iCredId, iCredEntPerfId, data)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Datos actualizados con éxito',
          });
          this.perfilCreado = true;
          this.obtenerPerfilesUsuario();
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al actualizar estado del perfil',
            detail: error.error.message,
          });
        },
      });
  }

  cerrarDialog() {
    this.dataPerfilesUsuario = [];
    this.formAgregarPerfil.reset();
    this.visibleChange.emit(false);
    if (this.perfilCreado) {
      this.perfilCreado = false;
      this.refrescarLista.emit(true);
    }
  }

  agregarPerfil() {
    this.usuariosService
      .registrarPerfil(this.usuario.iCredId, this.formAgregarPerfil.value)
      .subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: data.message,
          });
          this.perfilCreado = true;
          this.formAgregarPerfil.reset();
          this.obtenerPerfilesUsuario();
        },
        error: error => {
          console.error('Error al agregar perfil:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: error.error.message,
          });
        },
      });
  }
}
