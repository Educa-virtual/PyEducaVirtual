import { Component, Output, EventEmitter } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
@Component({
  selector: 'app-editar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './editar-mantenimiento-ie.component.html',
  styleUrl: './editar-mantenimiento-ie.component.scss',
})
export class EditarMantenimientoIeComponent {
  @Output() eventEditarMantenimientoIe = new EventEmitter<boolean>();
}
