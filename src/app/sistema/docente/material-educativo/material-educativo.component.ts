import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormMaterialEducativoComponent } from './components/form-material-educativo/form-material-educativo.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-material-educativo',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, FormMaterialEducativoComponent],
  templateUrl: './material-educativo.component.html',
  styleUrl: './material-educativo.component.scss',
})
export class MaterialEducativoComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _ConfirmationModalService = inject(ConfirmationModalService);

  @Input() idDocCursoId: string;
  @Input() cCursoNombre: string;

  ngOnInit() {
    this.obtenerMaterialEducativoDocentes();
  }
  mensaje: Message[] = [
    {
      severity: 'info',
      detail: 'En esta sección podrá visualizar sus materiales educativos',
    },
  ];

  showModal: boolean = false;

  actions = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'actualizar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];
  data = [];
  item = [];
  titulo: string = '';
  opcion: string = '';

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'cItem',
      header: 'Nº',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '7rem',
      field: 'cMatEducativoTitulo',
      header: 'Título Material Educativo',
      text_header: 'left',
      text: 'justify',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cMatEducativoDescripcion',
      header: 'Descripción',
      text_header: 'left',
      text: 'justify',
    },
    {
      type: 'list_json_file',
      width: '3rem',
      field: 'cMatEducativoUrl',
      header: 'Archivos / Url',
      text_header: 'left',
      text: 'justify',
    },
    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'close-modal':
        this.showModal = false;
        break;
      case 'agregar':
      case 'actualizar':
        this.showModal = true;
        this.item = item;
        this.titulo =
          accion === 'agregar' ? 'AGREGAR MATERIAL EDUCATIVO' : 'ACTUALIZAR MATERIAL EDUCATIVO';
        this.opcion = accion === 'agregar' ? 'GUARDAR' : 'ACTUALIZAR';
        break;
      case 'eliminar':
        this._ConfirmationModalService.openConfirm({
          header: '¿Esta seguro de eliminar el material educativo ' + item['cMatEduTitulo'] + ' ?',
          accept: () => {
            this.eliminarMaterialEducativoDocentes(item);
          },
        });
        break;
      case 'GUARDAR':
      case 'ACTUALIZAR':
        this.showModal = false;
        this.GuardarActualizarMaterialEducativoDocentes(item);
        break;
      case 'store-material-educativos':
      case 'update-material-educativos':
        this.obtenerMaterialEducativoDocentes();
        break;
      case 'list-material-educativos':
        this.data = item;
        this.data.forEach(i => {
          i.cMatEducativoUrl = i.cMatEducativoUrl ? JSON.parse(i.cMatEducativoUrl) : [];
        });
        break;
      case 'delete-material-educativos':
        this.obtenerMaterialEducativoDocentes();
        break;
    }
  }
  obtenerMaterialEducativoDocentes() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'material-educativos',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiDocenteIdxidDocCursoId',
        iDocenteId: this._ConstantesService.iDocenteId,
        //iCursosNivelGradId:iCursosNivelGradId,
        valorBusqueda: this.idDocCursoId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }
  GuardarActualizarMaterialEducativoDocentes(item) {
    item.iDocenteId = this._ConstantesService.iDocenteId;
    item.valorBusqueda = this.idDocCursoId;
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'material-educativos',
      ruta: item.opcion === 'GUARDAR' ? 'store' : 'update',
      data: item,
      // params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }

  eliminarMaterialEducativoDocentes(item) {
    item.opcion = 'ELIMINARxiMatEduDocId';
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'material-educativos',
      ruta: 'delete',
      data: item,
      // params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }

  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtnItem({ accion, item: response?.data });
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
}
