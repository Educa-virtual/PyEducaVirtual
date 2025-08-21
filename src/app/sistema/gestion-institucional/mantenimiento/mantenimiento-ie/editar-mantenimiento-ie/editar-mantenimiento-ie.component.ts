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

  distritos = [
    { label: 'Miraflores', value: 1 },
    { label: 'San Isidro', value: 2 },
    { label: 'Surco', value: 3 },
    { label: 'Barranco', value: 4 },
    { label: 'La Molina', value: 5 },
    { label: 'San Borja', value: 6 },
    { label: 'Magdalena', value: 7 },
    { label: 'Pueblo Libre', value: 8 },
    { label: 'Moquegua', value: 9 },
  ];

  Nivel = [
    { label: 'Educacion Inicial', value: 1 },
    { label: 'Educacion Primaria', value: 2 },
    { label: 'Educacion Secundaria', value: 3 },
  ];

  ugel = [
    { label: 'Mariscal Nieto', value: 1 },
    { label: 'Ilo', value: 2 },
  ];

  sede = [{ label: 'Sede Principal', value: 1 }];

  sector = [{ label: 'SECTOR PUBLICO', value: 1 }];

  zona = [
    { label: 'URBANA', value: 1 },
    { label: 'RURAL', value: 2 },
  ];

  ngOnInit() {
    console.log('EditarManteniminetoie OnInit');
  }
  btnCancelar() {
    this.eventEditarMantenimientoIe.emit(false);
  }
  btnGuardar() {
    this.eventEditarMantenimientoIe.emit(false);
  }
  convertirMayusculas(event: any) {
    const input = event.target;
    input.value = input.value.toUpperCase();
  }
  soloNumeros(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
