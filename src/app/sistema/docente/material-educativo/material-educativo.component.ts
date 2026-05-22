import { PrimengModule } from '@/app/primeng.module';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormMaterialEducativoComponent } from './components/form-material-educativo/form-material-educativo.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { MaterialEducativoService } from './service/material-educativo.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-material-educativo',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, FormMaterialEducativoComponent],
  templateUrl: './material-educativo.component.html',
  styleUrl: './material-educativo.component.scss',
})
export class MaterialEducativoComponent implements OnInit {
  private _ConstantesService = inject(ConstantesService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  private materialEducativoService = inject(MaterialEducativoService);

  local: any;
  year: any;
  @Input() idDocCursoId: string;
  @Input() cCursoNombre: string;
  @Input() iCursosNivelGradId: string;
  @Input() cGradoAbreviacion: string;
  @Input() cSeccionNombre: string;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.obtenerMaterialEducativoDocentes();
    this.local = JSON.parse(localStorage.getItem('dremoPerfil'));
    this.year = JSON.parse(localStorage.getItem('dremoYear'));
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
        this.item = { ...item };
        this.titulo =
          accion === 'agregar' ? 'AGREGAR MATERIAL EDUCATIVO' : 'ACTUALIZAR MATERIAL EDUCATIVO';
        this.opcion = accion === 'agregar' ? 'GUARDAR' : 'ACTUALIZAR';
        break;
      case 'eliminar':
        this._ConfirmationModalService.openConfirm({
          header:
            '¿Esta seguro de eliminar el material educativo ' + item['cMatEducativoTitulo'] + ' ?',
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
    const datos = {
      iDocenteId: this._ConstantesService.iDocenteId,
      iCursosNivelGradId: this.iCursosNivelGradId,
    };

    this.materialEducativoService.obtenerMaterialEducativo(datos).subscribe({
      next: (response: any) => {
        const datos = response.data;
        this.data = datos;
        this.data.forEach(i => {
          i.cMatEducativoUrl = JSON.parse(i.cMatEducativoUrl) ?? [];
        });
      },
    });
  }

  GuardarActualizarMaterialEducativoDocentes(item) {
    const enviar = new FormData();
    enviar.append('iMatEducativoId', item.iMatEducativoId ?? null);
    enviar.append('iDocenteId', this._ConstantesService.iDocenteId);
    enviar.append('idDocCursoId', this.idDocCursoId);
    enviar.append('iCredEntPerfId', this.local.iCredEntPerfId);
    enviar.append('iCursosNivelGradId', this.iCursosNivelGradId);
    enviar.append('cMatEducativoTitulo', item.cMatEducativoTitulo);
    enviar.append('cMatEducativoDescripcion', item.cMatEducativoDescripcion);
    enviar.append('cIieeCodigoModular', this.local.iCredEntPerfId);
    enviar.append('iSedeId', this.local.iSedeId);
    enviar.append('iPersId', this.local.iPersId);
    enviar.append('year', this.year);

    if (item.cMatEducativoUrl) {
      item.cMatEducativoUrl.forEach((file, index) => {
        if (!file.exportar) {
          enviar.append(`cMatEducativoUrl[${index}]`, JSON.stringify(file));
        } else {
          enviar.append(`cMatEducativoUrl[${index}]`, file.exportar);
        }
      });
    }

    this.materialEducativoService.guardarMaterialEducativo(enviar).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Existo',
          detail: 'Se ha guardado el material educativo',
        });
      },
      error: respuesta => {
        const error = respuesta.error.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
      complete: () => {
        this.obtenerMaterialEducativoDocentes();
      },
    });
  }

  eliminarMaterialEducativoDocentes(item) {
    this.materialEducativoService.eliminarMaterialEducativo(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Existo',
          detail: 'Se ha eliminado el registro',
        });
      },
      error: respuesta => {
        const error = respuesta.error.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
      complete: () => {
        this.obtenerMaterialEducativoDocentes();
      },
    });
  }
}
