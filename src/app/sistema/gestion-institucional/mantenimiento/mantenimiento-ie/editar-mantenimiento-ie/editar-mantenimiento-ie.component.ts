import { Component, Input, Output, EventEmitter, inject, OnChanges, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MantenimientoIeService, InstitucionEducativa } from '../mantenimiento-ie.service';
import { GeneralService } from '@/app/servicios/general.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-editar-mantenimiento-ie',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './editar-mantenimiento-ie.component.html',
  styleUrl: './editar-mantenimiento-ie.component.scss',
})
export class EditarMantenimientoIeComponent implements OnInit, OnChanges {
  @Input() selectedItem: any = null;
  @Output() eventEditarMantenimientoIe = new EventEmitter<boolean>();
  private generalService = inject(GeneralService);
  titulo: string = 'Editar';
  constructor(
    private fb: FormBuilder,
    private mntenimientoIeService: MantenimientoIeService,
    private messageService: MessageService
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
  formulario: FormGroup;
  guardando: boolean = false;

  ngOnInit() {
    console.log('EditarManteniminetoie OnInit');
    this.cargarDistritos();
    this.cargarNiveles();
    this.cargarSectores();
    this.cargarUgeles();
    this.cargarZonas();
  }
  ngOnChanges(changes) {
    this.cargarIE(changes);
  }
  cargarIE(changes) {
    this.formulario = this.fb.group({
      cIieeCodigoModular: [changes.selectedItem?.currentValue?.cIieeCodigoModular],
      cIieeNombre: [changes.selectedItem?.currentValue?.cIieeNombre],
      iDsttId: [changes.selectedItem?.currentValue?.iDsttId],
      iZonaId: [changes.selectedItem?.currentValue?.iZonaId],
      iTipoSectorId: [changes.selectedItem?.currentValue?.iTipoSectorId],
      cIieeRUC: [changes.selectedItem?.currentValue?.cIieeRUC],
      cIieeDireccion: [changes.selectedItem?.currentValue?.cIieeDireccion],
      iNivelTipoId: [changes.selectedItem?.currentValue?.iNivelTipoId],
      iUgelId: [changes.selectedItem?.currentValue?.iUgelId],
      //cIieeNombre: ['Maax']
    });
  }

  btnCancelar() {
    this.eventEditarMantenimientoIe.emit(false);
  }
  btnGuardar() {
    if (this.formulario.valid) {
      this.guardarInstitucion();
    } else {
      this.mostrarErroresValidacion();
    }
    this.eventEditarMantenimientoIe.emit(false);
  }

  guardarInstitucion() {
    this.guardando = true;

    const datosInstitucion: InstitucionEducativa = this.formulario.value;

    console.log('Datos a enviar:', datosInstitucion);

    this.mntenimientoIeService
      .actualizarInstitucionEducativa(this.selectedItem?.iIieeId, datosInstitucion)
      .subscribe({
        next: response => {
          this.guardando = false;

          if (response.validated) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Institución educativa actualizada correctamente',
            });

            this.formulario.reset();
            this.eventEditarMantenimientoIe.emit(false);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje || 'Error al actualizar la institución',
            });
          }
        },
        error: error => {
          this.guardando = false;
          console.error('Error al actualizar institución:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la institución educativa',
          });
        },
      });
  }

  mostrarErroresValidacion() {
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
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
        where: 'iNivelTipoId in (1,3,4)',
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
