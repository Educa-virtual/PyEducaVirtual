import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service';
import { MessageService } from 'primeng/api';
import { CompartirFichaService } from '../../services/compartir-ficha.service';
import { FichaGeneral } from '../../interfaces/fichaGeneral';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component';
import { DropdownInputComponent } from '../shared/dropdown-input/dropdown-input.component';
import { InputSimpleComponent } from '../shared/input-simple/input-simple.component';
import { SwitchSimpleComponent } from '../shared/switch-simple/switch-simple.component';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';

@Component({
  selector: 'app-ficha-socioeconomica',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    PrimengModule,
    DropdownModule,
    SwitchInputComponent,
    DropdownInputComponent,
    InputSimpleComponent,
    SwitchSimpleComponent,
  ],
  templateUrl: './ficha-general.component.html',
  styleUrl: './ficha-general.component.scss',
})
export class FichaGeneralComponent implements OnInit {
  formGeneral: FormGroup;
  religiones: Array<object>;
  tipos_vias: Array<object>;
  visibleInput: Array<boolean>;
  ficha_registrada: boolean = false;
  iFichaDGId: any;

  private _MessageService = inject(MessageService);
  private _ConfirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    private datosFichaBienestar: DatosFichaBienestarService,
    private compartirFicha: CompartirFichaService,
    private route: ActivatedRoute,
    private router: Router,
    private funcionesBienestar: FuncionesBienestarService
  ) {
    this.compartirFicha.setActiveIndex(0);
    this.route.parent?.paramMap.subscribe(params => {
      this.iFichaDGId = params.get('id');
    });
    if (!this.iFichaDGId) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.formGeneral = this.fb.group({
      iFichaDGId: this.iFichaDGId,
      iTipoViaId: [null, Validators.required],
      cTipoViaOtro: ['', Validators.maxLength(100)],
      cFichaDGDireccionNombreVia: ['', [Validators.required, Validators.maxLength(150)]],
      cFichaDGDireccionNroPuerta: ['', Validators.maxLength(10)],
      cFichaDGDireccionBlock: ['', Validators.maxLength(3)],
      cFichaDGDireccionInterior: ['', Validators.maxLength(3)],
      iFichaDGDireccionPiso: [null],
      cFichaDGDireccionManzana: ['', Validators.maxLength(10)],
      cFichaDGDireccionLote: ['', Validators.maxLength(3)],
      cFichaDGDireccionKm: ['', Validators.maxLength(10)],
      cFichaDGDireccionReferencia: [''],
      iReligionId: [null],
      cReligionOtro: ['', Validators.maxLength(150)],
      bFamiliarPadreVive: [false],
      bFamiliarMadreVive: [false],
      bFamiliarPadresVivenJuntos: [false],
      bFichaDGTieneHijos: [false],
      iFichaDGNroHijos: [null],
    });

    this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
      this.tipos_vias = this.datosFichaBienestar.getTiposVias(data?.tipos_vias);
      this.religiones = this.datosFichaBienestar.getReligiones(data?.religiones);
    });

    this.verFichaGeneral();
    this.funcionesBienestar.formMarkAsDirty(this.formGeneral);
  }

  verFichaGeneral() {
    this.datosFichaBienestar
      .verFichaGeneral({
        iFichaDGId: this.iFichaDGId,
      })
      .subscribe((data: any) => {
        if (data.data.length) {
          this.setFormGeneral(data.data[0]);
        }
      });
  }

  setFormGeneral(data: FichaGeneral) {
    this.ficha_registrada = true;
    this.formGeneral.patchValue(data);
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'iTipoViaId',
      data.iTipoViaId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'iReligionId',
      data.iReligionId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'bFamiliarPadreVive',
      data.bFamiliarPadreVive,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'bFamiliarMadreVive',
      data.bFamiliarMadreVive,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'bFamiliarPadresVivenJuntos',
      data.bFamiliarPadresVivenJuntos,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formGeneral,
      'bFichaDGTieneHijos',
      data.bFichaDGTieneHijos,
      'boolean'
    );
    this.funcionesBienestar.formMarkAsDirty(this.formGeneral);
  }

  actualizar() {
    if (this.formGeneral.invalid) {
      this._MessageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.datosFichaBienestar.actualizarFichaGeneral(this.formGeneral.value).subscribe({
      next: () => {
        this.ficha_registrada = true;
        this._MessageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        setTimeout(() => {
          this.router.navigate([`/bienestar/ficha/${this.iFichaDGId}/familia`]);
        }, 1000);
      },
      error: error => {
        console.error('Error actualizando ficha:', error);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }
}
