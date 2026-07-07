import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { AulaBancoPreguntasModule } from '../aula-banco-preguntas.module';
import {
  actionsContainer,
  actionsTable,
  columnasModalAgregarBancoPreguntas,
  columns,
} from './aula-banco-preguntas.model';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ApiAulaBancoPreguntasService } from '../../../services/api-aula-banco-preguntas.service';
import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component';
import { Subject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config';
import { DialogService } from 'primeng/dynamicdialog';
import { AulaBancoPreguntaFormContainerComponent } from './components/aula-banco-pregunta-form-container/aula-banco-pregunta-form-container.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ApiEvaluacionesRService } from '@/app/sistema/evaluaciones/services/api-evaluaciones-r.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ViewPreguntasComponent } from './components/view-preguntas/view-preguntas.component';

@Component({
  selector: 'app-aula-banco-preguntas',
  standalone: true,
  imports: [AulaBancoPreguntasModule, BancoPreguntaListaComponent, ViewPreguntasComponent],
  templateUrl: './aula-banco-preguntas.component.html',
  styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit, OnDestroy, OnChanges {
  @Output() public selectedRowDataChange = new EventEmitter();
  @Output() public actionBtnItem = new EventEmitter();

  @Input() public mode: 'SELECTION' | 'NORMAL' = 'NORMAL';
  @Input() iEvaluacionId: number;
  @Input({ required: true }) set iCursoId(value) {
    this.params.iCursoId = value;
    this.filtrarGrado();
  }

  private _iGradoId = 0;
  @Input() set iGradoId(valor: any) {
    this._iGradoId = valor;
    this.filtrarGrado();
  }

  public actionsTable = actionsTable;
  public actionsContainer = actionsContainer;
  public columnas = columns;
  public bancoPreguntas = [];
  public expandedRowKeys = {};
  public tipoPreguntas = [];

  private unsubscribe$: Subject<boolean> = new Subject();

  private _aulaBancoApiService = inject(ApiAulaBancoPreguntasService);
  private _dialogService = inject(DialogService);
  private _constantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);

  @Input() public params = {
    iCursoId: null,
    iDocenteId: null,
    iCurrContId: null,
    iNivelCicloId: null,
    busqueda: '',
    iTipoPregId: 0,
    iEvaluacionId: 0,
  };

  private _confirmService = inject(ConfirmationModalService);

  ngOnInit() {
    this.params.iEvaluacionId = this.iEvaluacionId;
    this.params.iDocenteId = this._constantesService.iDocenteId;
    this.params.iNivelCicloId = this._constantesService.iNivelCicloId;
    this.params.iCurrContId = this._constantesService.iCurrContId;
    this.getData();
    this.setupConfig();
  }

  setupConfig() {
    // console.log(this.mode)
    if (this.mode === 'SELECTION') {
      this.columnas = columnasModalAgregarBancoPreguntas;
      this.actionsTable = actionsTable;
    }
  }
  ngOnChanges(changes) {
    if (changes.mode?.currentValue) {
      this.mode = changes.mode.currentValue;
      this.setupConfig();
    }
  }

  filtrarCursos: any;
  filtrarGrado() {
    const cursoId = Number(this.params.iCursoId);
    const gradoId = Number(this._iGradoId);

    this.filtrarCursos = this.bancoPreguntas.filter(
      lista =>
        (cursoId === 0 || Number(lista.iCursoId) === cursoId) &&
        (gradoId === 0 || Number(lista.iGradoId) === gradoId)
    );
  }

  private getData() {
    this.obtenerTipoPreguntas();
    this.obtenerBancoPreguntas();
  }

  obtenerTipoPreguntas() {
    this._aulaBancoApiService
      .obtenerTipoPreguntas({ bancoTipo: 'aula' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.tipoPreguntas = [
            {
              iTipoPregId: 0,
              cTipoPregDescripcion: 'Todos',
            },
            ...data,
          ];
        },
      });
  }

  obtenerBancoPreguntas() {
    this._aulaBancoApiService.obtenerBancoPreguntas(this.params).subscribe({
      next: data => {
        this.bancoPreguntas = data.data;
        this.bancoPreguntas.forEach(pregunta => {
          if (pregunta.idEncabPregId) {
            pregunta.cNombre = pregunta.cEncabPregTitulo;
          } else {
            pregunta.cNombre = pregunta.cBancoPregunta;
          }
        });
        this.bancoPreguntas.forEach(pregunta => {
          // Primero: parsear jsonPreguntas si viene como string
          if (typeof pregunta.jsonPreguntas === 'string') {
            try {
              pregunta.jsonPreguntas = JSON.parse(pregunta.jsonPreguntas);
            } catch (e) {
              console.error('Error al parsear jsonPreguntas:', e, pregunta.jsonPreguntas);
              pregunta.jsonPreguntas = {};
            }
          }

          // Segundo: parsear jsonAlternativas dentro de jsonPreguntas si viene como string
          if (
            pregunta.jsonPreguntas &&
            typeof pregunta.jsonPreguntas.jsonAlternativas === 'string'
          ) {
            try {
              pregunta.jsonPreguntas.jsonAlternativas = JSON.parse(
                pregunta.jsonPreguntas.jsonAlternativas
              );
            } catch (e) {
              console.error(
                'Error al parsear jsonAlternativas (dentro de jsonPreguntas):',
                e,
                pregunta.jsonPreguntas.jsonAlternativas
              );
              pregunta.jsonPreguntas.jsonAlternativas = [];
            }
          }
          // Tercero (opcional): parsear también el jsonAlternativas raíz, si existe como string
          if (typeof pregunta.jsonAlternativas === 'string') {
            try {
              pregunta.jsonAlternativas = JSON.parse(pregunta.jsonAlternativas);
            } catch (e) {
              console.error(
                'Error al parsear jsonAlternativas (raíz):',
                e,
                pregunta.jsonAlternativas
              );
              pregunta.jsonAlternativas = [];
            }
          }
        });

        this.filtrarCursos = this.bancoPreguntas;
      },
    });
  }

  public handleAcciones({ accion, item }) {
    const accionDefinida = [
      'editar',
      'agregar-pregunta-multiple',
      'editar-multiple',
      'eliminar',
      'eliminar-multiple',
    ];

    if (accionDefinida.includes(accion)) {
      this.actionBtnItem.emit({ accion, item });
      return;
    }

    if (accion === 'agregar') {
      this.agregarEditarPregunta({
        iPreguntaId: 0,
        preguntas: [],
        iEncabPregId: -1,
      });
      return;
    }

    if (accion.accion === 'generar-word') {
      this.generarWord();
      return;
    }
    if (accion === 'ver') {
      this.showDetallePregunta = true;
      const index = this.bancoPreguntas.findIndex(i => i.iBancoId === item.iBancoId) + 1;
      this.tituloDetallePregunta = 'PREGUNTA #' + index;
      this.detallePreguntas = item;

      return;
    }
  }
  selectedItems = [];
  private _confirmationModalService = inject(ConfirmationModalService);
  private _apiEvaluacionesR = inject(ApiEvaluacionesRService);

  generarWord() {
    if (this.selectedItems.length === 0) {
      this._confirmationModalService.openAlert({
        header: 'Debe seleccionar almenos una pregunta.',
      });
      return;
    }

    let preguntas = [];

    this.selectedItems.forEach(item => {
      if (item.iEncabPregId == -1) {
        preguntas = [...preguntas, item];
      } else {
        preguntas = [...preguntas, ...item.preguntas];
      }
    });

    const ids = preguntas.map(item => item.iPreguntaId).join(',');

    const params = {
      iCursoId: this.params.iCursoId,
      ids,
    };
    this._apiEvaluacionesR.generarWordByPreguntasIds(params);
  }

  agregarEditarPregunta(pregunta) {
    const refModal = this._dialogService.open(AulaBancoPreguntaFormContainerComponent, {
      ...MODAL_CONFIG,
      data: {
        tipoPreguntas: this.tipoPreguntas,
        pregunta: pregunta,
        iCursoId: this.params.iCursoId,
        iEvaluacionId: this.params.iEvaluacionId,
      },
      header: pregunta.iPreguntaId == 0 ? 'Nueva pregunta' : 'Editar pregunta',
    });
    refModal.onClose.subscribe(result => {
      if (result) {
        this.obtenerBancoPreguntas();
      }
    });
  }

  handleEliminarBancoPreguntas(item) {
    this._confirmService.openConfirm({
      header: '¿Esta seguro de agregar la pregunta?',
      accept: () => {
        this.eliminarPregunta(item);
      },
    });
  }

  eliminarPregunta(item) {
    let ids = item.iPreguntaId;
    if (item.iEncabPregId != -1) {
      ids = item.preguntas.map(item => item.iPreguntaId).join(',');
    }

    this._aulaBancoApiService.eliminarPreguntaById(ids).subscribe({
      next: () => {
        this.obtenerBancoPreguntas();
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  showDetallePregunta: boolean = false;
  detallePreguntas = [];
  tituloDetallePregunta: string;
  handleVerPregunta(item) {
    const params = {
      petition: 'post',
      group: 'evaluaciones',
      prefix: 'banco-preguntas',
      ruta: 'handleCrudOperation',
      data: {
        opcion: 'CONSULTARxiBancoId',
        iBancoId: item.iBancoId,
        idEncabPregId: item.idEncabPregId,
      },
    };
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        if (response.validated) {
          this.showDetallePregunta = true;
          this.detallePreguntas = response.data;
          const index = this.bancoPreguntas.findIndex(i => i.iBancoId === item.iBancoId) + 1;
          this.tituloDetallePregunta = 'PREGUNTA #' + index;
        }
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  accionBtnItem(elemento) {
    const { accion } = elemento;

    switch (accion) {
      case 'close-modal':
        this.showDetallePregunta = false;
        break;
      // case 'ver-pregunta':
      //     this.handleVerPregunta(item)
      //     break
      default:
        console.warn('Acción no reconocida:', accion);
    }
    //console.log(elemento)
  }
}
