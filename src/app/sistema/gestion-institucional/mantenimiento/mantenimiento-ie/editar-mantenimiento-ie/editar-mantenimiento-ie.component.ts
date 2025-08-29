import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder } from '@angular/forms';
import { MantenimientoIeService } from '../mantenimiento-ie.service';
import { GeneralService } from '@/app/servicios/general.service';
@Component({
  selector: 'app-editar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './editar-mantenimiento-ie.component.html',
  styleUrl: './editar-mantenimiento-ie.component.scss',
})
export class EditarMantenimientoIeComponent implements OnInit {
  @Input() selectedItem: any = null;
  @Output() eventEditarMantenimientoIe = new EventEmitter<boolean>();
  private generalService = inject(GeneralService);
  titulo: string = 'Editar';
  constructor(
    private fb: FormBuilder,
    private mntenimientoIeService: MantenimientoIeService
  ) {}
  distritoSeleccionado: any;
  zonaSeleccionado: any;
  sectorSeleccionado: any;
  nivelSeleccionado: any;
  ugelSeleccionado: any;
  distritos = [];
  niveles = [];
  ugeles = [];
  sedes = [];
  sectores = [];
  zonas = [];

  ngOnInit() {
    console.log('EditarManteniminetoie OnInit');
    this.cargarDistritos();
    this.cargarNiveles();
    this.cargarSectores();
    this.cargarUgeles();
    this.cargarZonas();
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

  cargarUgeles() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'ugeles',
        campos: '*',
        where: '',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.ugeles = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarNiveles() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'nivel_tipos',
        campos: '*',
        where: '',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.niveles = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarDistritos() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'grl',
        tabla: 'distritos',
        campos: '*',
        where: 'iPrvnId in (147,148,149)',
      },
    };

    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.distritos = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarZonas() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'acad',
        tabla: 'zonas',
        campos: '*',
        where: '',
      },
    };
    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.zonas = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  cargarSectores() {
    const data = {
      petition: 'post',
      group: 'acad',
      prefix: 'mantenimiento-ie',
      ruta: 'getData',
      data: {
        esquema: 'grl',
        tabla: 'tipos_sectores',
        campos: '*',
        where: '',
      },
    };
    this.generalService.getGralPrefix(data).subscribe({
      next: response => {
        this.sectores = response.data;
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
}
