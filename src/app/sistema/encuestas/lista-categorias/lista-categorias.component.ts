import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { StringCasePipe } from '@shared/pipes/string-case.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NuevaCategoriaComponent } from '../nueva-categoria/nueva-categoria.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ICategoria } from '../interfaces/categoria.interface';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { EncuestasService } from '../services/encuestas.services';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';

@Component({
  selector: 'app-categorias-encuestas',
  standalone: true,
  imports: [
    PrimengModule,
    CommonModule,
    StringCasePipe,
    FormsModule,
    NuevaCategoriaComponent,
    NoDataComponent,
  ],
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

  constructor(
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.breadCrumbItems = [
      {
        label: 'Evaluaciones',
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
      })
      .subscribe({
        next: (data: any) => {
          this.categorias = data.data;
          this.categorias_filtradas = this.categorias;
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
    if (!item?.cCateImagenNombre) {
      return 'cursos/images/no-image.jpg';
    }
    return item?.cCateImagenNombre;
  }

  agregarCategoria() {
    this.iCateId = null;
    this.visibleDialogCategoria = true;
  }

  editarCategoria(categoria) {
    this.iCateId = null;
    setTimeout(() => {
      this.iCateId = categoria.iCateId;
      this.visibleDialogCategoria = true;
    }, 100);
  }

  cerrarDialogCategoria() {
    this.visibleDialogCategoria = false;
    this.listarCategorias();
  }
}
