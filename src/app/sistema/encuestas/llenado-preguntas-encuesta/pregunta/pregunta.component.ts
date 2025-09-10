import { PrimengModule } from '@/app/primeng.module';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MessageService } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-pregunta',
  standalone: true,
  imports: [PrimengModule, EditorComponent, TextFieldModule],
  templateUrl: './pregunta.component.html',
  styleUrl: './../../lista-categorias/lista-categorias.component.scss',
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
    },
  ],
})
export class PreguntaComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() iPregId: number;
  @Input() iSeccionId: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() preguntaModificada = new EventEmitter<any>();

  dialogTitle: string = 'Agregar pregunta';
  iTipoPregId: number;

  formPregunta: FormGroup;
  pregunta: any = {
    alternativas: [],
  };
  pregunta_registrada: boolean = false;
  secciones: Array<object> = [];

  formAlternativa: FormGroup;
  selectedAlternativa: any;
  selectedAlternativas: any[] = [];

  perfil: any;
  iYAcadId: number;
  iCateId: number;

  tipos_preguntas: Array<object> = [];
  TIPO_PREG_TEXTO: number = this.encuestasService.TIPO_PREG_TEXTO;
  TIPO_PREG_SIMPLE: number = this.encuestasService.TIPO_PREG_SIMPLE;
  TIPO_PREG_MULTIPLE: number = this.encuestasService.TIPO_PREG_MULTIPLE;

  /* EDITOR TINYMCE */
  initEnunciado: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    menubar: false,
    selector: 'textarea',
    placeholder: 'Escribe aqui...',
    height: 250,
    plugins: 'lists image table',
    toolbar:
      'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify fontsize | bullist numlist | ' +
      'image table',
  };

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
    });
  }

  ngOnInit(): void {
    try {
      this.formPregunta = this.fb.group({
        iPregId: [null],
        iSeccionId: [null, Validators.required],
        iTipoPregId: [null, Validators.required],
        iPregOrden: [null],
        cPregContenido: ['', [Validators.required, Validators.maxLength(500)]],
        cPregAdicional: [''],
        alternativas: [null],
        jsonAlternativas: [null],
      });

      this.formAlternativa = this.fb.group({
        iAlternativaId: [null],
        cAlternativaContenido: ['', Validators.maxLength(150)],
      });

      this.encuestasService
        .crearEncuesta({
          iCredEntPerfId: this.perfil.iCredEntPerfId,
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
        })
        .subscribe((data: any) => {
          this.tipos_preguntas = this.encuestasService.getTiposPreguntas(data?.tipos_preguntas);
        });
    } catch (error) {
      console.log(error);
    }

    this.secciones = this.encuestasService.getSecciones(null);
    this.formPregunta.get('iTipoPregId').valueChanges.subscribe(value => {
      this.iTipoPregId = value;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.secciones = this.encuestasService.getSecciones(null);
    if (this.iPregId && changes['visible']?.currentValue === true) {
      this.dialogTitle = 'Editar pregunta';
      this.verPregunta();
    } else {
      this.dialogTitle = 'Agregar pregunta';
      this.iPregId = null;
      this.pregunta_registrada = false;
      this.clearForm();
      if (this.formPregunta) {
        this.formPregunta.get('iSeccionId').patchValue(this.iSeccionId);
      }
    }
  }

  verPregunta() {
    this.encuestasService
      .verPregunta({
        iPregId: this.iPregId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormPregunta(data.data);
        },
        error: error => {
          console.error('Error obteniendo pregunta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setFormPregunta(pregunta: any) {
    this.formPregunta.patchValue(pregunta);
    this.formPregunta.get('iPregId').patchValue(this.iPregId);
    this.encuestasService.formatearFormControl(
      this.formPregunta,
      'iSeccionId',
      pregunta.iSeccionId,
      'number'
    );
    this.encuestasService.formatearFormControl(
      this.formPregunta,
      'iTipoPregId',
      pregunta.iTipoPregId,
      'number'
    );
    if (pregunta.alternativas) {
      const alternativas = JSON.parse(pregunta.alternativas.replace(/^"(.*)"$/, '$1'));
      alternativas.forEach(alternativa => {
        this.agregarAlternativa(alternativa);
      });
    }
    this.pregunta_registrada = true;
    this.formPregunta.markAsDirty();
  }

  clearForm() {
    this.pregunta = {
      alternativas: [],
    };
    if (this.formPregunta) {
      this.formPregunta.reset();
      this.formPregunta.get('iPregId').patchValue(this.iPregId);
    }
    if (this.formAlternativa) {
      this.formAlternativa.reset();
    }
  }

  agregarAlternativa(item: any | null) {
    if (
      item.length === 0 &&
      (this.formAlternativa.value.cAlternativaContenido === null ||
        this.formAlternativa.value.cAlternativaContenido.trim() === '')
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar el nombre de la alternativa',
      });
      this.encuestasService.formMarkAsDirty(this.formAlternativa);
      return;
    }
    this.pregunta.alternativas = [
      ...this.pregunta.alternativas,
      {
        iAlternativaId: item?.iAlternativaId ?? Date.now(),
        cAlternativaContenido:
          item?.cAlternativaContenido ?? this.formAlternativa.value.cAlternativaContenido,
      },
    ];
    this.formPregunta.get('alternativas').patchValue(this.pregunta.alternativas);
    this.formAlternativa.reset();
    this.cd.detectChanges();
  }

  eliminarAlternativa(iAlternativaId: number) {
    this.pregunta.alternativas = this.pregunta.alternativas.filter(
      (alternativa: any) => alternativa.iAlternativaId !== iAlternativaId
    );
    this.formPregunta.get('alternativas').patchValue(this.pregunta.alternativas);
    this.cd.detectChanges();
  }

  guardarPregunta() {
    if (this.formPregunta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      this.encuestasService.formMarkAsDirty(this.formPregunta);
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formPregunta,
      'jsonAlternativas',
      'alternativas',
      ''
    );

    if (
      Number(this.formPregunta.value.iTipoPregId) !== this.TIPO_PREG_TEXTO &&
      this.pregunta.alternativas.length < 2
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe agregar al menos dos alternativas',
      });
      return;
    }

    this.encuestasService.guardarPregunta(this.formPregunta.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.preguntaModificada.emit(true);
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

  actualizar() {
    if (this.formPregunta.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }

    this.encuestasService.formControlJsonStringify(
      this.formPregunta,
      'jsonAlternativas',
      'alternativas',
      ''
    );

    if (
      Number(this.formPregunta.value.iTipoPregId) !== this.TIPO_PREG_TEXTO &&
      this.pregunta.alternativas.length < 2
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe agregar al menos 2 alternativas',
      });
      return;
    }

    this.encuestasService.actualizarPregunta(this.formPregunta.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.preguntaModificada.emit(true);
      },
      error: error => {
        console.error('Error actualizando prgunta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.iPregId = null;
    this.pregunta_registrada = false;
  }

  cancelar() {
    this.onHide();
  }

  finalizar() {
    this.onHide();
  }
}
