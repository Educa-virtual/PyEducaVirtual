import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NuevaCategoriaComponent } from '../nueva-categoria/nueva-categoria.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ICategoria } from '../interfaces/categoria.interface';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { EncuestasService } from '../services/encuestas.services';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { Router } from '@angular/router';
import {
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  DIRECTOR_IE,
  SUBDIRECTOR_IE,
} from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-categorias-encuestas',
  standalone: true,
  imports: [PrimengModule, CommonModule, FormsModule, NuevaCategoriaComponent, NoDataComponent],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.scss',
})
export class CategoriasEncuestaComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  titleEncuestasPorCategoria: string = 'Categorías de encuestas';
  visibleDialogCategoria: boolean = false;
  iYAcadId: number;
  iCateId: number;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  categorias: ICategoria[] = [];
  categorias_filtradas: ICategoria[] = [];

  perfil: any;
  es_encuestador: boolean = false;
  encuestadores = [
    ADMINISTRADOR_DREMO,
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
    DIRECTOR_IE,
    SUBDIRECTOR_IE,
  ];
  crea_categorias = [ADMINISTRADOR_DREMO];
  puede_crear = false;
  USUARIO_ENCUESTADOR: number = this.encuestasService.USUARIO_ENCUESTADOR;
  USUARIO_ENCUESTADO: number = this.encuestasService.USUARIO_ENCUESTADO;

  constructor(
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationModalService,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_encuestador = this.encuestadores.includes(Number(this.perfil.iPerfilId));
    this.puede_crear = this.crea_categorias.includes(Number(this.perfil.iPerfilId));
    this.breadCrumbItems = [
      {
        label: 'Encuestas',
      },
      {
        label: 'Categorías',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias() {
    this.encuestasService
      .listarCategorias({
        iYAcadId: this.iYAcadId,
        iTipoUsuario: 2,
      })
      .subscribe({
        next: (data: any) => {
          this.categorias = data.data;
          this.categorias_filtradas = this.categorias;
          this.categorias.forEach(cat => {
            cat.btnItems = this.es_encuestador ? this.setBtnItems(cat) : [];
          });
        },
        error: error => {
          console.error('Error obteniendo categorias:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value;
    this.categorias_filtradas = this.categorias.filter(categoria => {
      if (
        categoria.cCateNombre &&
        categoria.cCateNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return categoria;
      if (categoria.iTotalEncuestas && categoria.iTotalEncuestas.toString().includes(filtro))
        return categoria;
      return null;
    });
  }

  rutaImagenPlaceholder(item) {
    if (!item?.cCateImagenUrl) {
      return 'cursos/images/no-image.jpg';
    }
    return item?.cCateImagenUrl;
  }

  agregarCategoria() {
    this.iCateId = null;
    this.visibleDialogCategoria = true;
  }

  editarCategoria(iCateId) {
    this.iCateId = null;
    setTimeout(() => {
      this.iCateId = iCateId;
      this.visibleDialogCategoria = true;
    }, 100);
  }

  borrarCategoria(categoria) {
    this.confirmationService.openConfirm({
      message: '¿Está seguro de eliminar la categoría seleccionada?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.encuestasService
          .borrarCategoria({
            iCateId: categoria.iCateId,
          })
          .subscribe({
            next: (respuesta: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminación exitosa',
                detail: respuesta.message,
              });
              this.listarCategorias();
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al eliminar categoría',
                detail: error.error.message,
              });
            },
          });
      },
    });
  }

  cerrarDialogCategoria() {
    this.visibleDialogCategoria = false;
    this.listarCategorias();
  }

  listarEncuestas(iCateId: any) {
    if (iCateId == null) {
      /* Es enlace a encuestas de bienestar */
      this.router.navigate([`/bienestar/gestionar-encuestas`]);
    } else {
      this.router.navigate([`/encuestas/categorias/${iCateId}/lista-encuestas`]);
    }
  }

  gestionarEncuestas(iCateId: any) {
    console.log(iCateId, 'gestion categoria');
    if (iCateId == null) {
      /* Es enlace a encuestas de bienestar */
      this.router.navigate([`/bienestar/gestionar-encuestas`]);
    } else {
      this.router.navigate([`/encuestas/categorias/${iCateId}/gestion-encuestas`]);
    }
  }

  setBtnItems(categoria: any): MenuItem[] {
    return [
      {
        label: 'Gestionar encuestas',
        icon: 'pi pi-cog',
        command: () => this.gestionarEncuestas(categoria?.iCateId),
      },
      {
        label: 'Editar Categoría',
        icon: 'pi pi-pencil',
        command: () => this.editarCategoria(categoria?.iCateId),
        visible: !+categoria?.bEsFija && this.puede_crear,
      },
      {
        label: 'Borrar Categoría',
        icon: 'pi pi-trash',
        command: () => this.borrarCategoria(categoria?.iCateId),
        visible: Boolean(+categoria?.puede_crear) && this.puede_crear,
        disabled: !+categoria?.bEsFija || categoria?.iTotalEncuestas > 0,
      },
    ];
  }
}
