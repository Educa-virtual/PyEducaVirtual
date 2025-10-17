import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component';
import { PreguntasFormComponent } from '../../evaluacion-form/preguntas-form/preguntas-form.component';
import { ApiAulaBancoPreguntasService } from '@/app/sistema/aula-virtual/services/api-aula-banco-preguntas.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { GeneralService } from '@/app/servicios/general.service';
import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component';
import { columnsBancoPreguntas } from '../../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas';
import { removeHTML } from '@/app/shared/utils/remove-html';
import { ViewPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/components/view-preguntas/view-preguntas.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-list-preguntas',
  standalone: true,
  imports: [
    PrimengModule,
    AulaBancoPreguntasComponent,
    PreguntasFormComponent,
    BancoPreguntaListaComponent,
    ViewPreguntasComponent,
  ],
  templateUrl: './list-preguntas.component.html',
  styleUrl: './list-preguntas.component.scss',
})

/**
 * Componente para manejar preguntas dentro de una evaluación.
 * Permite agregar, editar, eliminar y consultar preguntas, además de gestionar las operaciones relacionadas.
 */
export class ListPreguntasComponent implements OnChanges {
  /**
   * Evento que emite acciones de botones.
   */
  @Output() accionBtnItem = new EventEmitter();
  private _ApiAulaBancoPreguntasService = inject(ApiAulaBancoPreguntasService);
  private _ConstantesService = inject(ConstantesService);
  private _FormBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private _GeneralService = inject(GeneralService);
  private _MessageService = inject(MessageService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  /**
   * Datos de las preguntas que se están gestionando.
   */
  @Input() data;
  /**
   * Datos del curso al que pertenecen las preguntas.
   */
  @Input() curso;
  /**
   * ID de la evaluación que se está gestionando.
   */
  @Input() iEvaluacionId: string;
  /**
   * Estado de visibilidad de diferentes modales.
   */
  showModal = true;
  showModalPreguntas: boolean = false;
  showModalBancoPreguntas: boolean = false;
  showModalEncabezadoPreguntas: boolean = false;
  showDetallePregunta: boolean = false;
  detallePreguntas = [];
  itemPreguntas = [];
  tituloDetallePregunta: string;

  preguntasSeleccionadas = [];
  jEnunciadoUrl: any = '';
  idEncabPregId;
  preguntas = [];
  columnas = columnsBancoPreguntas;
  /**
   * Acciones disponibles para las preguntas.
   */
  acciones = [
    {
      labelTooltip: 'Agregar Preguntas',
      icon: 'pi pi-plus',
      accion: 'agregar_preguntas',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: row => row.idEncabPregId,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver_preguntas',
      type: 'item',
      class: 'p-button-rounded p-button-info p-button-text',
    },
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

  private backendApi = environment.backendApi;

  formEncabezadoPreguntas = this._FormBuilder.group({
    opcion: [''],
    valorBusqueda: [''],

    idEncabPregId: [],
    iDocenteId: [],
    iNivelCicloId: [],
    iCursoId: [],
    cEncabPregTitulo: [],
    cEncabPregContenido: ['', Validators.required],
  });
  /**
   * Detecta cambios en las entradas del componente.
   * @param changes - Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes) {
    if (changes.data?.currentValue) {
      this.data = changes.data.currentValue;
    }
    if (changes.iEvaluacionId?.currentValue) {
      this.iEvaluacionId = changes.iEvaluacionId.currentValue;
      this.obtenerBancoPreguntas();
    }
  }

  /**
   * Menú con las opciones de adición de preguntas.
   */
  tiposAgrecacionPregunta: MenuItem[] = [
    {
      label: 'Nueva Pregunta sin Enunciado',
      icon: 'pi pi-plus',
      command: () => {
        this.handleNuevaPregunta(false);
      },
    },
    {
      label: 'Nueva Pregunta con Enunciado',
      icon: 'pi pi-plus',
      command: () => {
        this.handleNuevaPregunta(true);
      },
    } /*,
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.handleBancopregunta()
            },
        },*/,
  ];
  /**
   * Maneja las acciones de los botones dentro de la lista de preguntas.
   * @param elemento - Elemento que contiene la acción a realizar.
   */
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({ accion, item });
        break;
      case 'close-modal-preguntas-form':
        this.obtenerBancoPreguntas();
        this.showModalPreguntas = false;
        this.idEncabPregId = null;
        break;
      case 'GUARDARxEncabezadoPreguntas':
        this.idEncabPregId = item.length ? item[0]['idEncabPregId'] : null;
        this.jEnunciadoUrl = '';
        this.showModalEncabezadoPreguntas = false;
        if (this.idEncabPregId) {
          this.showModalPreguntas = true;
        }
        this.obtenerBancoPreguntas();
        break;
      case 'CONSULTARxiEvaluacionId':
        this.preguntas = item;
        this.preguntas.forEach(i => {
          i.json_alternativas = i.json_alternativas
            ? JSON.parse(i.json_alternativas)
            : i.json_alternativas;
          i.cPreguntaNoHTML = i.cBancoPregunta ? removeHTML(i.cBancoPregunta) : null;
        });
        break;
      case 'ver_preguntas':
        this.showDetallePregunta = true;
        this.handleVerPregunta(item);
        break;
      case 'eliminar':
        this._ConfirmationModalService.openConfirm({
          header: '¿Esta seguro de eliminar la pregunta ' + ' ?',
          accept: () => {
            this.eliminarPregunta(item);
          },
        });
        break;
      case 'EliminarxiEvalPregId':
        this.obtenerBancoPreguntas();
        break;
      case 'actualizar':
        this.showModalPreguntas = true;
        this.handleVerPregunta(item);
        break;
      case 'agregar_preguntas':
        this.showModalPreguntas = true;
        this.idEncabPregId = item.idEncabPregId;
        break;
    }
  }
  /**
   * Muestra el modal del banco de preguntas.
   *
   * Este método cambia el valor de la variable `showModalBancoPreguntas` a `true`,
   * lo que provoca que el modal correspondiente sea visible para el usuario.
   *
   * @function
   * @memberof NombreDelComponente
   */
  handleBancopregunta() {
    this.showModalBancoPreguntas = true;
  }
  /**
   * Maneja el cambio en los datos de la fila seleccionada.
   * Esta función actualiza el array `preguntasSeleccionadas` con los datos
   * de la fila seleccionada, copiando los elementos del evento.
   *
   * @param {Object[]} event - El evento que contiene los datos de la fila seleccionada.
   * @param {Object} event - El objeto del evento, que debe ser una lista o array de objetos.
   * @returns {void}
   */
  selectedRowDataChange(event) {
    this.preguntasSeleccionadas = [...event];
  }

  /**
   * Maneja el cambio en los datos de la fila seleccionada.
   * Esta función actualiza el array `preguntasSeleccionadas` con los datos
   * de la fila seleccionada, copiando los elementos del evento.
   *
   * @param {Object[]} event - El evento que contiene los datos de la fila seleccionada.
   * @param {Object} event - El objeto del evento, que debe ser una lista o array de objetos.
   * @returns {void} - No retorna ningún valor.
   */
  handleNuevaPregunta(encabezado) {
    if (encabezado) {
      this.showModalEncabezadoPreguntas = true;
    } else {
      this.detallePreguntas = [];
      this.showModalPreguntas = true;
    }
  }
  /**
   * Guarda o actualiza una pregunta con sus alternativas en el sistema.
   *
   * @param {Object} unverified_data - Los datos de la pregunta y sus alternativas que se desean guardar o actualizar.
   * @param {string} unverified_data.pregunta - La pregunta a guardar o actualizar.
   * @param {Array} unverified_data.alternativas - Las alternativas asociadas a la pregunta.
   * @param {number} [unverified_data.id] - El ID de la pregunta en caso de actualización. Si no se proporciona, se realiza una operación de inserción.
   *
   * @returns {void} - No retorna valor. Realiza una petición HTTP para guardar o actualizar los datos en el backend.
   */

  guardarActualizarPreguntaConAlternativas(data) {
    this._ApiAulaBancoPreguntasService.guardarActualizarPreguntaConAlternativas(data).subscribe({
      next: response => {
        console.log(response);
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  /**
   * Maneja el cambio de archivo cuando se realiza una carga.
   * Convierte el archivo a FormData y lo envía a un endpoint de backend.
   * Luego actualiza el valor del campo correspondiente si la carga es exitosa.
   *
   * @param {any} evt El evento generado por la acción de cargar un archivo.
   * @param {any} tipo El tipo de archivo que se está cargando (ej. 'enunciado').
   * @returns {Promise<void>} Promesa que se resuelve cuando la operación de carga se completa.
   */
  async onUploadChange(evt: any, tipo: any) {
    const file = evt.target.files[0];

    if (file) {
      const dataFile = await this.objectToFormData({
        file: file,
        nameFile: tipo,
      });
      this.http
        .post(`${this.backendApi}/general/subir-archivo?` + 'skipSuccessMessage=true', dataFile)
        .pipe(
          map((event: any) => {
            if (event.validated) {
              switch (tipo) {
                case 'enunciado':
                  this.jEnunciadoUrl = event.data;
                  this.formEncabezadoPreguntas.controls.cEncabPregContenido.setValue(
                    this.jEnunciadoUrl
                  );

                  break;
              }
            }
          }),
          catchError((err: any) => {
            return throwError(err.message);
          })
        )
        .toPromise();
    }
  }
  /**
   * Convierte un objeto en un FormData para ser enviado en una solicitud HTTP.
   *
   * Esta función toma un objeto como argumento, recorre sus claves y valores,
   * y agrega cada par clave-valor al FormData, asegurándose de que los valores
   * no sean cadenas vacías antes de agregarlos.
   *
   * @param {any} obj - El objeto que se convertirá en FormData. Debe ser un objeto
   *                    con pares clave-valor donde los valores pueden ser de cualquier tipo.
   * @returns {FormData} - El FormData generado a partir del objeto proporcionado.
   */
  objectToFormData(obj: any) {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '') {
        formData.append(key, obj[key]);
      }
    });

    return formData;
  }
  /**
   * Abre una nueva ventana o pestaña en el navegador con la ruta proporcionada.
   *
   * @param {string} item - El nombre o identificador del recurso que se desea abrir.
   * @returns {void} - No retorna ningún valor.
   */
  openLink(item) {
    if (!item) return;
    const ruta = environment.backend + '/' + item;
    window.open(ruta, '_blank');
  }

  /**
   * Guarda los datos del encabezado de preguntas en el formulario y realiza una operación de CRUD.
   *
   * Esta función asigna los valores a los controles del formulario `formEncabezadoPreguntas`
   * y luego envía una petición para realizar la operación de guardado utilizando la función
   * `getInformation`. La información enviada incluye detalles de la evaluación, el docente,
   * el curso y el ciclo.
   *
   * @returns {void} No retorna ningún valor.
   */
  guardarEncabezadoPreguntas() {
    this.formEncabezadoPreguntas.controls.opcion.setValue('GUARDARxEncabezadoPreguntas');
    this.formEncabezadoPreguntas.controls.iDocenteId.setValue(this._ConstantesService.iDocenteId);
    this.formEncabezadoPreguntas.controls.iNivelCicloId.setValue(this.curso?.iNivelCicloId);
    this.formEncabezadoPreguntas.controls.iCursoId.setValue(this.curso?.iCursoId);
    const params = {
      petition: 'post',
      group: 'evaluaciones',
      prefix: 'encabezado-preguntas',
      ruta: 'handleCrudOperation',
      valorBusqueda: this.iEvaluacionId,
      data: this.formEncabezadoPreguntas.value,
    };
    this.getInformation(params, this.formEncabezadoPreguntas.value.opcion);
  }
  /**
   * Realiza una consulta para obtener las preguntas del banco de preguntas para una evaluación específica.
   *
   * @function obtenerBancoPreguntas
   * @description Esta función envía una solicitud para obtener el banco de preguntas asociado a una evaluación
   *              mediante un procedimiento CRUD. Utiliza la ID de la evaluación (iEvaluacionId) para filtrar las preguntas.
   *
   * @returns {void} No retorna nada. Realiza una llamada a la función `getInformation` para obtener los datos.
   */
  obtenerBancoPreguntas() {
    const params = {
      petition: 'post',
      group: 'evaluaciones',
      prefix: 'banco-preguntas',
      ruta: 'handleCrudOperation',
      data: {
        opcion: 'CONSULTARxiEvaluacionId',
        valorBusqueda: this.iEvaluacionId, //iEvaluacionId
      },
    };
    this.getInformation(params, 'CONSULTARxiEvaluacionId');
  }

  /**
   * Obtiene información general de un servicio y ejecuta una acción con la respuesta.
   *
   * @param {any} params - Parámetros que se pasan al servicio para obtener la información.
   * @param {string} accion - La acción que se ejecutará con la respuesta obtenida.
   *
   * @returns {void}
   *
   * @throws {Error} Si ocurre un error al obtener la información, se muestra un mensaje de error.
   */
  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtn({ accion, item: response?.data });
      },
      complete: () => {},
      error: error => {
        console.log(error);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  /**
   * Agrega las preguntas seleccionadas al banco de preguntas y las guarda en la base de datos.
   *
   * Este método recorre las preguntas seleccionadas, mapea cada una de ellas con la función `mapLocalPregunta()`,
   * y luego realiza una solicitud para guardar las preguntas en la base de datos. Finalmente, limpia las preguntas
   * seleccionadas y actualiza el banco de preguntas.
   *
   * @function agregarPreguntas
   * @returns {void}
   */
  agregarPreguntas() {
    this.preguntasSeleccionadas.map(item => {
      item = this.mapLocalPregunta(item);
      return item;
    });
    this.showModalBancoPreguntas = false;
    this.preguntasSeleccionadas.forEach(item => {
      item.opcion = 'GUARDARxBancoPreguntas';
      item.iEncabPregId = item.iEncabPregId === -1 ? null : item.iEncabPregId;
      item.iEvaluacionId = this.iEvaluacionId;
      const params = {
        petition: 'post',
        group: 'evaluaciones',
        prefix: 'evaluacion-preguntas',
        ruta: 'handleCrudOperation',
        data: item,
      };
      this.getInformation(params, item.opcion);
    });
    this.preguntasSeleccionadas = [];
    this.obtenerBancoPreguntas();

    //this.preguntas.push(...this.preguntasSeleccionadas)
  }

  /**
   * Mapea la pregunta local según su identificador.
   * Si el identificador de la pregunta es -1, se marca como local y se genera un nuevo ID aleatorio.
   * Si el identificador no es -1, se agregan preguntas locales adicionales.
   *
   * @param {Object} pregunta - El objeto pregunta que se está procesando.
   * @param {number} pregunta.iEncabPregId - El ID del encabezado de la pregunta.
   * @param {boolean} [pregunta.isLocal] - Indicador de si la pregunta es local (solo se agrega si iEncabPregId es -1).
   * @param {number} pregunta.iEvalPregId - El ID de evaluación de la pregunta.
   * @param {Array} pregunta.preguntas - Lista de preguntas adicionales que se deben procesar si iEncabPregId no es -1.
   *
   * @returns {Object} - El objeto pregunta procesado.
   */
  mapLocalPregunta(pregunta) {
    if (pregunta.iEncabPregId == -1) {
      pregunta.isLocal = true;
      pregunta.iEvalPregId = 0;
    } else {
      pregunta.preguntas = this.addLocalPreguntas(pregunta.preguntas);
    }
    return pregunta;
  }
  /**
   * Función para agregar propiedades a un conjunto de preguntas.
   *
   * Esta función mapea un arreglo de preguntas, agregando una propiedad `isLocal` con valor `true`
   * y generando un ID aleatorio para cada pregunta en la propiedad `iEvalPregId`.
   *
   * @param {Array} preguntas - Arreglo de preguntas que se modificarán.
   * @returns {Array} - Nuevo arreglo de preguntas con las propiedades agregadas.
   */
  addLocalPreguntas = preguntas => {
    return preguntas.map(item => {
      item.isLocal = true;
      item.iEvalPregId = 0;
      return item;
    });
  };
  /**
   * Maneja la operación de consulta de detalles de una pregunta en el banco de preguntas.
   *
   * Esta función realiza una solicitud HTTP para obtener los detalles de una pregunta en el banco de preguntas
   * a partir de un identificador específico y un encabezado de pregunta.
   * Una vez obtenidos los datos, se actualiza la variable `detallePreguntas` con la respuesta,
   * y se establece el título de la pregunta con su índice en el banco de preguntas.
   *
   * @param {Object} item - El objeto que contiene los datos de la pregunta que se va a consultar.
   * @param {number} item.iBancoId - El identificador único del banco de preguntas.
   * @param {number} item.idEncabPregId - El identificador del encabezado de la pregunta.
   *
   * @returns {void} No retorna ningún valor.
   */
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
          this.detallePreguntas = response.data;
          const index = this.preguntas.findIndex(i => i.iBancoId === item.iBancoId) + 1;
          this.tituloDetallePregunta = 'PREGUNTA #' + index;
        }
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
  /**
   * Elimina una pregunta de la evaluación mediante el ID de la pregunta.
   *
   * @param {Object} item - El objeto que contiene los detalles de la pregunta a eliminar.
   * @param {number} item.iEvalPregId - El ID de la pregunta que se desea eliminar.
   *
   * @returns {void}
   *
   * @description Esta función crea un objeto `params` con los datos necesarios para realizar
   * una solicitud de eliminación de una pregunta a través de una operación CRUD.
   * Luego llama a la función `getInformation` para enviar la solicitud con el método `post`.
   */
  eliminarPregunta(item) {
    const params = {
      petition: 'post',
      group: 'evaluaciones',
      prefix: 'evaluacion-preguntas',
      ruta: 'handleCrudOperation',
      data: {
        opcion: 'EliminarxiEvalPregId',
        iEvalPregId: item.iEvalPregId,
      },
    };
    this.getInformation(params, 'EliminarxiEvalPregId');
  }
}
