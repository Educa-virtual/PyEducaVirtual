import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
//import { ADMINISTRADOR_DREMO } from '@/app/servicios/seg/perfiles';
@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  ngOnInit() {
    console.log('mantenimiento-ie');
  }
}
