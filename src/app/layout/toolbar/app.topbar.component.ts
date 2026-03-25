import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { LocalStoreService } from '../../servicios/local-store.service';
import { TokenStorageService } from '../../servicios/token.service';
import { Router, RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { RolesDropdownComponent } from './roles-dropdown/roles-dropdown.component';
import { AnioEscolarComponent } from './roles-dropdown/anio-escolar/anio-escolar.component';
import { PrimengModule } from '@/app/primeng.module';
import { UserAccountComponent } from './roles-dropdown/user-account/user-account.component';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';
import { provideIcons } from '@ng-icons/core';
import { mat10k } from '@ng-icons/material-icons/baseline';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { ComunicadosService } from '@/app/sistema/comunicados/services/comunicados.services';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  standalone: true,
  imports: [
    RouterLink,
    DropdownModule,
    FormsModule,
    MenuModule,
    RolesDropdownComponent,
    AnioEscolarComponent,
    UserAccountComponent,
    PrimengModule,
  ],
  styleUrl: './app.topbar.component.scss',
  viewProviders: [provideIcons({ mat10k })],
})
export class AppTopBarComponent implements OnInit {
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private _ConstantesService = inject(ConstantesService);

  perfiles = [];
  selectedPerfil: string;
  mostrarBanderines: boolean = false;
  mostrarBanderinesMorado: boolean = false;
  mostrarBanderinesNavidad: boolean = false;
  mostrarBanderinesMoquegua: boolean = false;
  years = [];
  iYAcadId: number;
  selectedYear: string;

  modulos = [];
  selectedModulo: string;

  USUARIO_RECIPIENTE: number = this.comunicadosService.USUARIO_RECIPIENTE;

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  items = [];
  constructor(
    private comunicadosService: ComunicadosService,
    private messageService: MessageService,
    public layoutService: LayoutService,
    private store: LocalStoreService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit() {
    const user = this.store.getItem('dremoUser');
    const year = this.store.getItem('dremoYear');

    this.years = user.years;
    this.selectedYear = year ? year : null;

    const perfil = this.store.getItem('dremoPerfil');
    this.perfiles = user.perfiles;
    const perfil_data = {
      iPerfilId: 0,
      cPerfilNombre: '-',
      cEntNombreLargo: '-',
    };
    this.selectedPerfil = perfil ? perfil : perfil_data;

    if (user.iDocenteId) {
      this.notificacionDocente();
    }
    if (user.iEstudianteId) {
      this.notificacionEstudiante();
    }
    //Bandarines por fiestas patrias
    const hoy = new Date();
    const limite_banderin = new Date(hoy.getFullYear(), 6); // 31 de julio
    const limite_banderin_navidad = new Date(hoy.getFullYear(), 11); // 31 de Agosto
    const limite_banderin_morado = new Date(hoy.getFullYear(), 9); // 31 de Octubre
    const limite_banderin_moquegua = new Date(hoy.getFullYear(), 10); // 31 de Noviembre

    this.mostrarBanderines = hoy.getMonth() === limite_banderin.getMonth();

    this.mostrarBanderinesMoquegua = hoy.getMonth() === limite_banderin_moquegua.getMonth();

    this.mostrarBanderinesNavidad = hoy.getMonth() === limite_banderin_navidad.getMonth();

    this.mostrarBanderinesMorado = hoy.getMonth() === limite_banderin_morado.getMonth();
    const modulo = this.store.getItem('dremoModulo');
    this.modulos = user.modulos;
    this.selectedModulo = modulo ? modulo.iModuloId : null;

    const iPerfilId = this._ConstantesService.iPerfilId;
    switch (iPerfilId) {
      case ESTUDIANTE:
        this.notificacionEstudiante();
        break;
      case DOCENTE:
        this.notificacionDocente();
        break;
    }
  }

  changeModulo(value) {
    this.router.navigate(['./']);
    this.store.setItem('dremoModulo', value);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
  changePerfile(value) {
    //this.router.navigate(['./']);
    this.store.setItem('dremoPerfil', value);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
  changeYear(value) {
    const year = this.years.find(item => item.iYearId === value);
    this.store.setItem('dremoYear', value);
    this.store.setItem('dremoiYAcadId', year.iYAcadId);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  logout(): void {
    this.store.clear();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  notificaciones = [];
  totalNotificaciones: number = 0;
  actionTopBar(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    const data = [];
    switch (accion) {
      case 'year':
        this.changeYear(item);
        break;
      case 'logout':
        this.logout();
        break;
      case 'modulo':
        this.changeModulo(item);
        break;
      case 'notificacion_docente':
        item.forEach(i => {
          i.notificar = i.notificar ? JSON.parse(i.notificar) : [];
          i.notificar.forEach(j => {
            this.notificaciones.push(j);
          });
        });
        this.notificaciones = this.notificaciones.filter(i => i.respuesta);
        this.notificaciones.forEach(i => {
          data.push({
            label: i.respuesta,
            icon: i.icono,
            sublabel: i.tiempoNotificacion,
            diferencias: i.diferencia,
          });
        });
        data.sort((a, b) => {
          return a.diferencias - b.diferencias;
        });

        this.totalNotificaciones = data.length;

        this.items = [
          {
            label: 'Notificaciones',
            items: data,
          },
        ];
        break;
      case 'notificacion_estudiante':
        item.forEach(i => {
          i.notificarEstudiante = i.notificarEstudiante ? JSON.parse(i.notificarEstudiante) : [];
          i.notificarEstudiante.forEach(j => {
            this.notificaciones.push(j);
          });
        });

        // this.notificaciones = this.notificaciones.filter(i => i.respuesta);
        this.notificaciones.forEach(i => {
          data.push({
            icon: i.icono,
            sublabel: i.distancia,
            diferencias: i.diferencia,
            label: i.titulo,
          });
        });
        // data.sort((a, b) => {
        //   return a.diferencias - b.diferencias;
        // });
        this.totalNotificaciones = data.length;

        this.items = [
          {
            label: 'Notificaciones',
            items: data,
          },
        ];
        break;
    }
  }
  notificacionDocente() {
    this.comunicadosService
      .listarComunicados({
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_RECIPIENTE,
      })
      .subscribe({
        next: (data: any) => {
          this.comunicados = data.data;
          this.comunicados.forEach(lista => {
            lista.cComunicadoDescripcion = this.filtrarHtml(lista.cComunicadoDescripcion);
          });
          this.totalComunicados = this.comunicados.length;
        },
        error: error => {
          console.warn('Error obteniendo lista de comunicados:', error);
        },
      });
  }

  comunicados: any;
  totalComunicados: number = 0;
  notificacionEstudiante() {
    this.comunicadosService
      .listarComunicados({
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_RECIPIENTE,
      })
      .subscribe({
        next: (data: any) => {
          this.comunicados = data.data;
          this.comunicados.forEach(lista => {
            lista.cComunicadoDescripcion = this.filtrarHtml(lista.cComunicadoDescripcion);
          });
          this.totalComunicados = this.comunicados.length;
        },
        error: error => {
          console.error('Error obteniendo lista de comunicados:', error);
        },
      });
  }

  filtrarHtml(datos: string): string {
    const doc = new DOMParser().parseFromString(datos, 'text/html');
    return doc.body.textContent || '';
  }

  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.actionTopBar({ accion, item: response?.data });
      },
      complete: () => {},
      error: error => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }
}
