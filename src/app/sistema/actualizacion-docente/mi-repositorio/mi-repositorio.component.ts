import { Component, signal, OnInit } from '@angular/core';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { PrimengModule } from '@/app/primeng.module';
import { FormCarpetaComponent } from './form-carpeta/form-carpeta.component';
import { CarpetasService } from '@/app/servicios/repo/carpetas.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { finalize } from 'rxjs';
import { ArchivosService } from '@/app/servicios/repo/archivos.service';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mi-repositorio',
  standalone: true,
  imports: [AulaBancoPreguntasModule, PrimengModule, FormCarpetaComponent],
  templateUrl: './mi-repositorio.component.html',
  styleUrl: './mi-repositorio.component.scss',
})
export class MiRepositorioComponent implements OnInit {
  showModal = signal(false);
  repositorio = signal<any[]>([]);
  selectedRow = signal<any | null>(null);

  columnas: IColumn[] = [
    {
      field: 'cNombreLabel',
      header: 'Nombre',
      type: 'text',
      text: 'left',
      text_header: 'left',
      width: '50%',
    },
    {
      field: 'dtUltimaModificacion',
      header: 'Última modificación',
      type: 'datetime',
      text: 'left',
      text_header: 'left',
      width: '20%',
    },
    {
      field: 'cExtension',
      header: 'Tipo',
      type: 'text',
      text: 'center',
      text_header: 'center',
      width: '10%',
    },
    {
      field: 'iTamano',
      header: 'Peso',
      type: 'text',
      text: 'center',
      text_header: 'center',
      width: '15%',
    },
    {
      field: '',
      header: 'Acciones',
      type: 'actions',
      text: 'center',
      text_header: 'center',
      width: '5%',
    },
  ];

  rutaCarpetas = signal<{ id: number | null; nombre: string }[]>([
    { id: null, nombre: 'Repositorio' },
  ]);

  items = [];
  perfil: any;

  constructor(
    private _CarpetasService: CarpetasService,
    private _ArchivosService: ArchivosService,
    private _ConfirmationModalService: ConfirmationModalService,
    private store: LocalStoreService,
    private messageService: MessageService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit(): void {
    this.listarCarpetas(this.selectedRow()?.iCarpetaId ?? null);
  }

  abrirMenu(event: Event, row: any, menu: any) {
    this.selectedRow.set(row);
    this.configurarMenuAcciones(row);
    menu.toggle(event);
  }

  editarCarpeta() {
    this.showModal.set(true);
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
        { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editarCarpeta() },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => {
            this.eliminarCarpeta(row);
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
  listarCarpetas(iCarpetaId) {
    this._CarpetasService
      .listarCarpetas({
        iCarpetaId: iCarpetaId ?? null,
      })
      .subscribe({
        next: (resp: any) => {
          const data = (resp?.data ?? []).map((item: any) => {
            item.iTamano = this._CarpetasService.formatearTamanio(item.iTamano);
            const ext = (item.cExtension ?? '').toUpperCase();

            if (item.cTipo === 'carpeta') {
              item.cIcono = '📁';
            } else {
              item.cExtension = ext;
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error desconocido',
          });
        },
      });
  }

  eliminarCarpeta(row): void {
    this._ConfirmationModalService.openConfirm({
      header: 'Confirmación',
      message: '¿Está seguro de eliminar la carpeta: ' + row.cNombre + ' ?',
      accept: () => {
        this._CarpetasService
          .eliminarCarpeta({
            iCarpetaId: row.iRegistroId,
          })
          .pipe(finalize(() => this.selectedRow.set(null)))
          .subscribe({
            next: (data: any) => {
              if (data.data) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminado',
                  detail: 'Datos eliminados con éxito',
                });
                this.listarCarpetas(this.rutaCarpetas()[this.rutaCarpetas().length - 1].id);
              }
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message || 'Error desconocido',
              });
            },
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
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo no permitido',
        detail: `El tipo de archivo ".${fileExtension}" no está permitido.`,
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      this.messageService.add({
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
    formData.append('iPersId', this.perfil.iPersId);
    formData.append('cNombre', file.name.split('.').slice(0, -1).join('.')); // sin extensión
    formData.append('cExtension', file.name.split('.').pop() || '');
    formData.append('iTamano', file.size.toString());
    formData.append('archivo', file); // el archivo en sí

    this._ArchivosService.guardarArchivo(formData).subscribe({
      next: (data: any) => {
        if (data.data) {
          this.messageService.add({
            severity: 'success',
            summary: 'Archivo subido',
            detail: 'Archivo subido con éxito',
          });
          const carpetaActualId =
            this.rutaCarpetas().length > 0
              ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id
              : 0;

          this.listarCarpetas(carpetaActualId);
        }
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error desconocido',
        });
      },
    });
  }

  resetearInput(input: HTMLInputElement) {
    input.value = '';
  }

  private descargarBase64ComoArchivo(base64: string, mimeType: string, nombreArchivo: string) {
    // El backend devuelve el archivo en base64, por eso primero lo decodificamos a bytes.
    const base64Limpio = (base64 || '').replace(/\s/g, '');
    const base64SinPrefijo = base64Limpio.includes(',') ? base64Limpio.split(',')[1] : base64Limpio;
    const bytes = Uint8Array.from(atob(base64SinPrefijo), char => char.charCodeAt(0));

    const blob = new Blob([bytes], { type: mimeType || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = nombreArchivo || 'archivo-descargado';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  descargarArchivo(row: any) {
    this._ArchivosService
      .descargarArchivo({
        iArchivoId: row.iRegistroId,
      })
      .subscribe({
        next: (data: any) => {
          const base64 = data?.base64 || data?.data?.base64;

          if (!base64) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data?.message || 'No se recibió el archivo para descargar',
            });
            return;
          }

          const nombreArchivo =
            data?.nombre ||
            `${row.cNombre || 'archivo'}${row.cExtension ? `.${row.cExtension}` : ''}`;
          this.descargarBase64ComoArchivo(
            base64,
            data?.mime || 'application/octet-stream',
            nombreArchivo
          );
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error desconocido',
          });
        },
      });
  }

  eliminarArchivo(row: any) {
    const iArchivoId = row.iRegistroId;
    this._ConfirmationModalService.openConfirm({
      header: 'Confirmación',
      message: `¿Está seguro de eliminar el archivo: ${row.cNombre}?`,
      accept: () => {
        this._ArchivosService
          .eliminarArchivo({
            iArchivoId: iArchivoId,
          })
          .pipe(finalize(() => this.selectedRow.set(null)))
          .subscribe({
            next: (data: any) => {
              if (data.data) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Archivo eliminado',
                  detail: 'Archivo eliminado con éxito',
                });
                const carpetaActualId =
                  this.rutaCarpetas().length > 0
                    ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id
                    : 0;

                this.listarCarpetas(carpetaActualId);
              }
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message || 'Error desconocido',
              });
            },
          });
      },
    });
  }

  entrarCarpeta(row: any) {
    const iCarpetaId = row.iRegistroId;
    const nombre = row.cNombre.replace('📁', '').trim();

    const nuevaRuta = [...this.rutaCarpetas()];
    nuevaRuta.push({ id: iCarpetaId, nombre });
    this.rutaCarpetas.set(nuevaRuta);

    const carpetaActualId =
      this.rutaCarpetas().length > 0 ? this.rutaCarpetas()[this.rutaCarpetas().length - 1].id : 0;

    this.listarCarpetas(carpetaActualId);
  }

  irACarpeta(id: number | null) {
    const nuevaRuta = [];
    for (const item of this.rutaCarpetas()) {
      nuevaRuta.push(item);
      if (item.id === id) break;
    }
    this.rutaCarpetas.set(nuevaRuta);

    this.listarCarpetas(id);
  }

  verificarTipo(row, columna, $event, menu) {
    if (row.cTipo === 'carpeta' && columna !== '') {
      this.entrarCarpeta(row);
    }
    if (row.cTipo === 'archivo') {
      this.abrirMenu($event, row, menu);
    }
  }
}
