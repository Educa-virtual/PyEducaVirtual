import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reporte-academico',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-academico.component.html',
  styleUrl: './reporte-academico.component.scss',
})
export class ReporteAcademicoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  iYAcadId: number;
  anioEscolar: number;
  areas: any = [];

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.anioEscolar = this.store.getItem('dremoYear');

    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportes académicos',
      },
      {
        label: 'Académico',
      },
    ];
  }

  generarReporte() {}
}
