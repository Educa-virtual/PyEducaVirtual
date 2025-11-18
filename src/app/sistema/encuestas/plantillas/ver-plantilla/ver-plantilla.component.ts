import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaOpcionSimpleComponent } from '../../shared/pregunta-opcion-simple/pregunta-opcion-simple.component';
import { PreguntaOpcionMultipleComponent } from '../../shared/pregunta-opcion-multiple/pregunta-opcion-multiple.component';
import { PreguntaTextoComponent } from '../../shared/pregunta-texto/pregunta-texto.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-ver-plantilla',
  standalone: true,
  imports: [
    PrimengModule,
    PreguntaOpcionSimpleComponent,
    PreguntaOpcionMultipleComponent,
    PreguntaTextoComponent,
  ],
  templateUrl: './ver-plantilla.component.html',
  styleUrl: './ver-plantilla.component.scss',
  providers: [SlicePipe],
})
export class VerPlantillaComponent implements OnInit {
  iCateId: number;
  iPlanId: number;

  perfil: any;
  iYAcadId: number;
  secciones: any[] = [];

  formPreguntas: FormGroup;
  plantilla: any;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  TIPO_PREG_TEXTO: number = this.encuestasService.TIPO_PREG_TEXTO;
  TIPO_PREG_SIMPLE: number = this.encuestasService.TIPO_PREG_SIMPLE;
  TIPO_PREG_MULTIPLE: number = this.encuestasService.TIPO_PREG_MULTIPLE;

  get preguntasFormArray() {
    return this.formPreguntas.get('preguntas') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private slicePipe: SlicePipe
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || 0;
      this.iPlanId = params.params.iPlanId || 0;
    });
  }

  ngOnInit() {
    try {
      this.formPreguntas = this.fb.group({
        iPlanId: [this.iPlanId, Validators.required],
        iYAcadId: [this.iYAcadId],
        preguntas: this.fb.array([]),
        jsonPreguntas: [null],
      });

      if (this.iPlanId) {
        this.verPlantilla();
        this.listarPlantillaSecciones();
      }
    } catch (error) {
      console.error('Error creando formulario:', error);
    }
    this.setBreadCrumbs();
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorias', routerLink: `/encuestas/categorias` },
      {
        label: this.plantilla?.cCateNombre
          ? String(this.slicePipe.transform(this.plantilla?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar plantillas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-plantillas`,
      },
      {
        label: this.plantilla?.cPlanNombre
          ? String(this.slicePipe.transform(this.plantilla?.cPlanNombre, 0, 20))
          : 'Encuesta',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${this.iPlanId}`,
      },
      { label: 'Vista previa' },
    ];
  }

  verPlantilla() {
    this.encuestasService
      .verPlantilla({
        iPlanId: this.iPlanId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantilla = data.data;
          this.setBreadCrumbs();
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  listarPlantillaSecciones() {
    this.encuestasService
      .listarPlantillaSecciones({
        iPlanId: this.iPlanId,
      })
      .subscribe({
        next: (data: any) => {
          this.secciones = data.data;
          this.secciones.forEach((seccion: any) => {
            seccion.preguntas = seccion?.json_preguntas ? JSON.parse(seccion.json_preguntas) : [];
          });
          // obtener array de preguntas
          const preguntas = this.secciones.reduce(
            (total, seccion) => total.concat(seccion.preguntas),
            []
          );
          this.setPreguntasFormArray(preguntas);
        },
        error: error => {
          console.error('Error obteniendo lista de preguntas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setPreguntasFormArray(preguntas: any[]) {
    const preguntasFGs = preguntas.map(p =>
      this.fb.group({
        iPregId: [p.iPregId],
        iTipoPregId: [p.iTipoPregId],
        iAlternativaId: [null],
        cRespContenido: [null],
      })
    );
    const formArray = this.fb.array(preguntasFGs);
    this.formPreguntas.setControl('preguntas', formArray);
  }

  getPreguntaGlobalIndex(seccion: any, preguntaIndex: number): number {
    let globalIndex = 0;
    for (const sec of this.secciones) {
      if (sec === seccion) break;
      globalIndex += sec.preguntas.length;
    }
    return globalIndex + preguntaIndex;
  }

  salir() {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${this.iPlanId}/preguntas`,
    ]);
  }
}
