import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { CompartirFichaService } from '../../services/compartir-ficha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service';
import { MultiselectInputComponent } from '../shared/multiselect-input/multiselect-input.component';
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component';
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component';
import { DropdownSimpleComponent } from '../shared/dropdown-simple/dropdown-simple.component';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';

@Component({
  selector: 'app-ficha-recreacion',
  standalone: true,
  imports: [
    PrimengModule,
    MultiselectInputComponent,
    SwitchInputComponent,
    DropdownInputComponent,
    DropdownSimpleComponent,
  ],
  templateUrl: './ficha-recreacion.component.html',
  styleUrl: './ficha-recreacion.component.scss',
})
export class FichaRecreacionComponent implements OnInit {
  iFichaDGId: any = null;
  formRecreacion: FormGroup | undefined;
  visibleInput: Array<boolean>;
  ficha_registrada: boolean = false;

  deportes: Array<any> = [];
  religiones: Array<any> = [];
  transportes: Array<any> = [];
  pasatiempos: Array<any> = [];
  actividades: Array<any> = [];
  tipos_familiares: Array<any> = [];
  relacion_familia: Array<any> = [];
  estados_relacion: Array<any> = [];

  private _messageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private compartirFicha: CompartirFichaService,
    private datosFichaBienestar: DatosFichaBienestarService,
    private router: Router,
    private route: ActivatedRoute,
    private funcionesBienestar: FuncionesBienestarService
  ) {
    this.compartirFicha.setActiveIndex(7);
    this.route.parent?.paramMap.subscribe(params => {
      this.iFichaDGId = params.get('id');
    });
    if (!this.iFichaDGId) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.formRecreacion = this.fb.group({
      iFichaDGId: [this.iFichaDGId, Validators.required],
      iDeporteId: [null],
      cDeporteOtro: ['', Validators.maxLength(80)],
      bFichaDGPerteneceLigaDeportiva: [false],
      cFichaDGPerteneceLigaDeportiva: [''],
      iReligionId: [null],
      cReligionOtro: ['', Validators.maxLength(80)],
      bFichaDGPerteneceCentroArtistico: [false],
      cFichaDGPerteneceCentroArtistico: [''],
      iActArtisticaId: [null],
      cActArtisticaOtro: ['', Validators.maxLength(80)],
      iPasaTiempoId: [null],
      cPasaTiempoOtro: ['', Validators.maxLength(80)],
      bFichaDGAsistioConsultaPsicologica: [false],
      cFichaDGAsistioConsultaPsicologica: [''],
      iTipoFamiliarId: [null],
      cTipoFamiliarOtro: ['', Validators.maxLength(80)],
      iEstadoRelFamiliar: [null],
      iTransporteId: [null],
      cTransporteOtro: ['', Validators.maxLength(80)],
      jsonDeportes: [null],
      jsonPasatiempos: [null],
      jsonProblemas: [null],
      jsonTransportes: [null],
    });

    this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
      this.deportes = this.datosFichaBienestar.getDeportes(data?.deportes);
      this.religiones = this.datosFichaBienestar.getReligiones(data?.religiones);
      this.transportes = this.datosFichaBienestar.getTransportes(data?.transportes);
      this.pasatiempos = this.datosFichaBienestar.getPasatiempos(data?.pasatiempos);
      this.actividades = this.datosFichaBienestar.getActividades(data?.actividades);
      this.tipos_familiares = this.datosFichaBienestar.getTiposFamiliares(data?.tipos_familiares);
      this.estados_relacion = this.datosFichaBienestar.getEstadosRelacion();
    });

    if (this.iFichaDGId) {
      this.verFichaRecreacion();
    }

    this.funcionesBienestar.formMarkAsDirty(this.formRecreacion);
  }

  verFichaRecreacion() {
    this.datosFichaBienestar
      .verFichaRecreacion({
        iFichaDGId: this.iFichaDGId,
      })
      .subscribe((data: any) => {
        if (data.data.length) {
          this.setFormRecreacion(data.data[0]);
        }
      });
  }

  setFormRecreacion(data: any) {
    this.ficha_registrada = true;
    this.formRecreacion.patchValue(data);

    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iDeporteId',
      data.deportes,
      'json'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iPasaTiempoId',
      data.pasatiempos,
      'json'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iActArtisticaId',
      data.actividades,
      'json',
      'iPasaTiempoId'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iTipoFamiliarId',
      data.problemas_emocionales,
      'json'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iTransporteId',
      data.transportes,
      'json'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iEstadoRelFamiliar',
      data.iEstadoRelFamiliar,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'iReligionId',
      data.iReligionId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'bFichaDGPerteneceLigaDeportiva',
      data.bFichaDGPerteneceLigaDeportiva,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'bFichaDGPerteneceCentroArtistico',
      data.bFichaDGPerteneceCentroArtistico,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formRecreacion,
      'bFichaDGAsistioConsultaPsicologica',
      data.bFichaDGAsistioConsultaPsicologica,
      'boolean'
    );

    this.funcionesBienestar.formMarkAsDirty(this.formRecreacion);
  }

  actualizar() {
    if (this.formRecreacion.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }

    this.funcionesBienestar.formControlJsonStringify(
      this.formRecreacion,
      'jsonDeportes',
      'iDeporteId'
    );
    this.funcionesBienestar.formControlJsonStringify(
      this.formRecreacion,
      'jsonPasatiempos',
      ['iPasaTiempoId', 'iActArtisticaId'],
      'iPasaTiempoId'
    );
    this.funcionesBienestar.formControlJsonStringify(
      this.formRecreacion,
      'jsonProblemas',
      'iTipoFamiliarId'
    );
    this.funcionesBienestar.formControlJsonStringify(
      this.formRecreacion,
      'jsonTransportes',
      'iTransporteId'
    );

    this.datosFichaBienestar.actualizarFichaRecreacion(this.formRecreacion.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
      },
      error: error => {
        console.error('Error actualizando ficha:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  salir() {
    this.router.navigate(['/']);
  }
}
