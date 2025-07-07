import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  AfterViewChecked,
} from '@angular/core';
import { ICurso } from '../../../interfaces/curso.interface';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service';
import { MessageService } from 'primeng/api';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
@Component({
  selector: 'app-tab-inicio',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tab-inicio.component.html',
  styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChildren('textareaRef') textareaRefs!: QueryList<ElementRef>;

  @Input() curso: ICurso;
  @Input() anuncios = [];
  @Input() iCursoId;
  @Input() _iSilaboId;
  @Input() idDocCursoId;

  private _formBuilder = inject(FormBuilder);
  private _aulaService = inject(ApiAulaService);
  private _constantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);

  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;

  iPerfilId: number;
  anunciosDocente: any[] = [];
  data: any[];
  contadorAnuncios: number = 0;
  remainingText: number = 0;
  tituloremainingText: number = 0;
  cNombres: string = '';
  //form para obtener la variable
  public guardarComunicado: FormGroup = this._formBuilder.group({
    numero: new FormControl(''),
    titulo: ['', [Validators.required, Validators.pattern(/\S+/)]],
    descripcion: ['', [Validators.required, Validators.pattern(/\S+/)]],
  });
  //para los alert
  constructor(private messageService: MessageService) {}
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  //Inicializamos
  ngOnInit(): void {
    this.iPerfilId = this._constantesService.iPerfilId;
    this.obtenerAnuncios();

    // contador de caracteres de descripcion
    this.guardarComunicado.get('descripcion')?.valueChanges.subscribe((value: string) => {
      this.remainingText = value?.length || 0;
    });
    // contador de caracteres de título
    this.guardarComunicado.get('titulo')?.valueChanges.subscribe((value: string) => {
      this.tituloremainingText = value?.length || 0;
    });
    this.cNombres = this._constantesService.nombres;
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
    // || card.cContenido.toLowerCase().includes(texto)
  }

  // guardar anunciado:
  guardarComunicadoSubmit() {
    const iCursosNivelGradId = 1;
    const iCredId = this._constantesService.iCredId;
    const data = {
      iCursosNivelGradId: iCursosNivelGradId,
      idDocCursoId: this.idDocCursoId,
      iCredId: iCredId,
      cTitulo: this.guardarComunicado.value.titulo,
      cContenido: this.guardarComunicado.value.descripcion,
    };
    if (this.guardarComunicado.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Formulario inválido',
      });
    } else {
      this._confirmService.openConfiSave({
        message: 'Recuerde que podran verlo todos los estudiantes',
        header: `¿Desea proceder con la publicación del enunciado?`,
        accept: () => {
          this._aulaService.guardarAnuncio(data).subscribe({
            next: (resp: any) => {
              // para refrescar la pagina
              if (resp?.validated) {
                this.obtenerAnuncios();
                // this.guardarComunicado.get('cForoRptaPadre')?.reset()
              }
            },
            error: error => {
              console.error('Comentario:', error);
            },
          });
          this.guardarComunicado.reset();
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
      // console.log(this.guardarComunicado.value)
    }
  }

  // metodo para eliminar el anuncio
  eliminarComunicado(id): void {
    const iAnuncioId = id.iAnuncioId;
    const nombreTitulo = id.cTitulo;

    this._confirmService.openConfiSave({
      message: 'Recuerde que al eliminarlo no podra recuperarlo',
      header: `¿Esta seguro de Eliminar: ${nombreTitulo} ?`,
      accept: () => {
        const iCredId = this._constantesService.iCredId;
        const params = {
          iAnuncioId: iAnuncioId,
          iCredId: iCredId,
        };
        this._aulaService.eliminarAnuncio(params).subscribe({
          next: response => {
            console.log('Elemento eliminado correctamente', response);
          },
          error: err => {
            console.error('Error al eliminar:', err);
          },
        });

        // Si quieres además eliminarlo del array local:
        this.data = this.data.filter(item => item.iAnuncioId !== iAnuncioId);
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  // metodo para fijar el anuncio
  fijarAnuncio(id: string, iFijado: number): void {
    if (this.iPerfilId !== this.DOCENTE) return;
    const iCredId = this._constantesService.iCredId;
    const params = {
      iAnuncioId: id,
      iCredId: iCredId,
    };
    this._aulaService.fijarAnuncio(params).subscribe({
      next: (response: any) => {
        if (response.validated) {
          this.obtenerAnuncios();
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail:
              Number(iFijado) === 1
                ? 'El anuncio se ha desfijado correctamente.'
                : 'El anuncio se ha fijado correctamente.',
          });
        }
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo fijar el anuncio: ' + err,
        });
      },
    });
  }
  // obtener anunciados de curso:
  obtenerAnuncios() {
    const iCursosNivelGradId = 1;
    const iCredId = this._constantesService.iCredId;

    const paramst = {
      iCursosNivelGradId: iCursosNivelGradId,
      idDocCursoId: this.idDocCursoId,
      iCredId: iCredId,
    };

    this._aulaService.obtenerAnuncios(paramst).subscribe(Data => {
      this.data = Data['data'];
      this.data.sort((a, b) => b.iFijado - a.iFijado);

      // console.log('Anuncios:', this.data)

      this.contadorAnuncios = this.data.length + 1;
      // Asignar valor al campo "numero" del formulario
      this.guardarComunicado.patchValue({
        numero: this.contadorAnuncios,
      });
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
}
