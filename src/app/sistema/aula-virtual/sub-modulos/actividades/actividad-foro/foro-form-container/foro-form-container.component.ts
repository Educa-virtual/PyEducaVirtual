import { Component, inject, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service';
import { PrimengModule } from '@/app/primeng.module';
import { Message } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GeneralService } from '@/app/servicios/general.service';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ForosService } from '@/app/servicios/aula/foros.service';
import { FORO } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-foro-form-container',
  standalone: true,
  imports: [PrimengModule, TypesFilesUploadPrimengComponent],
  templateUrl: './foro-form-container.component.html',
  styleUrl: './foro-form-container.component.scss',
})
export class ForoFormContainerComponent extends MostrarErrorComponent implements OnInit {
  @Input() contenidoSemana;

  typesFiles = {
    file: true,
    url: true,
    youtube: true,
    repository: false,
    image: false,
  };
  filesUrl = [];
  // _aulaService obtener datos
  pipe = new DatePipe('es-ES');
  date = new Date();

  private _aulaService = inject(ApiAulaService);
  private _formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private GeneralService = inject(GeneralService);
  private _ConstantesService = inject(ConstantesService);
  private _ForosService = inject(ForosService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _DialogConfig = inject(DynamicDialogConfig);

  tareas = [];

  categorias: any[] = [];
  semana: Message[] = [];

  idDocCursoId: any;
  isLoading: boolean = false;

  public foroForm = this._formBuilder.group({
    cForoTitulo: ['', [Validators.required]],
    cForoDescripcion: ['', [Validators.required]],
    iForoCatId: [0, [Validators.required]],
    dtForoInicio: [this.date, Validators.required],
    dtForoFin: [this.date, Validators.required],
    cForoUrl: [],
    iForoId: [],

    iContenidoSemId: ['', Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: [''],
    iCredId: ['', Validators.required],

    iCapacitacionId: [''],
    iYAcadId: ['', Validators.required],
    iDocenteId: ['', Validators.required],
  });

  action: string = 'GUARDAR';
  perfil: any;
  data: any;

  ngOnInit(): void {
    this.mostrarCategorias();
    this.contenidoSemana = this._DialogConfig.data.contenidoSemana;
    this.idDocCursoId = this._DialogConfig.data.idDocCursoId;
    this.action = this._DialogConfig.data.action.toUpperCase();

    this.data = this._DialogConfig.data;

    if (this.action == 'ACTUALIZAR') {
      this.obtenerForoxiForoId(this.data.actividad.ixActivadadId);
    }

    this.semana = [
      {
        severity: 'info',
        detail: this.contenidoSemana?.cContenidoSemTitulo,
      },
    ];
  }
  // Mostrar las categorias que existen para foros
  mostrarCategorias() {
    const userId = 1;
    this._aulaService.obtenerCategorias(userId).subscribe(Data => {
      this.categorias = Data['data'];
      //console.log('Datos mit', this.categorias)
    });
  }
  // Cerrar el modal
  closeModal(data) {
    this.ref.close(data);
  }
  // Guardar foro
  submit() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.foroForm.patchValue({
      iContenidoSemId: this.contenidoSemana?.iContenidoSemId,
      idDocCursoId: this.data?.idDocCursoId,
      iCapacitacionId: this.data?.iCapacitacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iActTipoId: FORO,
      iCredId: this._ConstantesService.iCredId,
      cForoUrl: JSON.stringify(this.filesUrl),
      iYAcadId: this._ConstantesService.iYAcadId,
    });

    const nombresCampos: Record<string, string> = {
      cForoTitulo: 'Título del foro',
      cForoDescripcion: 'Descripción',
      iForoCatId: 'Categoría',
      dtForoInicio: 'Fecha de inicio',
      dtForoFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      iCredId: 'Credencial',
      iYAcadId: 'Año académico',
      iDocenteId: 'Docente',
    };

    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.foroForm,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const { idDocCursoId, iCapacitacionId } = this.foroForm.value;

    const soloUnoPresente = Boolean(idDocCursoId) !== Boolean(iCapacitacionId);

    if (!soloUnoPresente) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el curso',
      });
      this.isLoading = false;
      return;
    }

    const data = {
      ...this.foroForm.value,
      dtForoInicio: this.foroForm.value.dtForoInicio
        ? this.pipe.transform(this.foroForm.value.dtForoInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,

      dtForoFin: this.foroForm.value.dtForoFin
        ? this.pipe.transform(this.foroForm.value.dtForoFin, 'dd/MM/yyyy HH:mm:ss')
        : null,
    };

    if (this.action === 'GUARDAR') {
      this.agregarForo(data);
    }
    if (this.action === 'ACTUALIZAR') {
      this.actualizarForo(data);
    }
  }
  obtenerForoxiForoId(iForoId: string) {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'foros',
      ruta: 'obtenerForoxiForoId',
      data: {
        iForoId: iForoId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta);
  }
  getInformation(params, condition) {
    this.GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtnItem({ accion: condition, item: response.data });
      },
      complete: () => {},
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }
  // acciones para subir los archivos
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'subir-file-foros':
        this.filesUrl.push({
          type: 1, //1->file
          nameType: 'file',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'url-foros':
        if (item === '') return;
        this.filesUrl.push({
          type: 2, //2->url
          nameType: 'url',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
      case 'youtube-foros':
        this.filesUrl.push({
          type: 3, //3->youtube
          nameType: 'youtube',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
      case 'subir-image-foros':
        this.filesUrl.push({
          type: 4, //4->image
          nameType: 'youtube',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'obtenerForoxiForoId':
        const data = item.length ? item[0] : [];
        this.foroForm.patchValue({
          cForoTitulo: data.cForoTitulo ?? '',
          cForoDescripcion: data.cForoDescripcion ?? '',
          dtForoInicio: data.dtForoInicio ? new Date(data.dtForoInicio) : this.date,
          dtForoFin: data.dtForoFin ? new Date(data.dtForoFin) : this.date,
          iForoId: data.iForoId,
          iForoCatId: data.iForoCatId,
        });
        this.filesUrl = data.cForoUrl ? JSON.parse(data.cForoUrl) : [];
        break;
    }
  }

  agregarForo(foro) {
    console.log(foro);
    this._ForosService
      .guardarForos(foro)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.closeModal(resp.validated);
            }, 1000);
          }
          this.isLoading = false;
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  actualizarForo(foro) {
    this._aulaService
      .actualizarForo(foro)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Genial!',
              detail: 'Se actualizó correctamente',
            });
            setTimeout(() => {
              this.closeModal(resp.validated);
            }, 1000);
          }
          this.isLoading = false;
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }
}
