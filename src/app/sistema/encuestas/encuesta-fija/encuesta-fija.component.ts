import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';
import { DIRECTOR_IE, ESPECIALISTA_UGEL, SUBDIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-encuesta-fija',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule],
  templateUrl: './encuesta-fija.component.html',
  styleUrl: './encuesta-fija.component.scss',
  providers: [SlicePipe],
})
export class EncuestaFijaComponent implements OnInit {
  categoria: any = null;
  encuesta: any = null;
  active: number = 0;
  iCateId: number;
  iEncuId: number;

  formEncuesta: FormGroup;
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
  encuesta_registrada: boolean = false;

  breadCrumbHome: MenuItem;
  breadCrumbItems: MenuItem[];

  distritos: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  areas: Array<object>;
  secciones: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  ies: Array<object>;
  sexos: Array<object>;
  estados: Array<object>;
  perfiles: Array<object>;
  permisos: Array<object>;
  tipos_reportes: Array<object>;
  tipos_graficos: Array<object>;
  tiempos_duracion: Array<object>;
  participantes: Array<object>;

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
    this.es_director = [DIRECTOR_IE, SUBDIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
    this.es_especialista_ugel = [ESPECIALISTA_UGEL].includes(Number(this.perfil.iPerfilId));
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iEncuId = params.params.iEncuId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.formEncuesta = this.fb.group({
        iEncuId: [0],
        cEncuNombre: ['', Validators.required],
        cEncuSubtitulo: [''],
        cEncuDescripcion: [''],
        iEstado: [this.ESTADO_BORRADOR],
        dEncuInicio: ['', Validators.required],
        dEncuFin: ['', Validators.required],
        iTiemDurId: ['', Validators.required],
        iCateId: [this.iCateId, Validators.required],
        iYAcadId: [this.store.getItem('dremoiYAcadId')],
        poblacion: [null],
        accesos: [null],
        jsonPoblacion: [null],
        jsonAccesos: [null],
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

    if (this.iEncuId) {
      this.verEncuesta();
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
        label: 'Encuestas',
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
        label: 'Gestionar encuestas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
      },
      {
        label: 'Nueva encuesta fija',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.encuesta = data.data;
            this.encuesta_registrada = true;
            this.setBreadCrumbs();
            this.setFormEncuesta(this.encuesta);
          } else {
            this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
        },
      });
  }

  setFormEncuesta(data: any) {
    if (Number(data.iEstado) !== this.ESTADO_BORRADOR || Number(data.puede_editar) !== 1) {
      data.iEstado = this.ESTADO_APROBADA;
      this.formEncuesta.disable();
      this.puede_editar = false;
    }
    this.formEncuesta.reset();
    this.formEncuesta.patchValue(data);
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iTiemDurId',
      data.iTiemDurId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iCateId',
      data.iCateId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'iEstado',
      data.iEstado,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'dEncuInicio',
      data.dEncuInicio,
      'date'
    );
    this.encuestasService.formatearFormControl(
      this.formEncuesta,
      'dEncuFin',
      data.dEncuFin,
      'date'
    );

    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.encuesta = data;
  }

  verPreguntas() {
    this.router.navigate([
      '/encuestas/categorias/' + this.iCateId + '/gestion-encuestas/' + this.iEncuId + '/preguntas',
    ]);
  }

  guardarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formEncuesta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    this.encuestasService.guardarEncuesta(this.formEncuesta.value).subscribe({
      next: (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        const iEncuId = data.data.iEncuId;
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${iEncuId}/preguntas`,
        ]);
      },
      error: error => {
        console.error('Error guardando encuesta:', error);
        this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
      },
    });
  }

  actualizarEncuesta() {
    this.formEncuesta.get('iYAcadId')?.setValue(this.iYAcadId);
    this.formEncuesta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);

    this.messageService.clear();
    if (this.formEncuesta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe llenar todos los campos de la primera sección: Información General',
      });
      return;
    }

    this.encuestasService.actualizarEncuesta(this.formEncuesta.getRawValue()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${this.iEncuId}/preguntas`,
        ]);
      },
      error: error => {
        console.error('Error guardando encuesta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
  }
}
