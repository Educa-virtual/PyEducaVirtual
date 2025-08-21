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

  departamentos = [
    { label: 'Lima', value: 1 },
    { label: 'Arequipa', value: 2 },
    { label: 'Cusco', value: 3 },
    { label: 'La Libertad', value: 4 },
    { label: 'Piura', value: 5 },
    { label: 'Junín', value: 6 },
    { label: 'Lambayeque', value: 7 },
    { label: 'Ancash', value: 8 },
  ];

  // Datos para Distrito
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
  convertirMayusculas(event: any) {
    const input = event.target;
    input.value = input.value.toUpperCase();
  }
  soloNumeros(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
