import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ADMINISTRADOR_DREMO, DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EncuestasService } from '../../services/encuestas.services';

@Component({
  selector: 'app-tutorial-preguntas',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './tutorial-preguntas.component.html',
  styleUrl: './tutorial-preguntas.component.scss',
})
export class TutorialPreguntasComponent implements OnInit {
  @Output() visibleDialogTutorial: EventEmitter<boolean> = new EventEmitter();
  active: number = 0;

  perfil: any;
  es_administrador: boolean = false;
  es_director: boolean = false;

  acciones: MenuItem[];

  tipos_reportes_plantillas: Array<object>;

  constructor(
    private store: LocalStoreService,
    private encuestasService: EncuestasService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_administrador = [ADMINISTRADOR_DREMO].includes(Number(this.perfil.iPerfilId));
    this.es_director = [DIRECTOR_IE].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    this.tipos_reportes_plantillas = this.encuestasService.getTiposReportesPlantillas();

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
        id: 'archivar',
        label: 'Archivar',
        icon: 'pi pi-folder',
      },
      {
        id: 'desarchivar',
        label: 'Desarchivar',
        icon: 'pi pi-folder-open',
      },
      {
        id: 'adicionales',
        label: 'Duplicar',
        icon: 'pi pi-copy',
      },
      {
        id: 'adicionales',
        label: 'Hacer encuesta',
        icon: 'pi pi-arrow-right',
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
