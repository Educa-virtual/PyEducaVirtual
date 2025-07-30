import { PrimengModule } from '@/app/primeng.module';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-aulacard-capacitaciones',
  standalone: true,
  templateUrl: './aulaCard-capacitaciones.component.html',
  styleUrls: ['./aulaCard-capacitaciones.component.scss'],
  imports: [PrimengModule, ToolbarPrimengComponent, BreadcrumbModule],
})
export class AulaCardCapacitacionesComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor() {}

  ngOnInit() {
    this.items = [{ label: 'Actulización Docente', routerLink: '/' }, { label: 'Aula Virtual' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
