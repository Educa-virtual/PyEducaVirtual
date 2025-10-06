import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, signal, OnInit, inject } from '@angular/core';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { PrimengModule } from '@/app/primeng.module';
import { FormCarpetaComponent } from './form-carpeta/form-carpeta.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { CarpetasService } from '@/app/servicios/repo/carpetas.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { finalize } from 'rxjs';
import { ArchivosService } from '@/app/servicios/repo/archivos.service';

interface Columna {
  field?: string;
  header: string;
  type: 'item' | 'text' | 'date' | 'actions';
  text?: 'left' | 'center' | 'right';
  text_header?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

@Component({
  selector: 'app-mi-repositorio',
  standalone: true,
  imports: [ToolbarPrimengComponent, AulaBancoPreguntasModule, PrimengModule, FormCarpetaComponent],
  templateUrl: './mi-repositorio.component.html',
  styleUrl: './mi-repositorio.component.scss',
})
export class MiRepositorioComponent extends MostrarErrorComponent implements OnInit {
  showModal = signal(false);
  repositorio = signal<any[]>([]);
  selectedRow = signal<any | null>(null);

  columnas = signal<Columna[]>([
    { header: '#', type: 'item', text: 'center', text_header: 'center' },
    {
      field: 'cNombreLabel',
      header: 'Nombre del Archivo',
      type: 'text',
      text: 'left',
      text_header: 'left',
      sortable: true,
    },
    {
      field: 'dtCreado',
      header: 'Fecha Subida',
      type: 'date',
      text: 'center',
      text_header: 'center',
      sortable: true,
    },
    {
      field: 'cTipo',
      header: 'Tipo',
      type: 'text',
      text: 'center',
      text_header: 'center',
      sortable: true,
    },
    {
      field: 'cTamano',
      header: 'Peso',
      type: 'text',
      text: 'center',
      text_header: 'center',
      sortable: true,
    },
    {
      field: '',
      header: 'Acción',
      type: 'actions',
      text: 'center',
      text_header: 'center',
      sortable: true,
    },
  ]);

  rutaCarpetas = signal<{ id: number | null; nombre: string }[]>([
    { id: null, nombre: 'Repositorio' },
  ]);

  items = [];

  private _ConstantesService = inject(ConstantesService);
  private _CarpetasService = inject(CarpetasService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  private _ArchivosService = inject(ArchivosService);

  ngOnInit(): void {
    this.obtenerCarpetas(this.selectedRow()?.iCarpetaId ?? null);
  }

  abrirMenu(event: Event, row: any, menu: any) {
    this.selectedRow.set(row);
    this.configurarMenuAcciones(row);
    menu.toggle(event);
  }

  configurarMenuAcciones(row: any) {
    if (row.cTipo === 'carpeta') {
      this.items = [
        {
          label: 'Entrar',
          icon: 'pi pi-sign-in',
          command: () => {
            this.entrarCarpeta(row);
          },
        },
        { label: 'Editar', icon: 'pi pi-pencil', command: () => this.showModal.set(true) },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => {
            this.eliminarCarpeta();
          },
        },
      ];
    } else {
      this.items = [
        {
          label: 'Descargar archivo',
          icon: 'pi pi-download',
          command: () => this.descargarArchivo(row),
        },
        {
          label: 'Eliminar archivo',
          icon: 'pi pi-trash',
          command: () => this.eliminarArchivo(row),
        },
      ];
    }
  }
  obtenerCarpetas(iCarpetaId) {
    const params = {
      iPersId: this._ConstantesService.iPersId,
      iCarpetaId: iCarpetaId ?? null,
      iCredId: this._ConstantesService.iCredId,
    };

    this._CarpetasService.obtenerCarpetas(params).subscribe({
      next: (resp: any) => {
        const data = (resp?.data ?? []).map((item: any) => {
          const ext = (item.cExtension ?? '').toLowerCase();

          if (item.cTipo === 'carpeta') {
            item.cIcono = '📁';
          } else {
            item.cTipo = ext;
            const iconMap: Record<string, string> = {
              pdf: '📄',
              doc: '📝',
              docx: '📝',
              mp4: '📹',
              jpg: '📷',
              jpeg: '📷',
              png: '📷',
              gif: '📷',
              zip: '🗜️',
              rar: '🗜️',
              xlsx: '📊',
              csv: '📊',
              txt: '📘',
            };

            item.cIcono = iconMap[ext] ?? '📦';
          }

          item.cNombreLabel = `${item.cIcono} ${item.cNombre}`;

          return item;
        });

        this.repositorio.set(data);
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  eliminarCarpeta(): void {
    this._ConfirmationModalService.openConfirm({
      header: '¿Esta seguro de eliminar la carpeta: ' + this.selectedRow().cNombre + ' ?',
      accept: () => {
        const params = {
          iCarpetaId: this.rutaCarpetas()[this.rutaCarpetas().length - 1].id, //this.selectedRow().iId,
          iCredId: this._ConstantesService.iCredId,
        };

        this._CarpetasService
          .eliminarCarpeta(params)
          .pipe(finalize(() => this.selectedRow.set(null)))
          .subscribe({
            next: (resp: any) => {
              if (resp.validated) {
                this.mostrarMensajeToast({
                  severity: 'success',
                  summary: 'Eliminado',
                  detail: resp.message,
                });
                this.obtenerCarpetas(this.selectedRow().iId);
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

  subirArchivo(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
      'xlsx',
      'xls',
      'ppt',
      'pptx',
      'txt',
      'csv',
      'jpg',
      'jpeg',
      'png',
      'gif',
      'mp4',
      'zip',
      'rar',
    ];

    const fileExtension = (file.name.split('.').pop() || '').toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Archivo no permitido',
        detail: `El tipo de archivo ".${fileExtension}" no está permitido.`,
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      this.mostrarMensajeToast({
        severity: 'warn',
        summary: 'Archivo demasiado grande',
        detail: 'El archivo no puede superar los 5 MB',
      });
      return;
    }

    const formData = new FormData();

    const iCarpetaId =
      this.rutaCarpetas().length > 0 ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id : 0;
    formData.append('iCarpetaId', iCarpetaId?.toString() ?? '0');
    formData.append('iPersId', this._ConstantesService.iPersId.toString());
    formData.append('iCredId', this._ConstantesService.iCredId.toString());
    formData.append('cNombre', file.name.split('.').slice(0, -1).join('.')); // sin extensión
    formData.append('cExtension', file.name.split('.').pop() || '');
    formData.append('iTamano', file.size.toString());
    formData.append('archivo', file); // el archivo en sí

    this._ArchivosService.guardarArchivo(formData).subscribe({
      next: (resp: any) => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: 'Archivo subido',
            detail: resp.message,
          });
          const carpetaActualId =
            this.rutaCarpetas().length > 0
              ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id
              : 0;

          this.obtenerCarpetas(carpetaActualId);
        }
      },
      error: err => this.mostrarErrores(err),
    });
  }

  resetearInput(input: HTMLInputElement) {
    input.value = '';
  }

  descargarArchivo(row: any) {
    const iArchivoId = row.iId;

    this._ArchivosService.descargarArchivo(iArchivoId).subscribe({
      next: (response: any) => {
        if (!response.validated) {
          this.mostrarErrores(response.message);
          return;
        }
        const byteCharacters = atob(response.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.mime });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: err => this.mostrarErrores(err),
    });
  }

  eliminarArchivo(row: any) {
    const iArchivoId = row.iId;
    this._ConfirmationModalService.openConfirm({
      header: `¿Está seguro de eliminar el archivo: ${row.cNombre}?`,
      accept: () => {
        const params = {
          iCredId: this._ConstantesService.iCredId,
        };

        this._ArchivosService
          .eliminarArchivo(iArchivoId, params)
          .pipe(finalize(() => this.selectedRow.set(null)))
          .subscribe({
            next: (resp: any) => {
              if (resp.validated) {
                this.mostrarMensajeToast({
                  severity: 'success',
                  summary: 'Archivo eliminado',
                  detail: resp.message,
                });
                const carpetaActualId =
                  this.rutaCarpetas().length > 0
                    ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id
                    : 0;

                this.obtenerCarpetas(carpetaActualId);
              }
            },
            error: error => this.mostrarErrores(error),
          });
      },
      reject: () =>
        this.mostrarMensajeToast({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        }),
    });
  }

  entrarCarpeta(row: any) {
    const iCarpetaId = row.iId;
    const nombre = row.cNombre.replace('📁', '').trim();

    const nuevaRuta = [...this.rutaCarpetas()];
    nuevaRuta.push({ id: iCarpetaId, nombre });
    this.rutaCarpetas.set(nuevaRuta);

    const carpetaActualId =
      this.rutaCarpetas().length > 0 ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id : 0;

    this.obtenerCarpetas(carpetaActualId);
  }

  irACarpeta(id: number | null) {
    const nuevaRuta = [];
    for (const item of this.rutaCarpetas()) {
      nuevaRuta.push(item);
      if (item.id === id) break;
    }
    this.rutaCarpetas.set(nuevaRuta);

    this.obtenerCarpetas(id);
  }
}
