import { PrimengModule } from '@/app/primeng.module';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service';
import { FichaFamiliar } from '../../../interfaces/fichaFamiliar';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownInputComponent } from '../../shared/dropdown-input/dropdown-input.component';
import { DropdownSimpleComponent } from '../../shared/dropdown-simple/dropdown-simple.component';
import { SwitchSimpleComponent } from '../../shared/switch-simple/switch-simple.component';
import { InputSimpleComponent } from '../../shared/input-simple/input-simple.component';
import { FuncionesBienestarService } from '../../../services/funciones-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { APODERADO, ESTUDIANTE } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-ficha-familia-registro',
  standalone: true,
  imports: [
    PrimengModule,
    DropdownInputComponent,
    DropdownSimpleComponent,
    SwitchSimpleComponent,
    InputSimpleComponent,
  ],
  templateUrl: './ficha-familia-registro.component.html',
  styleUrl: './ficha-familia-registro.component.scss',
})
export class FichaFamiliaRegistroComponent implements OnInit, OnChanges {
  @Output() esVisibleChange = new EventEmitter<any>();
  @Input() iFamiliarId: string | null = null;

  formFamiliar: FormGroup;
  familiar_registrado: boolean = false;
  iFichaDGId: any = null;

  tipos_documentos: Array<object>;
  tipos_familiares: Array<object>;
  sexos: Array<object>;
  estados_civiles: Array<object>;
  tipos_vias: Array<object>;
  nacionalidades: Array<object>;
  departamentos: Array<object>;
  provincias: Array<object>;
  distritos: Array<object>;
  tipos_contacto: Array<object>;
  ocupaciones: Array<object>;
  grados_instruccion: Array<object>;
  tipos_ies: Array<object>;

  longitud_documento: number;
  formato_documento: string = '99999999';
  es_peruano: boolean = true;
  documento_consultable: boolean = true;
  fecha_actual: Date = new Date();
  ver_controles_direccion: boolean = true;

  perfil: any;
  formLabeLs: any;
  es_estudiante_apoderado: boolean = false;

  private _messageService = inject(MessageService); // dialog Mensaje simple
  private _confirmService = inject(ConfirmationModalService); // componente de dialog mensaje

  constructor(
    private fb: FormBuilder,
    private datosFichaBienestar: DatosFichaBienestarService,
    private funcionesBienestar: FuncionesBienestarService,
    private route: ActivatedRoute,
    private router: Router,
    private store: LocalStoreService
  ) {
    this.route.parent?.paramMap.subscribe(params => {
      this.iFichaDGId = params.get('id');
    });
    this.perfil = this.store.getItem('dremoPerfil');
    if (!this.iFichaDGId) {
      this.router.navigate(['/']);
    }
    this.es_estudiante_apoderado = [ESTUDIANTE, APODERADO].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
      this.sexos = this.datosFichaBienestar.getSexos();
      this.tipos_familiares = this.datosFichaBienestar.getTiposFamiliares(data?.tipos_familiares);
      this.tipos_documentos = this.datosFichaBienestar.getTiposDocumentos(data?.tipos_documentos);
      this.estados_civiles = this.datosFichaBienestar.getEstadosCiviles(data?.estados_civiles);
      this.nacionalidades = this.datosFichaBienestar.getNacionalidades(data?.nacionalidades);
      this.departamentos = this.datosFichaBienestar.getDepartamentos(data?.departamentos);
      this.datosFichaBienestar.getProvincias(data?.provincias);
      this.datosFichaBienestar.getDistritos(data?.distritos);
      this.tipos_vias = this.datosFichaBienestar.getTiposVias(data?.tipos_vias);
      this.ocupaciones = this.datosFichaBienestar.getOcupaciones(data?.ocupaciones);
      this.grados_instruccion = this.datosFichaBienestar.getGradosInstruccion(
        data?.grados_instruccion
      );
      this.tipos_ies = this.datosFichaBienestar.getTiposIes(data?.tipos_ies);
    });

    this.formLabeLs = {
      bFamiliarVivoConEl: this.es_estudiante_apoderado
        ? '¿Vive en la misma dirección del estudiante?'
        : '¿Vive en la misma dirección?',
    };

    try {
      this.formFamiliar = this.fb.group({
        iFamiliarId: this.iFamiliarId,
        iFichaDGId: [this.iFichaDGId, Validators.required], // PK
        iPersId: [null],
        iTipoFamiliarId: [null, Validators.required],
        bFamiliarVivoConEl: [false],
        iTipoIdentId: [null, Validators.required],
        cPersDocumento: ['', Validators.required],
        cPersNombre: ['', Validators.required],
        cPersPaterno: ['', Validators.required],
        cPersMaterno: [''],
        dPersNacimiento: [null, Validators.required],
        cPersSexo: [null, Validators.required],
        iTipoEstCivId: [null],
        iNacionId: [null],
        iDptoId: [null],
        iPrvnId: [null],
        iDsttId: [null],
        cPersDomicilio: [''],
        iTipoViaId: [null, Validators.required],
        cTipoViaOtro: ['', Validators.maxLength(100)],
        cFamiliarDireccionNombreVia: ['', [Validators.required, Validators.maxLength(150)]],
        cFamiliarDireccionNroPuerta: ['', Validators.maxLength(10)],
        cFamiliarDireccionBlock: ['', Validators.maxLength(3)],
        cFamiliarDireccionInterior: ['', Validators.maxLength(3)],
        iFamiliarDireccionPiso: [null],
        cFamiliarDireccionManzana: ['', Validators.maxLength(10)],
        cFamiliarDireccionLote: ['', Validators.maxLength(3)],
        cFamiliarDireccionKm: ['', Validators.maxLength(10)],
        cFamiliarDireccionReferencia: [''],
        iOcupacionId: [null],
        iGradoInstId: [null],
        iTipoIeEstId: [null],
      });
    } catch (error) {
      console.log(error, 'error al inicializar formulario');
    }

    this.verFamiliar();

    this.formFamiliar.get('iTipoIdentId').valueChanges.subscribe(value => {
      // Solo permitir validar DNI, CDE y RUC
      this.documento_consultable = [1, 2, 3].includes(value) ? true : false;
      const tipo_doc = this.tipos_documentos.find((item: any) => item.value === value);
      if (tipo_doc) {
        const longitud = this.formFamiliar.get('cPersDocumento')?.value;
        if (longitud && longitud.length > tipo_doc['longitud']) {
          this.formFamiliar.get('cPersDocumento').setValue(null);
        }
        this.longitud_documento = tipo_doc['longitud'];
        this.formato_documento = '9'.repeat(this.longitud_documento);
      }
    });

    this.formFamiliar.get('iNacionId').valueChanges.subscribe(value => {
      this.es_peruano = value === 193 ? true : false;
    });

    this.formFamiliar.get('iDptoId').valueChanges.subscribe(value => {
      this.formFamiliar.get('iPrvnId').setValue(null);
      this.provincias = null;
      this.filterProvincias(value);
    });

    this.formFamiliar.get('iPrvnId').valueChanges.subscribe(value => {
      this.formFamiliar.get('iDsttId').setValue(null);
      this.distritos = null;
      this.filterDistritos(value);
    });

    this.formFamiliar.get('bFamiliarVivoConEl').valueChanges.subscribe(value => {
      if (value === true) {
        this.ver_controles_direccion = false;
        const cTipoViaId = this.formFamiliar.get('iTipoViaId');
        cTipoViaId.clearValidators();
        cTipoViaId.updateValueAndValidity();
        const cFamiliarDireccionNombreVia = this.formFamiliar.get('cFamiliarDireccionNombreVia');
        cFamiliarDireccionNombreVia.clearValidators();
        cFamiliarDireccionNombreVia.updateValueAndValidity();
      } else {
        this.ver_controles_direccion = true;
        const cTipoViaId = this.formFamiliar.get('iTipoViaId');
        cTipoViaId.setValidators([Validators.required]);
        cTipoViaId.updateValueAndValidity();
        const cFamiliarDireccionNombreVia = this.formFamiliar.get('cFamiliarDireccionNombreVia');
        cFamiliarDireccionNombreVia.setValidators([Validators.required, Validators.maxLength(150)]);
        cFamiliarDireccionNombreVia.updateValueAndValidity();

        this.formFamiliar.get('iTipoViaId')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionNombreVia')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionNroPuerta')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionBlock')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionInterior')?.setValue(null);
        this.formFamiliar.get('iFamiliarDireccionPiso')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionManzana')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionLote')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionKm')?.setValue(null);
        this.formFamiliar.get('cFamiliarDireccionReferencia')?.setValue(null);
      }
    });

    this.funcionesBienestar.formMarkAsDirty(this.formFamiliar);
  }

  ngOnChanges() {
    this.verFamiliar();
  }

  filterProvincias(iDptoId: number) {
    if (!iDptoId) return null;
    this.provincias = this.datosFichaBienestar.filterProvincias(iDptoId);
  }

  filterDistritos(iPrvnId: number) {
    if (!iPrvnId) return null;
    this.distritos = this.datosFichaBienestar.filterDistritos(iPrvnId);
  }

  verFamiliar() {
    this.formFamiliar?.get('iFichaDGId')?.setValue(this.iFichaDGId);

    if (!this.iFamiliarId) return null;

    this.datosFichaBienestar
      .verFamiliar({
        iFamiliarId: this.iFamiliarId,
      })
      .subscribe((data: any) => {
        if (data.data.length === 1) {
          this.setFormFamiliar(data.data[0]);
          this.familiar_registrado = true;
        } else {
          this.setFormFamiliar(null);
          this.familiar_registrado = false;
        }
      });
  }

  /**
   * Buscar datos de persona segun documento en formulario
   */
  validarPersona() {
    if (
      !this.formFamiliar.get('iTipoIdentId')?.value ||
      !this.formFamiliar.get('cPersDocumento')?.value
    ) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe especificar un tipo y número de documento',
      });
      return;
    }
    this.datosFichaBienestar
      .validarPersona({
        iTipoIdentId: this.formFamiliar.get('iTipoIdentId')?.value,
        cPersDocumento: this.formFamiliar.get('cPersDocumento')?.value,
      })
      .subscribe({
        next: (data: any) => {
          if (data.data) {
            this.setFormFamiliarValidado(data.data);
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: data.message,
            });
          } else {
            this._messageService.add({
              severity: 'danger',
              summary: 'Error',
              detail: 'No se pudo encontrar el documento',
            });
            this.formFamiliar.get('cPersNombre').setValue(null);
            this.formFamiliar.get('cPersPaterno').setValue(null);
            this.formFamiliar.get('cPersMaterno').setValue(null);
          }
        },
        error: error => {
          console.error('Error validando persona:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Error al validar persona',
          });
          this.formFamiliar.get('cPersNombre').setValue(null);
          this.formFamiliar.get('cPersPaterno').setValue(null);
          this.formFamiliar.get('cPersMaterno').setValue(null);
        },
      });
  }

  /**
   * Setea los datos de un familiar seleccionado
   * @param item datos del familiar seleccionado
   */
  setFormFamiliar(item: any) {
    if (!item) {
      this.formFamiliar.reset();
      this.funcionesBienestar.formMarkAsDirty(this.formFamiliar);
      this.familiar_registrado = false;
      return;
    }
    this.formFamiliar.patchValue(item);
    this.formFamiliar.get('iFichaDGId').setValue(this.iFichaDGId);
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'bFamiliarVivoConEl',
      item.bFamiliarVivoConEl,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoIdentId',
      item.iTipoIdentId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoFamiliarId',
      item.iTipoFamiliarId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoEstCivId',
      item.iTipoEstCivId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iNacionId',
      item.iNacionId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iDptoId',
      item.iDptoId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iPrvnId',
      item.iPrvnId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iDsttId',
      item.iDsttId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoViaId',
      item.iTipoViaId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iFamiliarDireccionPiso',
      item.iFamiliarDireccionPiso,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iOcupacionId',
      item.iOcupacionId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iGradoInstId',
      item.iGradoInstId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoIeEstId',
      item.iTipoIeEstId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'dPersNacimiento',
      item.dPersNacimiento,
      'date'
    );
    this.formFamiliar.get('cPersDocumento').patchValue(item.cPersDocumento);
    this.formFamiliar.get('cPersNombre').patchValue(item.cPersNombre);
    this.formFamiliar.get('cPersPaterno').patchValue(item.cPersPaterno);
    this.formFamiliar.get('cPersMaterno').patchValue(item.cPersMaterno);
    this.formFamiliar.get('cPersSexo').patchValue(item.cPersSexo);
    this.formFamiliar.get('cPersDomicilio').patchValue(item.cPersDomicilio);
    this.formFamiliar.get('cTipoViaOtro').patchValue(item.cTipoViaOtro);
    this.formFamiliar
      .get('cFamiliarDireccionNombreVia')
      .patchValue(item.cFamiliarDireccionNombreVia);
    this.formFamiliar
      .get('cFamiliarDireccionNroPuerta')
      .patchValue(item.cFamiliarDireccionNroPuerta);
    this.formFamiliar.get('cFamiliarDireccionBlock').patchValue(item.cFamiliarDireccionBlock);
    this.formFamiliar.get('cFamiliarDireccionInterior').patchValue(item.cFamiliarDireccionInterior);
    this.formFamiliar.get('cFamiliarDireccionManzana').patchValue(item.cFamiliarDireccionManzana);
    this.formFamiliar.get('cFamiliarDireccionLote').patchValue(item.cFamiliarDireccionLote);
    this.formFamiliar.get('cFamiliarDireccionKm').patchValue(item.cFamiliarDireccionKm);
    this.formFamiliar
      .get('cFamiliarDireccionReferencia')
      .patchValue(item.cFamiliarDireccionReferencia);
    this.funcionesBienestar.formMarkAsDirty(this.formFamiliar);
  }

  /**
   * Setea los datos de un familiar según servicio de validación
   * @param item datos del familiar seleccionado
   */
  setFormFamiliarValidado(item: FichaFamiliar) {
    if (!item) {
      this.formFamiliar.get('iPersId')?.setValue(null);
      this.familiar_registrado = false;
      return;
    }
    this.formFamiliar.get('iFichaDGId').setValue(this.iFichaDGId);
    this.formFamiliar.get('cPersNombre').setValue(item.cPersNombre);
    this.formFamiliar.get('cPersPaterno').setValue(item.cPersPaterno);
    this.formFamiliar.get('cPersMaterno').setValue(item.cPersMaterno);
    this.formFamiliar.get('cPersSexo').setValue(item.cPersSexo);
    this.formFamiliar.get('cPersDomicilio').setValue(item.cPersDomicilio);

    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iTipoEstCivId',
      item.iTipoEstCivId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iNacionId',
      item.iNacionId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iDptoId',
      item.iDptoId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iPrvnId',
      item.iPrvnId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'iDsttId',
      item.iDsttId,
      'number'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formFamiliar,
      'dPersNacimiento',
      item.dPersNacimiento,
      'date'
    );
    this.funcionesBienestar.formMarkAsDirty(this.formFamiliar);
  }

  guardarFamiliar() {
    if (this.formFamiliar.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.datosFichaBienestar.guardarFamiliar(this.formFamiliar.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los datos',
        });
        this.familiar_registrado = true;
        this.salirResetearForm();
      },
      error: error => {
        console.error('Error guardando familiar:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al guardar datos',
        });
      },
    });
  }

  actualizarFamiliar() {
    if (this.formFamiliar.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }
    this.datosFichaBienestar.actualizarFamiliar(this.formFamiliar.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        this.familiar_registrado = true;
        this.salirResetearForm();
      },
      error: error => {
        console.error('Error actualizando familiar:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message || 'Error al actualizar datos',
        });
      },
    });
  }

  salirResetearForm() {
    if (this.familiar_registrado) {
      this.esVisibleChange.emit(false);
    }
    this.formFamiliar.reset();
    this.formFamiliar.get('iPersId')?.setValue(null);
    this.formFamiliar.get('iFichaDGId')?.setValue(null);
    this.iFamiliarId = null;
    this.familiar_registrado = false;
    this.funcionesBienestar.formMarkAsDirty(this.formFamiliar);
  }
}
