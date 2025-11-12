import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Router } from '@angular/router';
import { LogroAlcanzadoService } from '../services/logro-alcanzado.service';
import { ConfigurarLogroComponent } from './configurar-logro/configurar-logro.component';

@Component({
  selector: 'app-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, ConfigurarLogroComponent],
  templateUrl: './logro-alcanzado.component.html',
  styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
  // Listados de datos
  areas: any[] = [];
  curso: any;

  perfil: any;
  iYAcadId: number;
  dialogConfigurarEscala: boolean = false;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private logroAlcanzadoService: LogroAlcanzadoService,
    private messageService: MessageService,
    private constantes: ConstantesService,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }

  ngOnInit() {
    this.setBreadCrumbs();
    this.listarCursos();
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [{ label: 'Logros alcanzados' }, { label: 'Listar areas' }];
  }

  listarCursos(mostrarTotalAlumnos: number = 2) {
    this.logroAlcanzadoService
      .listarCursos({
        opcion: mostrarTotalAlumnos,
        iDocenteId: this.constantes.iDocenteId, // Id de docente encriptado
        iYAcadId: this.iYAcadId,
        iSedeId: this.perfil.iSedeId,
        iIieeId: this.perfil.iIieeId,
      })
      .subscribe({
        next: (data: any) => {
          this.areas = data.data;
        },
        error: error => {
          console.error('Error obteniendo cursos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: error.error.message ?? 'No se pudo obtener la información de cursos.',
          });
        },
      });
  }

  seleccionarArea(area: any) {
    if (area && area.idDocCursoId) {
      this.router.navigate([`/evaluaciones/registro-logro/${area?.idDocCursoId}`]);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Mensaje del sistema',
        detail: 'No se pudo obtener la información del curso.',
      });
    }
  }

  configurarEvaluacion(area: any) {
    this.curso = null;
    setTimeout(() => {
      this.curso = area;
      this.dialogConfigurarEscala = true;
    }, 100);
  }

  listenDialogRegistrarLogro(event: boolean) {
    if (event == false) {
      this.dialogConfigurarEscala = false;
    }
  }
}
