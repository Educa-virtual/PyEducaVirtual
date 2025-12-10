import { Component, OnInit } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vacantes',
  standalone: true,
  imports: [
    ContainerPageComponent,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    TablePrimengComponent,
  ],
  templateUrl: './vacantes.component.html',
  styleUrl: './vacantes.component.scss',
})
export class VacantesComponent implements OnInit {
  form: FormGroup;
  perfil: any;
  dremoiYAcadId: any;
  vacantes: any = [];
  anio_actual: any;

  secciones: any = [];
  grados: any = [];
  gradosSecciones: any = [];
  //  iGradoId: string | null = null;
  //  iSeccionId: string | null = null;

  nivel_tipos: Array<object>;
  tipo_sectores: Array<object>;
  ugeles: Array<object>;
  zonas: Array<object>;
  distritos: Array<object>;
  ies: Array<object>;
  sedes: Array<object>;

  tipos_reportes: Array<object>;

  es_especialista: boolean = true;
  filtradoIE: Array<object>;
  FiltradoSede: Array<object>;

  constructor(
    private store: LocalStoreService,
    private messageService: MessageService,
    private fb: FormBuilder,
    public query: GeneralService
  ) {
    const usuario = this.store.getItem('dremoPerfil');
    console.log(usuario);
    this.perfil = usuario;
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.anio_actual = store.getItem('dremoYear');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      iNivelTipoId: [null, Validators.required],
      iTipoSectorId: [null],
      iUgelId: [null],
      iZonaId: [null],
      iDsttId: [null],

      iIieeId: [null, Validators.required],
      iSedeId: [null, Validators.required],
      iGradoId: [null],
      iSeccionId: [null],
    });
    this.getNivel();
    this.getGestion();
    this.getUgeles();
    this.getZonas();
    this.getDistritos();
    this.getIEs();
    this.getSedes();

    // this.obtenerGradoSeccion();
    //  this.getVacantes();
  }

  getVacantes() {
    let option: number;
    option = 1;
    if (Number(this.form.get('iGradoId')?.value) > 0) {
      option = 2;
    }
    if (
      Number(this.form.get('iGradoId')?.value) > 0 &&
      Number(this.form.get('iSeccionId')?.value) > 0
    ) {
      option = 3; // Cuando ambos están seleccionados
    }

    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: Number(this.perfil.iSedeId),
          iYAcadId: Number(this.dremoiYAcadId),
          iNivelGradoId: Number(this.form.get('iGradoId')?.value ?? 0),
          iSeccionId: Number(this.form.get('iSeccionId')?.value ?? 0),
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
        // complete: () => {
        //   this.messageService.add({
        //     summary: 'Mensaje de sistema',
        //     detail: 'Carga de vacantes de IE exitosa.',
        //     life: 3000,
        //     severity: 'success',
        //   });
        // },
      });
  }

  // funciones agregadas
  obtenerGradoSeccion() {
    const iSedeId = this.form.get('iSedeId')?.value;
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: iSedeId,
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
    this.secciones = this.gradosSecciones.filter(
      item => Number(item.iGradoId) === Number(this.form.get('iGradoId')?.value)
    );
    // this.form.get('iGradoId')?.setValue(this.iGradoId); // Reiniciar el valor del dropdown de secciones
  }

  obtenerSeccionesForm() {
    // this.iGradoId = this.form.value.iGradoId;
    this.secciones = this.gradosSecciones.filter(
      item => item.iGradoId === this.form.value.iGradoId
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

  accionBtnItem(event: any) {
    console.log(event);
  }
  getVacantesAll() {
    this.form.patchValue({ iGradoId: null, iSeccionId: null });
    this.getVacantes();
    this.form.reset();
  }

  getNivel() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'nivel_tipos',
        campos: 'iNivelTipoId, iNivelId, cNivelTipoNombre',
        condicion: 'iNivelId=' + 2 + ' and iEstado=' + 1,
      })
      .subscribe((resp: any) => {
        this.nivel_tipos = resp.data;
      });
  }

  getGestion() {
    this.query
      .searchCalAcademico({
        esquema: 'grl',
        tabla: 'tipos_sectores',
        campos: 'iTipoSectorId, cTipoSectorNombre',
        condicion: '1=1',
      })
      .subscribe((resp: any) => {
        this.tipo_sectores = resp.data;
      });
  }
  getUgeles() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'ugeles',
        campos: 'iUgelId, cUgelNombre ',
        condicion: '1=1',
      })
      .subscribe((resp: any) => {
        this.ugeles = resp.data;
      });
  }

  getDistritos() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          id: this.anio_actual,
        }),
        _opcion: 'getDistritosJuridiccion',
      })
      .subscribe({
        next: (data: any) => {
          // this.totalCursos = data.data;
          this.distritos = data.data;
        },
      });
  }
  getZonas() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'zonas',
        campos: 'iZonaId, cZonaNombre',
        condicion: '1=1',
      })
      .subscribe((resp: any) => {
        this.zonas = resp.data;
      });
  }
  getIEs() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos:
          'iIieeId, iDsttId,iZonaId, iTipoSectorId, cIieeCodigoModular, cIieeNombre, iNivelTipoId, iUgelId ',
        condicion: 'iEstado=1',
      })
      .subscribe((resp: any) => {
        // Asignar data
        const ies = resp.data || [];

        // Agregar el campo calculado
        this.ies = ies.map((ie: any) => ({
          ...ie,
          cIieeNombreCompleto: `${ie.cIieeCodigoModular} - ${ie.cIieeNombre}`,
        }));
      });
  }

  getSedes() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'sedes',
        campos: 'iSedeId, cSedeNombre, iIieeId',
        condicion: 'iEstado=1',
      })
      .subscribe((resp: any) => {
        this.sedes = resp.data;
      });
  }

  // filtrarInstituciones(){
  //   const iNivelTipoId = this.form.get('iNivelTipoId')?.value;
  //   const iTipoSectorId = this.form.get('iTipoSectorId')?.value;
  //   const iUgelId = this.form.get('iUgelId')?.value;
  //   const iDisttId = this.form.get('iDisttId')?.value;

  //   this.filtradoIE = this.ies.filter((ie: any) => {
  //     return (
  //       (iNivelTipoId ? ie.iNivelTipoId === iNivelTipoId : true) &&
  //       (iTipoSectorId ? ie.iTipoSectorId === iTipoSectorId : true) &&
  //       (iUgelId ? ie.iUgelId === iUgelId : true) &&
  //       (iDisttId ? ie.iDsttId === iDisttId : true)
  //     );
  //   });

  // }
  filtrarInstituciones() {
    const filtros = ['iNivelTipoId', 'iTipoSectorId', 'iUgelId', 'iDsttId'];

    this.filtradoIE = this.ies.filter((ie: any) =>
      filtros.every(campo =>
        this.form.value[campo] != null ? ie[campo] === this.form.value[campo] : true
      )
    );
  }

  filtrarSedes() {
    const filtros = ['iIieeId', 'iSedeId', 'iGradoId', 'iSeccionId'];

    this.FiltradoSede = this.sedes.filter((ie: any) =>
      filtros.every(campo =>
        this.form.value[campo] != null ? ie[campo] === this.form.value[campo] : true
      )
    );
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
          detail: 'Error en el procesamiento: ' + error.error.message,
        });
      },
    });
  }

  //---------------------------
  accionesPrincipal: IActionContainer[] = [
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
