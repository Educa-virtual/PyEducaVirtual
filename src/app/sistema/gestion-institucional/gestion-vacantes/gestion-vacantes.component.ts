import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';

import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-gestion-vacantes',
  standalone: true,
  imports: [
    ContainerPageComponent,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    TablePrimengComponent,
  ],
  templateUrl: './gestion-vacantes.component.html',
  styleUrls: ['./gestion-vacantes.component.scss'],
})
export class GestionVacantesComponent implements OnInit {
  private backendApi: string = environment.backendApi;
  form: FormGroup;
  showModal: boolean = false;
  anio_actual: number;
  guardar_vacantes: any[] = [];

  perfil: any;
  dremoiYAcadId: any;
  vacantes: any = [];
  headerS: string = 'Formulario de registro de vacantes';
  update: boolean = false;

  gradosSecciones: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  iGradoId: string = '';
  iSeccionId: string = '';

  // Nivel_: string = 'SECUNDARIA'
  useFilteredData: boolean = false;
  filteredData: any[] = [];

  constructor(
    private messageService: MessageService,
    private store: LocalStoreService,
    private fb: FormBuilder,
    public query: GeneralService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient // Inyectar HttpClient,
  ) {
    const usuario = this.store.getItem('dremoPerfil');
    console.log(usuario);
    this.perfil = usuario;
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.anio_actual = store.getItem('dremoYear');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      iNivelGradoId: [null, Validators.required],
      cSeccion: [null, Validators.required],
      iVacantesRegular: [0, Validators.required],
      iVacantesNEE: [0, Validators.required],
      iEstado: [0],
      iVancateEId: [null],
    });

    this.obtenerGradoSeccion();
    this.getVacantes();
  }

  //----------------------------------------------
  accionBtnItem(elemento: any): void {
    const { accion, item } = elemento;
    switch (accion) {
      case 'mostrar':
        this.update = false;
        this.headerS = 'Formulario para agregar vacantes.';
        this.form.get('cSeccion')?.enable();
        this.form.get('iNivelGradoId')?.enable();
        this.showModal = true;
        break;
      case 'guardar':
        this.showModal = true;
        //this.enviarVacantes()
        break;
      case 'imprimir':
        this.imprimirVacantes();
        break;
      case 'Cerrar':
        this.showModal = true;
        break;
      case 'editar':
        this.update = true;
        this.headerS = 'Formulario para editar vacantes.';
        this.form.get('iNivelGradoId')?.setValue(item.iNivelGradoId);
        this.form.get('iNivelGradoId')?.disable();

        this.secciones = this.gradosSecciones.filter(
          item => item.iGradoId === elemento.item.iNivelGradoId
        );
        setTimeout(() => {
          this.form.get('cSeccion')?.setValue(elemento.item.iSeccionId);
          this.form.get('cSeccion')?.disable();
          this.showModal = true;
        }, 0);

        // chacer que carge despues de procesar this.obtenerSeccionesForm()

        this.form.get('iVacantesRegular')?.setValue(elemento.item.iVacantesRegular);
        this.form.get('iVacantesNEE')?.setValue(elemento.item.iVacantesNEE);
        this.form.get('iVancateEId')?.setValue(elemento.item.iVacanteIEId);
        this.form.get('iEstado')?.setValue(elemento.item.iEstado);

        break;

      // case 'eliminar' :
      //         this.eliminarVacante(item )

      //     break;
      default:
        break;
    }
  }
  //----------------------------------------------------

  // Método para eliminar una vacante--------
  // eliminarVacante(index: number) {
  //     if (index >= 0 && index < this.guardar_vacantes.length) {
  //         this.guardar_vacantes.splice(index, 1)

  //         // Actualizar la grilla
  //         this.guardar_vacantes = [...this.guardar_vacantes]

  //         // Mostrar mensaje de confirmación
  //         this.messageService.add({
  //             detail: '✅ La vacante fue eliminada.',
  //             summary: 'Cerrar',
  //             life: 3000,
  //             severity: 'success',
  //         })
  //     }
  // }

  getVacantesAll() {
    this.iGradoId = '0';
    this.getVacantes();
    this.form.reset();
  }

  getVacantes() {
    let option: number;
    option = 1;
    if (Number(this.iGradoId) > 0) {
      option = 2;
    }
    if (Number(this.iGradoId) > 0 && Number(this.iSeccionId) > 0) {
      option = 3; // Cuando ambos están seleccionados
    }

    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: Number(this.perfil.iSedeId),
          iYAcadId: Number(this.dremoiYAcadId),
          iNivelGradoId: Number(this.iGradoId ?? 0),
          iSeccionId: Number(this.iSeccionId ?? 0),
          opt: option,
          //iCredId : this.perfil.iCredId
        }),
        _opcion: 'getVacantes',
      })
      .subscribe({
        next: (data: any) => {
          this.vacantes = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar vacantes de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
        complete: () => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Se cargargaron las vacantes de IE.',
            life: 3000,
            severity: 'success',
          });
        },
      });
  }

  // funciones agregadas
  obtenerGradoSeccion() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this.perfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        }),
        _opcion: 'getGradoSeccionXiSedeIdXiYAcadId',
      })
      .subscribe({
        next: (data: any) => {
          this.gradosSecciones = data.data;
          this.grados = this.removeDuplicatesByiGradoId(this.gradosSecciones);
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
        // complete: () => {
        //   console.log(this.gradosSecciones);
        // },
      });
  }

  obtenerSecciones() {
    this.secciones = this.gradosSecciones.filter(item => item.iGradoId === this.iGradoId);
    this.form.get('iNivelGradoId')?.setValue(this.iGradoId); // Reiniciar el valor del dropdown de secciones
  }

  obtenerSeccionesForm() {
    this.iGradoId = this.form.value.iNivelGradoId;
    this.secciones = this.gradosSecciones.filter(
      item => item.iGradoId === this.form.value.iNivelGradoId
    );
  }

  removeDuplicatesByiGradoId(array: any[]): any[] {
    const seen = new Set<number>();
    return array.filter(item => {
      if (seen.has(item.iGradoId)) {
        return false;
      }
      seen.add(item.iGradoId);
      return true;
    });
  }
  addVacante() {
    const params: any = {
      iSedeId: Number(this.perfil.iSedeId),
      iYAcadId: Number(this.dremoiYAcadId),
      iSeccionId: Number(this.form.get('cSeccion')?.value),
      iNivelGradoId: Number(this.form.get('iNivelGradoId')?.value),
      iVacantesRegular: Number(this.form.value.iVacantesRegular ?? 0),
      iVacantesNEE: Number(this.form.value.iVacantesNEE ?? 0),
      iEstado: Number(this.form.value.iEstado ?? 0),
      iSesionId: Number(this.perfil.iCredId),
    };
    this.query
      .addCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'addVacante',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail:
              'Error. No se proceso petición registro ya existe o es invalido ' + error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          this.showModal = false;
          this.form.reset();
          this.getVacantes();
          //  this.getPerfilUsuario(this.usuario)
        },
      });
  }
  updVacante() {
    const params: any = {
      iSedeId: Number(this.perfil.iSedeId),
      iYAcadId: Number(this.dremoiYAcadId),
      iSeccionId: Number(this.form.get('cSeccion')?.value),
      iNivelGradoId: Number(this.form.get('iNivelGradoId')?.value),
      iVacantesRegular: Number(this.form.value.iVacantesRegular ?? 0),
      iVacantesNEE: Number(this.form.value.iVacantesNEE ?? 0),
      iEstado: Number(this.form.value.iEstado ?? 0),
      iSesionId: Number(this.perfil.iCredId),
      iVacanteIEId: Number(this.form.value.iVancateEId),
    };

    this.query
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updVacante',
      })
      .subscribe({
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail:
              'Error. No se proceso petición registro ya existe o es invalido ' + error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje',
            detail: 'Proceso exitoso',
          });
          this.form.reset();
          this.showModal = false;
          this.getVacantes();

          //  this.getPerfilUsuario(this.usuario)
        },
      });
  }
  //----------------------------------
  imprimirVacantes() {
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'gestionInstitucional',
      ruta: 'reportePDFResumenVacantes',
      data: {
        vacantes: this.vacantes,
        perfil: this.perfil,
        anio_actual: this.anio_actual,
      },
    };

    this.query.generarPdf(params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_vacantes.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'Error en el procesamiento: ' + error.message,
        });
      },
    });
  }

  //  if (imagen) {
  //   imagen.onload = () => {

  //   };
  //   // imagen.onerror = () => {
  //   //   console.error('Error: No se pudo cargar el logo.');
  //   //   printWindow.print(); // Imprimir incluso si el logo no se carga
  //   // };
  // } else {
  //   printWindow.document.close();
  //   printWindow.print(); // Imprimir si no hay imagen
  // }

  // generarImagen(){
  //   // Asegurar que la imagen se cargue antes de imprimir

  //---------------------------
  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Registrar Vacantes',
      text: 'Registrar vacantes',
      icon: 'pi pi-save',
      accion: 'mostrar',
      class: 'p-button-primary',
    },
    {
      labelTooltip: 'Imprimir Vacantes',
      text: 'Imprimir vacantes',
      icon: 'pi pi-print',
      accion: 'imprimir',
      class: 'p-button-danger',
    },
  ];
  //----------------------------------------
  selectedItems = [];

  actions: IActionTable[] = [
    /* {
         labelTooltip: 'Editar',
         icon: 'pi pi-calendar-plus',
         accion: 'Editar',
         type: 'item',
         class: 'p-button-rounded p-button-primary p-button-text',
           isVisible: (rowData) => {
                   return rowData.iEstado === '1' // Mostrar solo si el estado es 1 (activo)
               },
       },*/
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      isVisible: rowData => {
        return rowData.iEstado !== '1'; // Mostrar solo si el estado es 1 (activo)
      },
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cGradoNombre',
      header: 'Nivel Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '3rem',
      field: 'iVacantesRegular',
      header: 'Vacantes Regulares',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'iVacantesNEE',
      header: 'Vacantes NEE',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '3rem',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
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
}
