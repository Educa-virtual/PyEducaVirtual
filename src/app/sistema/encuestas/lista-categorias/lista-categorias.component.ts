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
  mostrarDialogNuevaCategoria: boolean = false;
  iYAcadId: number;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  categorias: ICategoria[] = [];
  categoriasInicial: ICategoria[] = [];

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
        next: (respuesta: any) => {
          this.categoriasInicial = respuesta.data.map((categoria: ICategoria) => ({
            ...categoria,
          }));
          this.categorias = this.categoriasInicial;
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value;
    this.categorias = this.categoriasInicial.filter(categoria => {
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

  updateUrl(item) {
    item.cImagenUrl = 'cursos/images/no-image.jpg';
  }

  // Métodos para el dialog Nueva Categoría
  abrirDialogNuevaCategoria() {
    this.mostrarDialogNuevaCategoria = true;
  }

  cerrarDialogNuevaCategoria() {
    this.mostrarDialogNuevaCategoria = false;
  }

  cancelarCreacionCategoria() {
    this.cerrarDialogNuevaCategoria();
  }

  // Mantiene compatibilidad con el componente NuevaCategoriaComponent
  onCategoriaCreada(nuevaCategoria: ICategoria) {
    this.categorias.push(nuevaCategoria);
  }
}
