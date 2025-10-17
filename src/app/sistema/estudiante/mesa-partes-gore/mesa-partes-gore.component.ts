import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-mesa-partes-gore',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './mesa-partes-gore.component.html',
  styleUrl: './mesa-partes-gore.component.scss',
})
export class MesaPartesGoreComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  ngOnInit() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Mesa de Partes GORE',
      },
    ];
  }
}
