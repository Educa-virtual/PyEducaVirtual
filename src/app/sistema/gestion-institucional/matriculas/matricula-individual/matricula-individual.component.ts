import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosMatriculaService } from '../../services/datos-matricula.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { PrimengModule } from '@/app/primeng.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-matricula-individual',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './matricula-individual.component.html',
  styleUrl: './matricula-individual.component.scss',
})
export class MatriculaIndividualComponent implements OnInit {
  formMatricula: FormGroup;

  perfil: any;
  iYAcadId: number;
  solo_ver: boolean = false;
  iMatrId: number;

  grado_seccion_turno: Array<object>;
  tipos_matricula: Array<object>;
  nivel_grados: Array<object>;
  secciones: Array<object>;
  turnos: Array<object>;
  tipos_documentos: Array<object>;
  nacionalidades: Array<object>;
  sexos: Array<object>;
  estados_matricula: Array<object>;
  tipos_familiares: Array<object>;

  longitud_documento: number;
  formato_documento: string = '99999999';

  breadCrumbHome: MenuItem = { icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [
    {
      label: 'Gestionar matrículas',
      routerLink: ['/gestion-institucional/gestionar-matriculas'],
    },
    {
      label: 'Matricula',
    },
  ];

  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private matriculaService: DatosMatriculaService,
    private store: LocalStoreService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.paramMap.subscribe((params: any) => {
      this.iMatrId = params.params.iMatrId || null;
    });
    this.route.data.subscribe((data: any) => {
      this.solo_ver = Boolean(data.solo_ver);
    });
  }

  ngOnInit(): void {
    try {
      this.formMatricula = this.fb.group({
        iMatrId: [0],
        iPersId: [null, Validators.required],
        cPersPaterno: ['', Validators.required],
        cPersMaterno: [''],
        cPersNombre: ['', Validators.required],
        iTipoIdentId: [null, Validators.required],
        cPersDocumento: ['', Validators.required],
        cPersSexo: [null, Validators.required],
        iNacionId: [null],
        dPersNacimiento: [null, Validators.required],
        iTipoMatrId: [null],
        dtMatrFecha: [null, Validators.required],
        iNivelGradoId: [null, [Validators.required]],
        iSeccionId: [null, [Validators.required]],
        iTurnoId: [null, [Validators.required]],
        iEstudianteId: [null, [Validators.required]],
        cEstCodigo: ['', [Validators.required]],
        cMatrObservaciones: [''],
        iMatrEstado: [null],
        iMatrNEE: [false],
        iPersIdApoderado: [null],
        iTipoIdentIdApoderado: [null],
        cPersDocumentoApoderado: [''],
        iTipoFamiliarId: [null],
        cApoderadoApenom: [''],
      });
    } catch (error) {
      console.error(error, 'Error de formulario');
    }

    this.matriculaService
      .crearMatricula({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe((data: any) => {
        this.grado_seccion_turno = this.matriculaService.getGradoSeccionTurno(
          data?.grado_seccion_turno
        );
        this.nivel_grados = this.matriculaService.getNivelGrados(data?.grado_seccion_turno);
        this.tipos_documentos = this.matriculaService.getTiposDocumentos(data?.tipos_documentos);
        this.estados_matricula = this.matriculaService.getEstadosMatriculas(
          data?.estados_matricula
        );
        this.tipos_matricula = this.matriculaService.getTiposMatriculas(data?.tipos_matricula);
        this.nacionalidades = this.matriculaService.getNacionalidades(data?.nacionalidades);
        this.tipos_familiares = this.matriculaService.getTiposFamiliares(data?.tipos_familiares);
        this.sexos = this.matriculaService.getSexos();
      });

    this.formMatricula.get('iNivelGradoId').valueChanges.subscribe(value => {
      this.secciones = [];
      this.turnos = [];
      if (value) {
        this.secciones = this.matriculaService.filterSecciones(this.grado_seccion_turno, value);
        if (this.secciones.length === 1) {
          this.formMatricula.get('iSeccionId')?.setValue(this.secciones[0]['value']);
        }
      }
    });

    this.formMatricula.get('iSeccionId').valueChanges.subscribe(value => {
      this.turnos = [];
      const iNivelGradoId = this.formMatricula.get('iNivelGradoId')?.value;
      if (value) {
        this.turnos = this.matriculaService.filterTurnos(
          this.grado_seccion_turno,
          iNivelGradoId,
          value
        );
        if (this.turnos.length === 1) {
          this.formMatricula.get('iTurnoId')?.setValue(this.turnos[0]['value']);
        }
      }
    });

    if (this.iMatrId) {
      this.verMatricula();
    }
  }

  /* BUSCAR DATOS POR CODIGO DE ESTUDIANTE */
  searchCodigoEstudiante() {
    this.matriculaService
      .verEstudiante({
        cEstCodigo: this.formMatricula.value.cEstCodigo,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormMatricula(data.data);
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
  }

  verMatricula() {
    this.matriculaService
      .verMatricula({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
        iMatrId: this.iMatrId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormMatricula(data.data);
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
      });
  }

  setFormMatricula(matricula: any) {
    this.formMatricula.reset();
    this.formMatricula.patchValue(matricula);
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iTipoIdentId',
      matricula.iTipoIdentId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iNivelGradoId',
      matricula.iNivelGradoId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iSeccionId',
      matricula.iSeccionId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iTurnoId',
      matricula.iTurnoId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iNacionId',
      matricula.iNacionId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'dPersNacimiento',
      matricula.dPersNacimiento,
      'date'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iTipoMatrId',
      matricula.iTipoMatrId,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'dtMatrFecha',
      matricula.dtMatrFecha,
      'date'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iMatrEstado',
      matricula.iMatrEstado,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iMatrNEE',
      matricula.iMatrNEE,
      'boolean'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iTipoIdentIdApoderado',
      matricula.iTipoIdentIdApoderado,
      'number'
    );
    this.matriculaService.formatearFormControl(
      this.formMatricula,
      'iTipoFamiliarId',
      matricula.iTipoFamiliarId,
      'number'
    );
    if (this.solo_ver) {
      this.formMatricula.disable();
    }
  }

  actualizarMatricula() {
    this._confirmService.openConfirm({
      header: 'Actualizar matrícula',
      message: `¿Realmente desea actualizar la matricula?`,
      accept: () => {
        this.matriculaService.guardarMatricula(this.formMatricula.value).subscribe({
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Mensaje de sistema',
              detail: 'Error. No se proceso petición ' + error.message,
            });
          },
          complete: () => {
            this.messageService.add({
              summary: 'Mensaje del sistema',
              severity: 'success',
              detail: 'Se actualizo el registro de matrícula',
            });
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  guardarMatricula() {
    this.matriculaService.guardarMatricula(this.formMatricula.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Matrícula registrada',
        });
        setTimeout(() => {
          this.router.navigate(['/gestion-institucional/gestionar-matriculas']);
        }, 1000);
      },
      error: error => {
        console.error('Error guardando matricula:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  validarPersona() {}

  salir() {
    this.router.navigate(['/gestion-institucional/gestionar-matriculas']);
  }
}
