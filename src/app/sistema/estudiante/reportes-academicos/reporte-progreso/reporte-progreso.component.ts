import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reporte-progreso',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './reporte-progreso.component.html',
  styleUrl: './reporte-progreso.component.scss',
})
export class ReporteProgresoComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportes académicos',
      },
      {
        label: 'Progreso',
      },
    ];
  }
}
