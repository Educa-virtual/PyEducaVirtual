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
  selector: 'app-encuesta-ver',
  standalone: true,
  imports: [
    PrimengModule,
    PreguntaOpcionSimpleComponent,
    PreguntaOpcionMultipleComponent,
    PreguntaTextoComponent,
  ],
  templateUrl: './encuesta-ver.component.html',
  styleUrl: './../lista-categorias/lista-categorias.component.scss',
  providers: [SlicePipe],
})
export class EncuestaVerComponent implements OnInit {
  iEncuId: number;
  iCateId: number;
  iPersId: number;

  perfil: any;
  secciones: any[] = [];

  formPreguntas: FormGroup;
  encuesta: any;
  respuesta_registrada: boolean = false;
  puede_editar: boolean = false;
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
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.iEncuId || 0;
      this.iCateId = params.params.iCateId || 0;
    });
    this.route.data.subscribe((data: any) => {
      this.puede_editar = data.puede_editar;
    });
  }

  ngOnInit() {
    try {
      this.formPreguntas = this.fb.group({
        iEncuId: [this.iEncuId, Validators.required],
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
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    if (this.puede_editar) {
      this.breadCrumbItems = [
        { label: 'Encuestas' },
        { label: 'Categorias', routerLink: `/encuestas/categorias` },
        {
          label: this.encuesta?.cCateNombre
            ? String(this.slicePipe.transform(this.encuesta?.cCateNombre, 0, 20))
            : 'Categoría',
        },
        {
          label: 'Encuestas',
          routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
        },
        {
          label: this.encuesta?.cEncuNombre
            ? String(this.slicePipe.transform(this.encuesta?.cEncuNombre, 0, 20))
            : 'Encuesta',
        },
        { label: 'Responder encuesta' },
      ];
    } else {
      this.breadCrumbItems = [
        { label: 'Encuestas' },
        { label: 'Categorias', routerLink: `/encuestas/categorias` },
        {
          label: this.encuesta?.cCateNombre
            ? String(this.slicePipe.transform(this.encuesta?.cCateNombre, 0, 20))
            : 'Categoría',
        },
        {
          label: 'Encuestas',
          routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
        },
        {
          label: this.encuesta?.cEncuNombre
            ? String(this.slicePipe.transform(this.encuesta?.cEncuNombre, 0, 20))
            : 'Encuesta',
          routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${this.iEncuId}`,
        },
        { label: 'Responder encuesta' },
      ];
    }
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
      .listarRespuestas({
        iEncuId: this.iEncuId,
        iPersId: this.iPersId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data[0].respuestas) {
            this.respuesta_registrada = true;
            const respuestas = JSON.parse(data.data[0].respuestas);
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

  setRespuestasFormArray(respuestas: any[]) {
    const preguntasFA = this.formPreguntas.get('preguntas') as FormArray;
    preguntasFA.controls.forEach((preguntaFG: FormGroup) => {
      const respuesta = respuestas.find(
        (respuesta: any) => respuesta.iPregId == preguntaFG.get('iPregId')?.value
      );
      if (respuesta) {
        preguntaFG.patchValue({
          iAlternativaId: respuesta.iAlternativaId,
          cRespContenido: respuesta.cRespContenido,
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

    this.encuestasService.guardarRespuesta(this.formPreguntas.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos. Redirigiendo a la lista de encuestas',
        });
        setTimeout(() => {
          this.router.navigate(['/bienestar/gestionar-encuestas']);
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

    this.encuestasService.actualizarRespuesta(this.formPreguntas.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos. Redirigiendo a la lista de encuestas',
        });
        setTimeout(() => {
          this.router.navigate(['/bienestar/gestionar-encuestas']);
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
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
  }
}
