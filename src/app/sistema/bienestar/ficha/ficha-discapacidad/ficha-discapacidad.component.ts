import { PrimengModule } from '@/app/primeng.module';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompartirFichaService } from '../../services/compartir-ficha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosFichaBienestarService } from '../../services/datos-ficha-bienestar.service';
import { MessageService } from 'primeng/api';
import { SwitchInputComponent } from '../shared/switch-input/switch-input.component';
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { APODERADO, ESTUDIANTE } from '@/app/servicios/seg/perfiles';
import { FichaDiscapacidadRegistroComponent } from './ficha-discapacidad-registro/ficha-discapacidad-registro.component';

@Component({
  selector: 'app-ficha-discapacidad',
  standalone: true,
  imports: [PrimengModule, SwitchInputComponent, FichaDiscapacidadRegistroComponent],
  templateUrl: './ficha-discapacidad.component.html',
  styleUrl: './ficha-discapacidad.component.scss',
})
export class FichaDiscapacidadComponent implements OnInit {
  iFichaDGId: any = null;
  formDiscapacidad: FormGroup;
  ficha_registrada: boolean = false;

  perfil: any;
  es_estudiante_apoderado: boolean = false;
  formLabels: any;

  private _messageService = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private compartirFicha: CompartirFichaService,
    private datosFichaBienestar: DatosFichaBienestarService,
    private router: Router,
    private route: ActivatedRoute,
    private funcionesBienestar: FuncionesBienestarService,
    private store: LocalStoreService
  ) {
    this.compartirFicha.setActiveIndex(5);
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iFichaDGId = params.get('id');
    });
    if (!this.iFichaDGId) {
      this.router.navigate(['/']);
    }
    this.es_estudiante_apoderado = [ESTUDIANTE, APODERADO].includes(Number(this.perfil.iPerfilId));
  }

  ngOnInit(): void {
    try {
      this.formDiscapacidad = this.fb.group({
        iFichaDGId: [this.iFichaDGId, Validators.required],
        bFichaDGEstaEnCONADIS: [false],
        cFichaDGCodigoCONADIS: [null, Validators.maxLength(50)],
        bFichaDGEstaEnOMAPED: [false],
        cFichaDGCodigoOMAPED: [null, Validators.maxLength(50)],
        bOtroProgramaDiscapacidad: [false],
        cOtroProgramaDiscapacidad: [null, Validators.maxLength(50)],
      });
    } catch (error) {
      console.log(error, 'error inicializando formulario');
    }

    this.formLabels = {
      seccion1: this.es_estudiante_apoderado
        ? 'Indique si el estudiante tiene alguna limitación o discapacidad'
        : 'Indique si tiene alguna limitación o discapacidad',
      seccion2: this.es_estudiante_apoderado
        ? '¿El estudiante está registrado en algún programa?'
        : '¿Está registrado/a en algún programa?',
    };

    if (this.iFichaDGId) {
      this.verFichaDiscapacidad();
    }

    this.funcionesBienestar.formMarkAsDirty(this.formDiscapacidad);
  }

  verFichaDiscapacidad() {
    this.datosFichaBienestar
      .verFichaDiscapacidad({
        iFichaDGId: this.iFichaDGId,
      })
      .subscribe((data: any) => {
        if (data.data.length) {
          this.setFormDiscapacidad(data.data[0]);
        }
      });
  }

  setFormDiscapacidad(data: any) {
    this.formDiscapacidad.patchValue(data);
    this.funcionesBienestar.formatearFormControl(
      this.formDiscapacidad,
      'bFichaDGEstaEnCONADIS',
      data.bFichaDGEstaEnCONADIS,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formDiscapacidad,
      'bFichaDGEstaEnOMAPED',
      data.bFichaDGEstaEnOMAPED,
      'boolean'
    );
    this.funcionesBienestar.formatearFormControl(
      this.formDiscapacidad,
      'bOtroProgramaDiscapacidad',
      data.bOtroProgramaDiscapacidad,
      'boolean'
    );
    this.funcionesBienestar.formMarkAsDirty(this.formDiscapacidad);
  }

  actualizar() {
    if (this.formDiscapacidad.invalid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe completar los campos requeridos',
      });
      return;
    }

    this.datosFichaBienestar.actualizarFichaDiscapacidad(this.formDiscapacidad.value).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Actualización exitosa',
          detail: 'Se actualizaron los datos',
        });
        setTimeout(() => {
          this.router.navigate([`/bienestar/ficha/${this.iFichaDGId}/salud`]);
        }, 1000);
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
