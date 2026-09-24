import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { Router } from '@angular/router';
import { LogroAlcanzadoService } from '../services/logro-alcanzado.service';

@Component({
  selector: 'app-logro-alcanzado',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './logro-alcanzado.component.html',
  styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
  cursos: any[] = [];
  perfil: any;
  iYAcadId: number;

  breadCrumbHome: MenuItem = {
    icon: 'pi pi-home',
  };
  breadCrumbItems: MenuItem[] = [{ label: 'Reportar Logros Alcanzados' }];

  constructor(
    private logroService: LogroAlcanzadoService,
    private messageService: MessageService,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }
  ngOnInit() {
    this.listarCursosDocente();
  }

  listarCursosDocente() {
    this.logroService
      .listarDocenteCurso({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.cursos = data?.data;
        },
        error: (error: any) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'No se pudo obtener los cursos',
          });
        },
      });
  }

  /* Variables para table */
  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'estudiantes':
        this.router.navigate([`/evaluaciones/registro-logro/${item.idDocCursoId}/estudiantes`]);
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Ver estudiantes',
      icon: 'pi pi-file-edit',
      accion: 'estudiantes',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cCursoNombre',
      header: 'Área',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cGradoNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'iMatrCount',
      header: 'Estudiantes',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
