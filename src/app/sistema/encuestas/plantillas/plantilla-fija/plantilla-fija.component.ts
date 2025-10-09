import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';
import { SlicePipe } from '@angular/common';
import { DIRECTOR_IE, ESPECIALISTA_UGEL } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-plantilla-fija',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './plantilla-fija.component.html',
  styleUrl: './plantilla-fija.component.scss',
  providers: [SlicePipe],
})
export class PlantillaFijaComponent implements OnInit {
  categoria: any = null;
  plantilla: any = null;
  active: number = 0;
  iCateId: number;
  iPlanId: number;

  formPlantilla: FormGroup;
  formPoblacion: FormGroup;
  formAccesos: FormGroup;

  poblacion: Array<object> = [];
  accesos: Array<object> = [];
  cantidad_poblacion: any = 0;
  cantidad_accesos: any = 0;
  columns_poblacion: IColumn[];
  columns_accesos: IColumn[];

  perfil: any;
  iYAcadId: number;

  es_director: boolean = false;
  es_especialista_ugel: boolean = false;

  puede_editar: boolean = true;
  plantilla_registrada: boolean = false;

  breadCrumbHome: MenuItem;
  breadCrumbItems: MenuItem[];

  tiempos_duracion: Array<object>;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;
  USUARIO_ENCUESTADOR: number = this.encuestasService.USUARIO_ENCUESTADOR;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private encuestasService: EncuestasService,
    private slicePipe: SlicePipe,
    private messageService: MessageService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director = [DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = [ESPECIALISTA_UGEL].includes(Number(this.perfil.iPerfilId));
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iPlanId = params.params.iPlanId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formPlantilla = this.fb.group({
        iPlanId: [],
        cPlanNombre: ['', Validators.required],
        cPlanSubtitulo: [''],
        cPlanDescripcion: [''],
        iEstado: [this.ESTADO_BORRADOR],
        iCateId: [this.iCateId, Validators.required],
        bCompartirMismaIe: [0],
        bCompartirDirectores: [0],
        bCompartirEspUgel: [0],
        bCompartirEspDremo: [0],
        bCompartirMismaUgel: [0],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }

    this.verCategoria();

    this.encuestasService
      .crearEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iCateId: this.iCateId,
      })
      .subscribe((data: any) => {
        this.tiempos_duracion = this.encuestasService.getTiemposDuracion(data?.tiempos_duracion);
      });

    if (this.iPlanId) {
      this.verPlantilla();
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.categoria = data.data;
          this.setBreadCrumbs();
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Ocurrió un error',
          });
        },
      });
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      {
        label: 'Plantillas',
      },
      {
        label: 'Categorias',
        routerLink: `/encuestas/categorias`,
      },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar plantillas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-plantillas`,
      },
      {
        label: 'Nueva plantilla',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verPlantilla() {
    this.encuestasService
      .verPlantilla({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iPlanId: this.iPlanId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.plantilla = data.data;
            this.plantilla_registrada = true;
            this.setBreadCrumbs();
            this.setFormPlantilla(this.plantilla);
          } else {
            this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
          }
        },
        error: error => {
          console.error('Error obteniendo plantilla:', error);
          this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
        },
      });
  }

  setFormPlantilla(data: any) {
    if (Number(data.iEstado) !== this.ESTADO_BORRADOR || Number(data.puede_editar) !== 1) {
      data.iEstado = this.ESTADO_APROBADA;
      this.formPlantilla.disable();
      this.puede_editar = false;
    }
    this.formPlantilla.reset();
    this.formPlantilla.patchValue(data);
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'iCateId',
      data.iCateId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'iEstado',
      data.iEstado,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'bCompartirMismaIe',
      data.bCompartirMismaIe,
      'boolean'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'bCompartirDirectores',
      data.bCompartirDirectores,
      'boolean'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'bCompartirEspUgel',
      data.bCompartirEspUgel,
      'boolean'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'bCompartirEspDremo',
      data.bCompartirEspDremo,
      'boolean'
    );
    this.encuestasService.formatearFormControl(
      this.formPlantilla,
      'bCompartirMismaUgel',
      data.bCompartirMismaUgel,
      'boolean'
    );

    this.plantilla = data;
  }

  verPreguntas() {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${this.iPlanId}/preguntas`,
    ]);
  }

  guardarPlantilla() {
    this.formPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formPlantilla.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    this.encuestasService.guardarPlantilla(this.formPlantilla.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.verPreguntas();
      },
      error: error => {
        console.error('Error guardando plantilla:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarPlantilla() {
    this.formPlantilla.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formPlantilla.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formPlantilla.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    this.encuestasService.actualizarPlantilla(this.formPlantilla.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.verPreguntas();
      },
      error: error => {
        console.error('Error guardando plantilla:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }
}
