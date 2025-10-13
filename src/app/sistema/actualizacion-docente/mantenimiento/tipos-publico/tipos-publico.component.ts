import { PrimengModule } from '@/app/primeng.module';
import { TipoPublicosService } from '@/app/servicios/cap/tipo-publicos.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormTipoPublicoComponent } from './form-tipo-publico/form-tipo-publico.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ConstantesService } from '@/app/servicios/constantes.service';

@Component({
  selector: 'app-tipos-publico',
  standalone: true,
  imports: [
    PrimengModule,
    ToolbarPrimengComponent,
    TablePrimengComponent,
    FormTipoPublicoComponent,
  ],
  templateUrl: './tipos-publico.component.html',
  styleUrl: './tipos-publico.component.scss',
})
export class TiposPublicoComponent extends MostrarErrorComponent implements OnInit {
  private _TipoPublicosService = inject(TipoPublicosService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  private _ConstantesService = inject(ConstantesService);

  data = signal<any[]>([]);
  showModal = signal<boolean>(false);
  columnasTabla = signal<any[]>([
    {
      type: 'item',
      width: '1rem',
      field: 'index',
      header: 'Nro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cTipoPubNombre',
      header: 'Nombre del tipo de público',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '1rem',
      field: '',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ]);
  accionesTabla = signal<any[]>([
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-succes p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ]);

  public btnAccion = signal<any[]>([
    {
      label: 'Nuevo tipo de público',
      icon: 'pi pi-plus',
      class: 'p-button-primary',
      action: () => this.showModal.set(true),
    },
  ]);

  ngOnInit(): void {
    this.obtenerTipoPublicos();
  }

  obtenerTipoPublicos(recargar = false) {
    this._TipoPublicosService.obtenerTipoPublicos(recargar).subscribe({
      next: resp => {
        this.data.set(resp.data);
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  dataItem = signal<any>(null);
  accionBnt({ accion, item }: { accion: string; item?: any }): void {
    switch (accion) {
      case 'editar':
        this.showModal.set(true);
        this.dataItem.set(item);
        break;
      case 'eliminar':
        this._ConfirmationModalService.openConfirm({
          header: '¿Está seguro de eliminar el tipo de público: ' + item.cTipoPubNombre + ' ?',
          accept: () => {
            item.iCredId = this._ConstantesService.iCredId;
            this._TipoPublicosService.eliminarTipoPublico(item).subscribe({
              next: (resp: any) => {
                if (resp.validated) {
                  this.mostrarMensajeToast({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: resp.message,
                  });
                  this.obtenerTipoPublicos(true);
                }
              },
              error: error => {
                this.mostrarErrores(error);
              },
            });
          },
          reject: () => {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Cancelado',
              detail: 'Acción cancelada',
            });
          },
        });

        break;
    }
  }
}
