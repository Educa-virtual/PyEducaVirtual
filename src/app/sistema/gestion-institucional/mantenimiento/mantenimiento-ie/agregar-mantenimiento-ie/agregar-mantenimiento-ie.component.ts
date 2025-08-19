import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
@Component({
  selector: 'app-agregar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './agregar-mantenimiento-ie.component.html',
  styleUrl: './agregar-mantenimiento-ie.component.scss',
})
export class AgregarMantenimientoIeComponent implements OnInit {
  @Input() selectedItem: any = null;
  @Output() eventAgregarMantenimientoIe = new EventEmitter<boolean>();
  ngOnInit() {
    console.log('AgregarMantenimientoIeComponent');
  }
  btnCancelar() {
    //console.log('btn cancelar');
    this.eventAgregarMantenimientoIe.emit(false);
  }
  btnGuardar() {
    //console.log('btn guardar');
    this.eventAgregarMantenimientoIe.emit(false);
  }
}
