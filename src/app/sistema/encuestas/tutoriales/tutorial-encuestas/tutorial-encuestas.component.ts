import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ADMINISTRADOR_DREMO, DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tutorial-encuestas',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tutorial-encuestas.component.html',
  styleUrl: './tutorial-encuestas.component.scss',
})
export class TutorialEncuestasComponent implements OnInit {
  @Output() visibleDialogTutorial: EventEmitter<boolean> = new EventEmitter();
  active: number = 0;

  perfil: any;
  es_administrador: boolean = false;
  es_director: boolean = false;

  acciones: MenuItem[];

  constructor(private store: LocalStoreService) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_administrador = [ADMINISTRADOR_DREMO].includes(Number(this.perfil.iPerfilId));
    this.es_director = [DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    this.acciones = [
      {
        id: 'editar',
        label: 'Editar / Ver',
        icon: 'pi pi-file-edit',
      },
      {
        id: 'editar',
        label: 'Ver Preguntas',
        icon: 'pi pi-question',
      },
      {
        id: 'editar',
        label: 'Aprobar',
        icon: 'pi pi-check',
      },
      {
        id: 'editar',
        label: 'Eliminar',
        icon: 'pi pi-trash',
      },
      {
        id: 'respuestas',
        label: 'Ver respuestas',
        icon: 'pi pi-users',
      },
      {
        id: 'respuestas',
        label: 'Ver resumen',
        icon: 'pi pi-chart-pie',
      },
      {
        id: 'reemplazar',
        label: 'Reemplazar',
        icon: 'pi pi-sync',
        visible: this.es_director,
      },
      {
        id: 'adicionales',
        label: 'Duplicar',
        icon: 'pi pi-copy',
      },
      {
        id: 'adicionales',
        label: 'Hacer plantilla',
        icon: 'pi pi-arrow-up',
      },
    ];
  }

  listarAcciones(opcion_id: string | null) {
    return this.acciones.map((opcion: MenuItem) => {
      if (opcion.id === opcion_id || opcion_id === null) {
        opcion.visible = true;
      } else {
        opcion.visible = false;
      }
      return opcion;
    });
  }

  salir() {
    this.visibleDialogTutorial.emit(false);
  }
}
