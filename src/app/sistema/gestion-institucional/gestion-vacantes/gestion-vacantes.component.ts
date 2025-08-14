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
      iVacanteNEE: [0, Validators.required],
      iEstado: [0],
      iVancateEId: [null],
    });

    this.obtenerGradoSeccion();
    this.getVacantes();
  }

  //----Guardar registro el GRID--------------------------
  onSubmit() {
    const valoresFormulario = this.form.value;
    const nuevoRegistro = {
      iNivel_grado: Number(valoresFormulario.iNivelGradoId),
      cVacantesRegular: Number(valoresFormulario.iVacantesRegular),
      cVacanteNEE: Number(valoresFormulario.iVacanteNEE),
    };

    // Validacion si el grado ya existe en el array
    const gradoExistente = this.guardar_vacantes.some(
      registro => registro.iNivel_grado === nuevoRegistro.iNivel_grado
    );

    if (!gradoExistente) {
      this.guardar_vacantes.push(nuevoRegistro);
      setTimeout(() => {
        this.guardar_vacantes = [...this.guardar_vacantes];
      }, 0);

      // **LIMPIAR FORMULARIO Y DROPDOWN**
      this.form.reset({
        iNivelGradoId: null, // Limpiar el dropdown
        cVacantesRegular: 0, // Reiniciar valor numérico
        cVacanteNEE: 0, // Reiniciar valor numérico
      });
    } else {
      console.warn('El grado ya existe en la lista.');
    }
  }

  selectRow(event: any) {
    // Implementa la lógica para manejar la selección de una fila
    console.log('Fila seleccionada:', event);
  }

  // Método para enviar los datos al backend
  enviarVacantes() {
    if (this.guardar_vacantes.length === 0) {
      // Mostrar mensaje de advertencia al usuario
      this.messageService.add({
        severity: 'warn',
        summary: 'Cerrar',
        detail: 'No hay vacantes para enviar.',
        life: 3000,
      });
      return;
    }

    const url = `${this.backendApi}/acad/vacantes/guardar`;

    this.http.post(url, { vacantes: this.guardar_vacantes }).subscribe({
      error: () => {
        // Mostrar mensaje de error al usuario
        this.messageService.add({
          detail: 'Error al guardar las vacantes',
          summary: 'Cerrar',
          life: 3000,
          severity: 'warn',
        });
      },
      complete: () => {
        // Mostrar mensaje de finalización al usuario
        this.messageService.add({
          detail: 'Vacantes guardadas correctamente',
          summary: 'Cerrar',
          life: 3000,
          severity: 'info',
        });
      },
    });
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
        this.form.get('iVacanteNEE')?.setValue(elemento.item.iVacantesNEE);
        this.form.get('iVancateEId')?.setValue(elemento.item.iVancateEId);
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
            detail: 'Error al cargar vacantes de IE.' + error.message,
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
          console.log(this.vacantes, 'Request completed');
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
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          console.log(this.gradosSecciones);
        },
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
    this.query
      .addCalAcademico({
        json: JSON.stringify({
          iSedeId: Number(this.perfil.iSedeId),
          iYAcadId: Number(this.dremoiYAcadId),
          iSeccionId: Number(this.form.value.cSeccion),
          iNivelGradoId: Number(this.form.value.iNivelGradoId),
          iVacantesRegular: Number(this.form.value.iVacantesRegular ?? 0),
          iVacantesNEE: Number(this.form.value.iVacantesNEE ?? 0),
          iEstado: Number(this.form.value.iEstado ?? 0),
          iSesionId: Number(this.perfil.iCredId),
        }),
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
    this.query
      .updateCalAcademico({
        json: JSON.stringify({
          iSedeId: Number(this.perfil.iSedeId),
          iYAcadId: Number(this.dremoiYAcadId),
          iSeccionId: Number(this.form.value.cSeccion),
          iNivelGradoId: Number(this.form.value.iNivelGradoId),
          iVacantesRegular: Number(this.form.value.iVacantesRegular ?? 0),
          iVacantesNEE: Number(this.form.value.iVacantesNEE ?? 0),
          iEstado: Number(this.form.value.iEstado ?? 0),
          iSesionId: Number(this.perfil.iCredId),
          iVacanteIEId: Number(this.form.value.iVancateEId),
        }),
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
    const printContent = this.generatePrintContent();
    const printWindow = window.open('', '_blank', 'width=800,height=600'); // Definir tamaño de la ventana

    printWindow.document.write(`
        <html>
        <head>
        <title>Vacantes Registradas</title>
        <style>
            @page {
                size: A4 portrait; /* Formato A4 en orientación vertical */
                margin: 2cm; /* Márgenes adecuados para impresión */
            }
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                width: 21cm;
                height: 29.7cm;
                margin: 0 auto;
                padding: 1cm;
            }
            h1 {
                text-align: center;
                margin-bottom: 20px;
                margin-top: 20px; /* Ajuste del margen superior sin el logo */
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
            }
            th {
                background-color: #f2f2f2;
            }
            .icon { 
                width: 70px; 
                height: 50px; 
                vertical-align: middle; 
                margin-right: 10px; 
            }
        </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
        `);

    // Cerrar el documento y preparar la impresión
    printWindow.document.close();

    // Asegurar que la imagen se cargue antes de imprimir
    const img = printWindow.document.querySelector('img');
    if (img) {
      img.onload = () => {
        printWindow.print();
      };
      img.onerror = () => {
        console.error('Error: No se pudo cargar el logo.');
        printWindow.print(); // Imprimir incluso si el logo no se carga
      };
    } else {
      printWindow.print(); // Imprimir si no hay imagen
    }
  }

  generatePrintContent(): string {
    let content = `
        <div style="position: relative;">
            <img src="/assets/images/logo.png" alt="Logo" style="position: absolute; top: 0; left: 0; width: 100px; height: auto;">
            <h1 style="text-align: center; margin-top: 60px;">Registro de vacantes para el año ${this.anio_actual}</h1>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Nro.</th> 
                    <th>Grado</th>
                    <th>Vacantes Regulares</th>
                    <th>Vacantes NEE</th>
                </tr>
            </thead>
            <tbody>
        `;

    let contador = 1;
    this.guardar_vacantes.forEach(vacante => {
      content += `
                <tr>
                    <td>${contador}</td>
                    <td></td>                     
                    <td>${vacante.cVacantesRegular}</td>
                    <td>${vacante.cVacanteNEE}</td>
                </tr>
            `;
      contador++;
    });

    content += `
                </tbody>
            </table>
        `;

    return content;
  }

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
