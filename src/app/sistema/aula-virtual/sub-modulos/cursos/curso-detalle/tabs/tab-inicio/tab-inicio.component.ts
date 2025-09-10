import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewChecked,
} from '@angular/core';
import { ICurso } from '../../../interfaces/curso.interface';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { AnunciosService } from '@/app/servicios/aula/anuncios.service';
import { INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';
@Component({
  selector: 'app-tab-inicio',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tab-inicio.component.html',
  styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent extends MostrarErrorComponent implements OnInit, AfterViewChecked {
  @ViewChildren('textareaRef') textareaRefs!: QueryList<ElementRef>;

  @Input() curso: ICurso;
  @Input() anuncios = [];
  @Input() iCursoId;
  @Input() idDocCursoId;
  @Input() iCapacitacionId;

  private _formBuilder = inject(FormBuilder);
  private _AnunciosService = inject(AnunciosService);
  private _ConstantesService = inject(ConstantesService);
  private _ConfirmService = inject(ConfirmationModalService);

  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;
  public INSTRUCTOR = INSTRUCTOR;
  public PARTICIPANTE = PARTICIPANTE;

  iPerfilId: number;
  anunciosDocente: any[] = [];
  data: any[];
  remainingText: number = 0;
  tituloremainingText: number = 0;
  cNombres: string = '';
  //form para obtener la variable
  public formAnuncios: FormGroup = this._formBuilder.group({
    titulo: ['', [Validators.required, Validators.pattern(/\S+/)]],
    descripcion: ['', [Validators.required, Validators.pattern(/\S+/)]],
  });

  //Inicializamos
  ngOnInit(): void {
    this.iPerfilId = this._ConstantesService.iPerfilId;
    this.obtenerAnuncios(true);

    // contador de caracteres de descripcion
    this.formAnuncios.get('descripcion')?.valueChanges.subscribe((value: string) => {
      this.remainingText = value?.length || 0;
    });
    // contador de caracteres de título
    this.formAnuncios.get('titulo')?.valueChanges.subscribe((value: string) => {
      this.tituloremainingText = value?.length || 0;
    });
    this.cNombres = this._ConstantesService.nombres;
  }

  // asignar el color de los caracteres restantes
  getColorClass(): string {
    if (this.remainingText > 480) {
      return 'text-danger';
    } else if (this.remainingText > 400) {
      return 'text-warning';
    } else {
      return 'text-normal';
    }
  }

  // asignar el color de los caracteres del titulo
  asignarColorTitulo(): string {
    if (this.tituloremainingText > 80) {
      return 'text-danger';
    } else {
      return 'text-normal';
    }
  }

  // metodo para buscar x título de enunciado
  buscarText: string = '';
  dataFiltrada() {
    if (!this.buscarText) {
      return this.data;
    }

    const texto = this.buscarText.toLowerCase();
    return this.data.filter(card => card.cTitulo.toLowerCase().includes(texto));
  }

  // guardar anunciado:
  guardarAnuncio() {
    if (!this.esRolPermitido()) {
      return;
    }

    const params = {
      idDocCursoId: this.idDocCursoId,
      iCapacitacionId: this.iCapacitacionId,
      iCredId: this._ConstantesService.iCredId,
      cTitulo: this.formAnuncios.value.titulo,
      cContenido: this.formAnuncios.value.descripcion,
    };
    if (this.formAnuncios.invalid) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Formulario inválido',
      });
    } else {
      this._ConfirmService.openConfiSave({
        message: 'Recuerde que podran verlo todos los estudiantes',
        header: `¿Desea proceder con la publicación del anuncio?`,
        accept: () => {
          this._AnunciosService.guardarAnuncio(params).subscribe({
            next: (resp: any) => {
              // para refrescar la pagina
              if (resp?.validated) {
                this.mostrarMensajeToast({
                  severity: 'success',
                  summary: '¡Genial!',
                  detail: 'Anuncio creado correctamente',
                });

                this.obtenerAnuncios(true);
                this.formAnuncios.reset();
              }
            },
            error: error => {
              this.mostrarErrores(error);
            },
          });
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
  }

  // metodo para eliminar el anuncio
  eliminarComunicado(id): void {
    if (!this.esRolPermitido()) {
      return;
    }
    const iAnuncioId = id.iAnuncioId;
    const nombreTitulo = id.cTitulo;

    this._ConfirmService.openConfiSave({
      message: 'Recuerde que al eliminarlo no podra recuperarlo',
      header: `¿Esta seguro de Eliminar: ${nombreTitulo} ?`,
      accept: () => {
        const iCredId = this._ConstantesService.iCredId;
        const params = {
          iAnuncioId: iAnuncioId,
          iCredId: iCredId,
        };
        this._AnunciosService.eliminarAnuncio(params).subscribe({
          next: (response: any) => {
            if (response.validated) {
              this.mostrarMensajeToast({
                severity: 'success',
                summary: '¡Genial!',
                detail: 'Anuncio eliminado correctamente',
              });
            }
            this.obtenerAnuncios(true);
          },
          error: error => {
            this.mostrarErrores(error);
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.mostrarMensajeToast({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  // metodo para fijar el anuncio
  fijarAnuncio(id: string, iFijado: number): void {
    if (!this.esRolPermitido()) {
      return;
    }

    const iCredId = this._ConstantesService.iCredId;
    const params = {
      iAnuncioId: id,
      iCredId: iCredId,
    };
    this._AnunciosService.fijarAnuncio(params).subscribe({
      next: (response: any) => {
        if (response.validated) {
          this.obtenerAnuncios(true);
          this.mostrarMensajeToast({
            severity: 'success',
            summary: 'Exito',
            detail:
              Number(iFijado) === 1
                ? 'El anuncio se ha desfijado correctamente.'
                : 'El anuncio se ha fijado correctamente.',
          });
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }
  // obtener anunciados de curso o capacitación:
  obtenerAnuncios(recargar = false) {
    const iCredId = this._ConstantesService.iCredId;

    const params = {
      idDocCursoId: this.idDocCursoId,
      iCredId: iCredId,
      iCapacitacionId: this.iCapacitacionId,
    };

    this._AnunciosService.obtenerAnuncios(params, recargar).subscribe({
      next: Data => {
        this.data = Data['data'] || [];
        this.data.sort((a, b) => b.iFijado - a.iFijado);
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  ngAfterViewChecked(): void {
    this.adjustAllTextareas();
  }

  adjustAllTextareas() {
    this.textareaRefs?.forEach((textareaEl: ElementRef) => {
      const textarea = textareaEl.nativeElement;
      textarea.style.height = 'auto'; // reset
      textarea.style.height = `${textarea.scrollHeight}px`; // ajustar al contenido
    });
  }

  esRolPermitido(): boolean {
    const rolesPermitidos = [this.DOCENTE, this.INSTRUCTOR];
    return rolesPermitidos.includes(this.iPerfilId);
  }
}
