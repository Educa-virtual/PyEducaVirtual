import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-editar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './editar-mantenimiento-ie.component.html',
  styleUrl: './editar-mantenimiento-ie.component.scss',
})
export class EditarMantenimientoIeComponent implements OnInit {
  @Input() selectedItem: any = null;
  @Output() eventEditarMantenimientoIe = new EventEmitter<boolean>();
  titulo: string = 'Editar';
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    console.log('EditarManteniminetoie OnInit');
  }
  cancelarEdicion() {
    this.eventEditarMantenimientoIe.emit(false);
  }
  guardarRegistro() {
    this.eventEditarMantenimientoIe.emit(false);
  }
}
