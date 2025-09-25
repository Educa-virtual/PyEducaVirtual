import { PrimengModule } from '@/app/primeng.module';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { EncuestasService } from '../services/encuestas.services';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaOpcionSimpleComponent } from '../shared/pregunta-opcion-simple/pregunta-opcion-simple.component';
import { PreguntaOpcionMultipleComponent } from '../shared/pregunta-opcion-multiple/pregunta-opcion-multiple.component';
import { PreguntaTextoComponent } from '../shared/pregunta-texto/pregunta-texto.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-ver-encuesta',
  standalone: true,
  imports: [
    PrimengModule,
    PreguntaOpcionSimpleComponent,
    PreguntaOpcionMultipleComponent,
    PreguntaTextoComponent,
  ],
  templateUrl: './ver-encuesta.component.html',
  styleUrl: './ver-encuesta.component.scss',
  providers: [SlicePipe],
})
export class VerEncuestaComponent implements OnInit {
  iEncuId: number;
  iCateId: number;
  iPersId: number;

  perfil: any;
  iYAcadId: number;
  secciones: any[] = [];

  formPreguntas: FormGroup;
  encuesta: any;
  respuesta_registrada: boolean = false;
  puede_editar: boolean = false;
  es_encuestador: boolean = false;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  TIPO_PREG_TEXTO: number = this.encuestasService.TIPO_PREG_TEXTO;
  TIPO_PREG_SIMPLE: number = this.encuestasService.TIPO_PREG_SIMPLE;
  TIPO_PREG_MULTIPLE: number = this.encuestasService.TIPO_PREG_MULTIPLE;

  USUARIO_ENCUESTADO: number = this.encuestasService.USUARIO_ENCUESTADO;

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
      this.iEncuId = params.params.iEncuId || 0;
      this.iCateId = params.params.iCateId || 0;
      this.iPersId = params.params.iPersId || 0;
    });
    this.route.data.subscribe((data: any) => {
      this.es_encuestador = data.es_encuestador;
    });
  }

  ngOnInit() {
    try {
      this.formPreguntas = this.fb.group({
        iEncuId: [this.iEncuId, Validators.required],
        iYAcadId: [this.iYAcadId],
        preguntas: this.fb.array([]),
        jsonPreguntas: [null],
      });

      if (this.iEncuId) {
        this.verEncuesta();
        this.listarSecciones();
      }
    } catch (error) {
      console.error('Error creando formulario:', error);
    }
    this.setBreadCrumbs();
    this.verRespuestas();
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
        label: this.encuesta?.cCateNombre
          ? String(this.slicePipe.transform(this.encuesta?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: this.es_encuestador ? 'Gestionar encuestas' : 'Listar encuestas',
        routerLink: this.es_encuestador
          ? `/encuestas/categorias/${this.iCateId}/gestion-encuestas`
          : `/encuestas/categorias/${this.iCateId}/lista-encuestas`,
      },
      {
        label: this.encuesta?.cEncuNombre
          ? String(this.slicePipe.transform(this.encuesta?.cEncuNombre, 0, 20))
          : 'Encuesta',
      },
      { label: 'Ver respuestas' },
    ];
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iEncuId: this.iEncuId,
        iTipoUsuario: this.USUARIO_ENCUESTADO,
      })
      .subscribe({
        next: (data: any) => {
          this.encuesta = data.data;
          this.puede_editar =
            Boolean(Number(this.encuesta.puede_responder)) && !this.es_encuestador;
          this.encuesta.accesos_detalle = JSON.parse(this.encuesta.json_accesos_detalle);
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

  listarSecciones() {
    this.encuestasService
      .listarSecciones({
        iEncuId: this.iEncuId,
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

  verRespuestas() {
    this.encuestasService
      .verRespuestas({
        iEncuId: this.iEncuId,
        iPersId: this.iPersId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data.respuestas) {
            this.respuesta_registrada = true;
            const respuestas = JSON.parse(data.data.respuestas);
            this.setRespuestasFormArray(respuestas);
          }
        },
        error: error => {
          console.error('Error obteniendo respuestas:', error);
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

  setRespuestasFormArray(respuestas: any[]) {
    const preguntasFA = this.formPreguntas.get('preguntas') as FormArray;
    preguntasFA.controls.forEach((preguntaFG: FormGroup) => {
      const respuesta = respuestas.find(
        (respuesta: any) => Number(respuesta.iPregId) == Number(preguntaFG.get('iPregId')?.value)
      );
      if (respuesta) {
        preguntaFG.patchValue({
          cRespContenido:
            Number(respuesta.iTipoPregId) == this.TIPO_PREG_MULTIPLE
              ? JSON.parse(respuesta.cRespContenido)
              : respuesta.cRespContenido,
        });
      }
    });
  }

  guardarRespuesta() {
    this.encuestasService.formControlJsonStringify(
      this.formPreguntas,
      'jsonPreguntas',
      'preguntas',
      ''
    );
    this.encuestasService.guardarRespuestas(this.formPreguntas.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos. Redirigiendo a la lista de encuestas',
        });
        setTimeout(() => {
          this.router.navigate([`/encuestas/categorias/${this.iCateId}/lista-encuestas`]);
        }, 2000);
      },
      error: error => {
        console.error('Error guardando pregunta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarRespuesta() {
    this.encuestasService.formControlJsonStringify(
      this.formPreguntas,
      'jsonPreguntas',
      'preguntas',
      ''
    );
    this.encuestasService.actualizarRespuestas(this.formPreguntas.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos. Redirigiendo a la lista de encuestas',
        });
        setTimeout(() => {
          this.router.navigate([`/encuestas/categorias/${this.iCateId}/lista-encuestas`]);
        }, 2000);
      },
      error: error => {
        console.error('Error actualizando pregunta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  salir() {
    if (this.USUARIO_ENCUESTADO) {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/lista-encuestas`]);
    } else {
      this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
    }
  }

  formatearTiempoRestante(encuesta: any) {
    const iMinutosRestantes = Number(encuesta?.iMinutosRestantes);
    if (Number(encuesta?.iTiempDurId) === 0) return '';
    else if (iMinutosRestantes === 0) return '(Tiempo expirado)';
    else if (iMinutosRestantes > 0 && iMinutosRestantes < 60)
      return `(${iMinutosRestantes} minutos restantes)`;
    else if (iMinutosRestantes >= 60 && iMinutosRestantes < 1440)
      return `(${Math.floor(iMinutosRestantes / 60)} horas restantes)`;
    else if (iMinutosRestantes >= 1440) return `(más de 1 día restante)`;
    return '';
  }
}
