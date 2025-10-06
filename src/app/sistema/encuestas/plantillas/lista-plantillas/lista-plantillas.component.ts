import { PrimengModule } from '@/app/primeng.module';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncuestasService } from '../../services/encuestas.services';
import { MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

@Component({
  selector: 'app-lista-plantillas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './lista-plantillas.component.html',
  styleUrl: './lista-plantillas.component.scss',
})
export class ListaPlantillasComponent implements OnInit, OnChanges {
  @Input() iCateId: number;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() iPlanIdSeccionadoEvent = new EventEmitter<number>();
  @ViewChild('filtro') filtro: ElementRef;

  active: number = 0;

  perfil: any;
  iYAcadId: number;

  selectedItem: any;
  iPlanIdSeccionado: number;
  plantillas: any[] = [];
  plantillas_filtradas: any[] = [];

  plantilla: any;

  perfiles: Array<object>;
  distritos: Array<object>;
  nivel_tipos: Array<object>;
  nivel_grados: Array<object>;
  areas: Array<object>;
  secciones: Array<object>;
  zonas: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  instituciones_educativas: Array<object>;
  sexos: Array<object>;
  estados: Array<object>;
  ies: Array<object>;
  participantes: Array<object>;
  permisos: Array<object>;

  constructor(
    private route: ActivatedRoute,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit(): void {
    if (this.iCateId) {
      this.listarPlantillas();
    }

    this.encuestasService
      .crearEncuesta({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iCateId: this.iCateId,
      })
      .subscribe((data: any) => {
        this.perfiles = this.encuestasService.getPerfiles(data?.perfiles);
        this.distritos = this.encuestasService.getDistritos(data?.distritos);
        this.zonas = this.encuestasService.getZonas(data?.zonas);
        this.tipo_sectores = this.encuestasService.getTipoSectores(data?.tipo_sectores);
        this.ugeles = this.encuestasService.getUgeles(data?.ugeles);
        this.nivel_tipos = this.encuestasService.getNivelesTipos(data?.nivel_tipos);
        this.ies = this.encuestasService.getInstitucionesEducativas(data?.instituciones_educativas);
        this.distritos = this.encuestasService.getDistritos(data?.distritos);
        this.participantes = this.encuestasService.getParticipantes(data?.participantes);
        this.areas = this.encuestasService.getAreas(data?.areas);
        this.permisos = this.encuestasService.getPermisos(data?.permisos);
        this.sexos = this.encuestasService.getSexos();
        this.estados = this.encuestasService.getEstados();
        this.encuestasService.getNivelesGrados(data?.nivel_grados);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.iCateId && changes['visible']?.currentValue === true) {
      this.listarPlantillas();
    }
  }

  verPlantillas() {
    this.plantilla = null;
  }

  devolverPlantillaDesdeDetalle() {
    this.iPlanIdSeccionadoEvent.emit(this.iPlanIdSeccionado);
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  obtenerPlantillaDesdeTabla() {
    this.iPlanIdSeccionadoEvent.emit(this.selectedItem.iPlanId);
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  filtrarPlantillas() {
    const filtro = this.filtro.nativeElement.value;
    this.plantillas_filtradas = this.plantillas.filter(plantilla => {
      if (
        plantilla.cPlanNombre &&
        plantilla.cPlanNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return plantilla;
      if (
        plantilla?.dtUltimaModificacion &&
        plantilla.dtUltimaModificacion.toString().includes(filtro)
      )
        return null;
    });
  }

  listarPlantillas() {
    this.encuestasService
      .listarPlantillas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantillas = data.data;
          this.plantillas_filtradas = this.plantillas;
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  verPlantilla(iPlanId) {
    this.iPlanIdSeccionado = iPlanId;
    this.encuestasService
      .verPlantilla({
        iPlanId: iPlanId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.plantilla = data.data;
          this.plantilla.poblacion = this.formatearPoblacion(
            JSON.parse(this.plantilla.json_poblacion)
          );
          this.plantilla.accesos = this.formatearAccesos(JSON.parse(this.plantilla.json_accesos));
          this.plantilla.secciones = JSON.parse(this.plantilla.json_preguntas);
        },
        error: error => {
          console.error('Error obteniendo lista de plantillas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  formatearPoblacion(items: any) {
    const poblacion_formateada: Array<object> = [];
    items.forEach(item => {
      const nivel_tipo: any = this.nivel_tipos
        ? this.nivel_tipos.find((nivel: any) => nivel.value == item.iNivelTipoId)
        : null;
      const participante: any = this.participantes
        ? this.participantes.find((participante: any) => participante.value == item.iPerfilId)
        : null;
      const area: any = this.areas
        ? this.areas.find((area: any) => area.value == item.iCursoId)
        : null;
      const tipo_sector: any = this.tipo_sectores
        ? this.tipo_sectores.find((sector: any) => sector.value == item.iTipoSectorId)
        : null;
      const tipo_zona: any = this.zonas
        ? this.zonas.find((zona: any) => zona.value == item.iZonaId)
        : null;
      const ugel: any = this.ugeles
        ? this.ugeles.find((ugel: any) => ugel.value == item.iUgelId)
        : null;
      const distrito: any = this.distritos
        ? this.distritos.find((distrito: any) => distrito.value == item.iDsttId)
        : null;
      const ie: any = this.ies ? this.ies.find((ie: any) => ie.value == item.iIieeId) : null;
      const nivel_grado: any = this.nivel_grados
        ? this.nivel_grados.find((nivel: any) => nivel.value == item.iNivelGradoId)
        : null;
      const seccion: any = this.secciones
        ? this.secciones.find((seccion: any) => seccion.value == item.iSeccionId)
        : null;
      const sexo: any = this.sexos
        ? this.sexos.find((sexo: any) => sexo.value == item.cPersSexo)
        : null;

      let poblacion: any = [
        participante?.label,
        nivel_tipo?.label,
        tipo_sector?.label,
        tipo_zona?.label,
        ugel ? 'UGEL ' + ugel.label : null,
        distrito ? 'DISTRITO ' + distrito.label : null,
        ie?.label,
        nivel_grado?.label,
        area?.label,
        seccion ? 'SECCIÓN ' + seccion.label : null,
        sexo ? 'GENERO ' + sexo.label : null,
      ];
      poblacion = poblacion.filter((item: any) => item != null);
      console.log(poblacion);
      poblacion_formateada.push({
        poblacion: poblacion.join(', '),
      });
    });
    return poblacion_formateada;
  }

  formatearAccesos(items: any) {
    console.log(items);
    const accesos_formateados: Array<object> = [];
    items.forEach(item => {
      const perfil: any = this.perfiles.find((perfil: any) => perfil.value == item.iPerfilId);
      const permiso: any = this.permisos.find((permiso: any) => permiso.value == item.iPermId);
      accesos_formateados.push({
        cPerfilNombre: perfil ? perfil.label : '',
        cPermNombre: permiso ? permiso.label : '',
      });
    });
    return accesos_formateados;
  }

  onHide() {
    this.iCateId = null;
    this.iPlanIdSeccionado = null;
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'ver':
        this.verPlantilla(item.iPlanId);
        break;
    }
  }

  actions_plantillas: IActionTable[] = [
    {
      labelTooltip: 'Ver detalle',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  columns_plantillas = [
    {
      type: 'item',
      width: '5%',
      field: '',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '40%',
      field: 'cPlanNombre',
      header: 'Plantilla',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cCreador',
      header: 'Creador',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'date',
      width: '20%',
      field: 'dtUltimaModificacion',
      header: 'Modificado en',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '5%',
      field: '',
      header: 'Ver',
      text_header: 'right',
      text: 'right',
    },
  ];

  columns_poblacion = [
    {
      type: 'item',
      width: '10%',
      field: '',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '90%',
      field: 'poblacion',
      header: 'Población',
      text_header: 'left',
      text: 'left',
    },
  ];

  columns_accesos = [
    {
      type: 'item',
      width: '10%',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cPerfilNombre',
      header: 'Perfil',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '45%',
      field: 'cPermNombre',
      header: 'Permiso',
      text_header: 'left',
      text: 'left',
    },
  ];
}
