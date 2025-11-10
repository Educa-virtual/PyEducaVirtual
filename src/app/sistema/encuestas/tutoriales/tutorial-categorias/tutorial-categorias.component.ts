import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  ADMINISTRADOR_DREMO,
  DIRECTOR_IE,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
} from '@/app/servicios/seg/perfiles';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tutorial-categorias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tutorial-categorias.component.html',
  styleUrl: './tutorial-categorias.component.scss',
})
export class TutorialCategoriasComponent implements OnInit {
  @Output() visibleDialogTutorial: EventEmitter<boolean> = new EventEmitter();
  active: number = 0;

  perfil: any;
  es_encuestador: boolean = false;
  es_administrador: boolean = false;

  opciones: MenuItem[];

  constructor(private store: LocalStoreService) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_administrador = [ADMINISTRADOR_DREMO].includes(Number(this.perfil.iPerfilId));
    this.es_encuestador = [
      ADMINISTRADOR_DREMO,
      ESPECIALISTA_DREMO,
      ESPECIALISTA_UGEL,
      DIRECTOR_IE,
    ].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    this.opciones = [
      {
        id: 'encuestas',
        label: 'Gestionar encuestas',
        icon: 'pi pi-cog',
      },
      {
        id: 'plantillas',
        label: 'Gestionar plantillas',
        icon: 'pi pi-file-plus',
      },
      {
        id: 'editar',
        label: 'Editar categoría',
        icon: 'pi pi-pencil',
        visible: this.es_administrador,
      },
      {
        id: 'editar',
        label: 'Borrar categoría',
        icon: 'pi pi-trash',
        visible: this.es_administrador,
      },
    ];
  }

  listarOpciones(opcion_id: string) {
    return this.opciones.map((opcion: MenuItem) => {
      if (opcion.id === opcion_id) {
        opcion.styleClass = 'bg-black-alpha-10';
        opcion.disabled = false;
      } else {
        opcion.styleClass = null;
        opcion.disabled = true;
      }
      return opcion;
    });
  }

  salir() {
    this.visibleDialogTutorial.emit(false);
  }
}
