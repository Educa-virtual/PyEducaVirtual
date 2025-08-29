import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { IActionContainer } from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service';
import { PrimengModule } from '@/app/primeng.module';
import { FichaFamiliaRegistroComponent } from './ficha-familia-registro/ficha-familia-registro.component';
import { CompartirFichaService } from '../../services/compartir-ficha.service';

@Component({
  selector: 'app-ficha-familia',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, FichaFamiliaRegistroComponent],
  templateUrl: './ficha-familia.component.html',
  styleUrl: './ficha-familia.component.scss',
})
export class FichaFamiliaComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  @ViewChild('fichaFamiliaRegistroRef')
  fichaFamiliaRegistro: FichaFamiliaRegistroComponent;
  iFichaDGId: string | null = null;
  familiares: Array<object>;
  familiares_filtrados: Array<object>;
  visibleDialogFamiliar: boolean = false;
  dialogTitle: string = '';
  iFamiliarId: string | null = null;

  private _messageService = inject(MessageService); // dialog Mensaje simple
  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datosFichaBienestar: DatosFichaBienestarService,
    private compartirFicha: CompartirFichaService
  ) {
    this.compartirFicha.setActiveIndex(1);
    this.route.parent?.paramMap.subscribe(params => {
      this.iFichaDGId = params.get('id');
    });
    if (!this.iFichaDGId) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (this.iFichaDGId) {
      this.listarFamiliares();
    }
  }

  hideDialog() {
    this.iFamiliarId = null;
    this.fichaFamiliaRegistro.salirResetearForm();
  }

  visibleDialog(event: any) {
    this.visibleDialogFamiliar = event.value || false;
    this.iFamiliarId = null;
    this.listarFamiliares();
  }

  agregarFamiliar() {
    this.visibleDialogFamiliar = true;
    this.iFamiliarId = null;
    this.dialogTitle = 'Registrar familiar';
  }

  listarFamiliares() {
    this.datosFichaBienestar
      .listarFamiliares({
        iFichaDGId: this.iFichaDGId,
      })
      .subscribe({
        next: (data: any) => {
          this.familiares = data.data;
          this.filtrarTabla();
        },
        error: error => {
          console.error('Error al obtener familiares:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al obtener datos',
          });
        },
        complete: () => {},
      });
  }

  /**
   * Eliminar familiar seleccionado
   * @param item datos del familiar seleccionado
   */
  borrarFamiliar(item: any) {
    this.datosFichaBienestar
      .borrarFamiliar({
        iFamiliarId: item.iFamiliarId,
      })
      .subscribe({
        next: () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se eliminó exitosamente',
          });
          this.familiares = this.familiares.filter(
            (familiar: any) => Number(familiar.iFamiliarId) != Number(item.iFamiliarId)
          );
          this.familiares_filtrados = this.familiares;
        },
        error: error => {
          console.error('Error eliminando familiar:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al quitar familiar',
          });
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value.toLowerCase();
    this.familiares_filtrados = this.familiares.filter((familiar: any) => {
      if (
        familiar.cTipoFamiliarDescripcion &&
        familiar.cTipoFamiliarDescripcion.toLowerCase().includes(filtro)
      )
        return familiar;
      if (familiar.cTipoIdentSigla && familiar.cTipoIdentSigla.toLowerCase().includes(filtro))
        return familiar;
      if (familiar.cPersDocumento && familiar.cPersDocumento.toLowerCase().includes(filtro))
        return familiar;
      if (
        familiar.cPersNombresApellidos &&
        familiar.cPersNombresApellidos.toLowerCase().includes(filtro)
      )
        return familiar;
      return null;
    });
  }

  continuar() {
    this.router.navigate([`/bienestar/ficha/${this.iFichaDGId}/economico`]);
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'editar') {
      this.iFamiliarId = item.iFamiliarId;
      this.dialogTitle = 'Editar familiar';
      this.visibleDialogFamiliar = true;
    }
    if (accion === 'anular') {
      this._confirmService.openConfirm({
        message: '¿Está seguro de anular la relación familiar seleccionada?',
        header: 'Anular relación familiar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.borrarFamiliar(item);
        },
      });
    }
  }

  accionBtnItem(accion) {
    switch (accion) {
      case 'agregar':
        this.visibleDialogFamiliar = true;
        break;
    }
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Registrar familiar',
      text: 'Registrar familiar',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
  ];

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Anular',
      icon: 'pi pi-trash',
      accion: 'anular',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];

  actionsLista: IActionTable[];

  columns = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '',
      text_header: 'left',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cTipoFamiliarDescripcion',
      header: 'Relación',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTipoIdentSigla',
      header: 'Tipo de Doc.',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cPersDocumento',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cPersNombresApellidos',
      header: 'Nombres',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
