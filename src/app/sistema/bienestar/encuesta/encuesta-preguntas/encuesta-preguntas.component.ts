import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosEncuestaService } from '../../services/datos-encuesta.service';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { PreguntaCerradaComponent } from '../shared/pregunta-cerrada/pregunta-cerrada.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { PreguntaAbiertaComponent } from '../shared/pregunta-abierta/pregunta-abierta.component';
import { PreguntaEscalaComponent } from '../shared/pregunta-escala/pregunta-escala.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-encuesta-preguntas',
  standalone: true,
  imports: [
    PrimengModule,
    TextFieldModule,
    PreguntaCerradaComponent,
    PreguntaAbiertaComponent,
    PreguntaEscalaComponent,
  ],
  templateUrl: './encuesta-preguntas.component.html',
  styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaPreguntasComponent implements OnInit {
  iEncuId: number;
  cEncuNombre: string;
  perfil: any;
  formPregunta: FormGroup;
  dialog_visible: boolean = false;
  dialog_header: string = 'Registrar pregunta';
  pregunta_registrada: boolean = false;
  preguntas: Array<any>;
  tipos_preguntas: Array<object>;
  alternativas: Array<object>;
  encuesta_bloqueada: boolean = true;
  es_pregunta_escala: boolean = false;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  PREGUNTA_ESCALA: number = this.datosEncuestas.PREGUNTA_ESCALA;
  ESTADO_BORRADOR: number = this.datosEncuestas.ESTADO_BORRADOR;

  private _messageService = inject(MessageService);
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    private datosEncuestas: DatosEncuestaService,
    private funcionesBienestar: FuncionesBienestarService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.paramMap.subscribe((params: any) => {
      this.iEncuId = params.params.id || 0;
    });
    this.breadCrumbItems = [
      {
        label: 'Bienestar social',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: '/bienestar/gestionar-encuestas',
      },
      {
        label: 'Encuesta',
        routerLink: `/bienestar/encuesta/${this.iEncuId}`,
      },
      {
        label: 'Preguntas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    try {
      this.formPregunta = this.fb.group({
        iEncuId: [this.iEncuId, Validators.required],
        iCredEntPerfId: [this.perfil.iCredEntPerfId],
        iEncuAlterGrupoId: [null],
        iEncuPregId: [null],
        iEncuPregTipoId: [null, Validators.required],
        iEncuPregOrden: [null],
        cEncuPregContenido: [null, [Validators.required, Validators.maxLength(500)]],
        cEncuPregAdicional: [null, [Validators.maxLength(500)]],
      });
    } catch (error) {
      console.error('Error creando formulario:', error);
    }

    this.datosEncuestas
      .getEncuestaParametros({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
      })
      .subscribe((data: any) => {
        this.alternativas = this.datosEncuestas.getAlternativas(data?.alternativas);
        this.tipos_preguntas = this.datosEncuestas.getTiposPreguntas();
      });

    this.formPregunta.get('iEncuPregTipoId').valueChanges.subscribe(value => {
      this.es_pregunta_escala = value === this.PREGUNTA_ESCALA;
    });

    if (this.iEncuId) {
      this.verEncuesta();
    }
  }

  verEncuesta() {
    this.datosEncuestas
      .verEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.cEncuNombre = data.data.cEncuNombre;
            this.encuesta_bloqueada =
              Number(data.data.iEstado) !== this.ESTADO_BORRADOR ||
              Number(data.data.puede_editar) !== 1;
            this.listarPreguntas();
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se encontró la encuesta',
            });
          }
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  listarPreguntas() {
    this.datosEncuestas
      .listarPreguntas({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data.length) {
            this.preguntas = data.data;
          } else {
            this.preguntas = null;
          }
        },
        error: error => {
          console.error('Error guardando pregunta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  clearForm() {
    this.formPregunta.reset();
  }

  verPregunta(item: any) {
    this.datosEncuestas
      .verPregunta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuPregId: item.iEncuPregId,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.setFormPregunta(data.data);
          }
        },
        error: error => {
          console.error('Error obteniendo pregunta:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setFormPregunta(data: any) {
    this.formPregunta.reset();
    this.formPregunta.patchValue(data);
    this.formPregunta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);
    this.formPregunta.get('iEncuId')?.setValue(this.iEncuId);
    this.funcionesBienestar.formatearFormControl(
      this.formPregunta,
      'iEncuPregId',
      data.iEncuPregId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formPregunta,
      'iEncuPregTipoId',
      data.iEncuPregTipoId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formPregunta,
      'iEncuPregOrden',
      data.iEncuPregOrden,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formPregunta,
      'iEncuAlterGrupoId',
      data.iEncuAlterGrupoId,
      'number'
    );
    this.pregunta_registrada = true;
  }

  guardarPregunta() {
    if (this.formPregunta.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.datosEncuestas.guardarPregunta(this.formPregunta.value).subscribe({
      next: () => {
        this.listarPreguntas();
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.dialog_visible = false;
      },
      error: error => {
        console.error('Error guardando pregunta:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizarPregunta() {
    if (this.formPregunta.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.datosEncuestas.actualizarPregunta(this.formPregunta.value).subscribe({
      next: () => {
        this.listarPreguntas();
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.dialog_visible = false;
      },
      error: error => {
        console.error('Error actualizando prgunta:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  agregarPregunta() {
    this.formPregunta.reset();
    this.pregunta_registrada = false;
    this.dialog_visible = true;
    this.dialog_header = 'Registrar pregunta';
    this.formPregunta.get('iEncuId')?.setValue(this.iEncuId);
    this.formPregunta.get('iCredEntPerfId')?.setValue(this.perfil.iCredEntPerfId);
  }

  editarPregunta(item: any) {
    this.formPregunta.reset();
    this.dialog_visible = true;
    this.dialog_header = 'Actualizar pregunta';
    this.verPregunta(item);
  }

  borrarPregunta(item: any) {
    console.log(item, 'item');
    this._confirmService.openConfirm({
      message: '¿Está seguro de eliminar la pregunta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.datosEncuestas
          .borrarPregunta({
            iCredEntPerfId: this.perfil.iCredEntPerfId,
            iEncuPregId: item.iEncuPregId,
          })
          .subscribe({
            next: () => {
              this._messageService.add({
                severity: 'success',
                summary: 'Eliminación exitosa',
                detail: 'Se eliminó la pregunta',
              });
              this.listarPreguntas();
            },
            error: error => {
              console.error('Error eliminando pregunta:', error);
              this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
              });
            },
          });
      },
      reject: () => {},
    });
  }

  salir() {
    this.router.navigate(['/bienestar/gestionar-encuestas']);
  }
}
