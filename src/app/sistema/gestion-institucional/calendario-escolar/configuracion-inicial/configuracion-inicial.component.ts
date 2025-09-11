import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ConfigurarTurnosComponent } from '../configurar-turnos/configurar-turnos.component';

export interface ConfiguracionData {
  cYear?: Date | string;
  dtCalAcadInicio?: Date | string;
  dtCalAcadFin?: Date | string;
  dtCalAcadMatriculaInicio?: Date | string;
  dtCalAcadMatriculaFin?: Date | string;
  dtCalAcadMatriculaResagados?: Date | string;
  dtFaseInicioRegular?: Date | string;
  dtFaseFinRegular?: Date | string;
  dtFaseInicioRecuperacion?: Date | string;
  dtFaseFinRecuperacion?: Date | string;

  // campos calculados
  dInicioFin?: (Date | string)[];
  dMatriculaRegularInicioFin?: (Date | string)[];
  dRegularInicioFin?: (Date | string)[];
  dRezagadosInicioFin?: (Date | string)[];
  dRecuperacionInicioFin?: (Date | string)[];

  jsonDiasLaborables?: any[];
  jsonCalendarioTurnos?: any[];
}

@Component({
  selector: 'app-configuracion-inicial',
  standalone: true,
  imports: [PrimengModule, ConfigurarTurnosComponent],
  templateUrl: './configuracion-inicial.component.html',
  styleUrl: './configuracion-inicial.component.scss',
})
export class ConfiguracionInicialComponent extends MostrarErrorComponent implements OnChanges {
  @Output() datosConfiguracionTurnos = new EventEmitter();
  @Output() datosConfiguracionInicial = new EventEmitter();

  @Input() mostrarModalConfigurarTurnos: boolean = false;
  @Input() data: ConfiguracionData | null = null;

  horarios: any = [];
  iTurnoId: any;
  dtAperTurnoInicio: any;
  dtAperTurnoFin: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']?.currentValue) {
      this.data = changes['data'].currentValue;
      if (this.data.dtCalAcadInicio && this.data.dtCalAcadFin) {
        this.data.dInicioFin = [this.data.dtCalAcadInicio, this.data.dtCalAcadFin];
      }

      if (this.data.dtCalAcadMatriculaInicio && this.data.dtCalAcadMatriculaFin) {
        this.data.dMatriculaRegularInicioFin = [
          this.data.dtCalAcadMatriculaInicio,
          this.data.dtCalAcadMatriculaFin,
        ];
      }

      if (this.data.dtCalAcadMatriculaFin && this.data.dtCalAcadMatriculaResagados) {
        const finMatricula = new Date(this.data.dtCalAcadMatriculaFin);
        const inicioRezagados = new Date(finMatricula);
        inicioRezagados.setDate(inicioRezagados.getDate() + 1);

        this.data.dRezagadosInicioFin = [inicioRezagados, this.data.dtCalAcadMatriculaResagados];
      }

      if (this.data.dtFaseInicioRegular && this.data.dtFaseFinRegular) {
        this.data.dRegularInicioFin = [this.data.dtFaseInicioRegular, this.data.dtFaseFinRegular];
      }

      if (this.data.dtFaseInicioRecuperacion && this.data.dtFaseFinRecuperacion) {
        this.data.dRecuperacionInicioFin = [
          this.data.dtFaseInicioRecuperacion,
          this.data.dtFaseFinRecuperacion,
        ];
      }
      this.horarios = this.data.jsonDiasLaborables;

      if (this.data.jsonCalendarioTurnos) {
        this.iTurnoId = this.data.jsonCalendarioTurnos.length
          ? this.data.jsonCalendarioTurnos[0].iTurnoId
          : null;

        this.dtAperTurnoInicio = this.data.jsonCalendarioTurnos.length
          ? this.data.jsonCalendarioTurnos[0].dtAperTurnoInicio
          : null;

        this.dtAperTurnoFin = this.data.jsonCalendarioTurnos.length
          ? this.data.jsonCalendarioTurnos[0].dtAperTurnoFin
          : null;
      }
    }
  }

  onChange(value: any, campo: string) {
    switch (campo) {
      case 'dRezagadosInicioFin':
        const finMatricula = this.data.dMatriculaRegularInicioFin?.[1] ?? null;
        const inicioRezagados = this.data.dRezagadosInicioFin?.[0] ?? null;

        if (finMatricula && inicioRezagados) {
          const fechaValida = new Date(finMatricula);
          fechaValida.setDate(fechaValida.getDate() + 1);

          if (new Date(inicioRezagados) < fechaValida) {
            this.mostrarMensajeToast({
              severity: 'error',
              summary: '¡Atención!',
              detail: `El inicio de Rezagados debe ser después de la Matrícula Regular`,
            });

            // corregir automáticamente
            this.data.dRezagadosInicioFin = [fechaValida, fechaValida];
          }
        }
        break;
      case 'dRegularInicioFin':
        const fin = this.data.dRegularInicioFin?.[1] ?? null;
        this.data.dRezagadosInicioFin = [fin, fin ? this.data.dRezagadosInicioFin?.[1] : null];
        break;
      case 'dRecuperacionInicioFin':
        const finRegular = this.data.dRegularInicioFin?.[1] ?? null;
        const inicioRecuperacion = this.data.dRecuperacionInicioFin?.[0] ?? null;

        if (
          finRegular &&
          inicioRecuperacion &&
          new Date(inicioRecuperacion) <= new Date(finRegular)
        ) {
          this.mostrarMensajeToast({
            severity: 'error',
            summary: '¡Atención!',
            detail: `La fase de Recuperación debe iniciar después de la fase Regular (fin: ${new Date(finRegular).toLocaleDateString()}).`,
          });

          return;
        }
        break;
    }

    const data = {
      dtCalAcadInicio:
        this.data.dInicioFin && this.data.dInicioFin.length > 0 ? this.data.dInicioFin[0] : null,
      dtCalAcadFin:
        this.data.dInicioFin && this.data.dInicioFin.length > 0 ? this.data.dInicioFin[1] : null,
      dtCalAcadMatriculaInicio:
        this.data.dMatriculaRegularInicioFin && this.data.dMatriculaRegularInicioFin.length > 0
          ? this.data.dMatriculaRegularInicioFin[0]
          : null,
      dtCalAcadMatriculaFin:
        this.data.dMatriculaRegularInicioFin && this.data.dMatriculaRegularInicioFin.length > 0
          ? this.data.dMatriculaRegularInicioFin[1]
          : null,
      dtCalAcadMatriculaResagados:
        this.data.dRezagadosInicioFin && this.data.dRezagadosInicioFin.length > 0
          ? this.data.dRezagadosInicioFin[1]
          : null,
      dtFaseInicioRegular:
        this.data.dRegularInicioFin && this.data.dRegularInicioFin.length > 0
          ? this.data.dRegularInicioFin[0]
          : null,
      dtFaseFinRegular:
        this.data.dRegularInicioFin && this.data.dRegularInicioFin.length > 0
          ? this.data.dRegularInicioFin[1]
          : null,
      dtFaseInicioRecuperacion:
        this.data.dRecuperacionInicioFin && this.data.dRecuperacionInicioFin.length > 0
          ? this.data.dRecuperacionInicioFin[0]
          : null,
      dtFaseFinRecuperacion:
        this.data.dRecuperacionInicioFin && this.data.dRecuperacionInicioFin.length > 0
          ? this.data.dRecuperacionInicioFin[1]
          : null,
    };
    this.datosConfiguracionInicial.emit(data);
  }

  enviarDatosConfiguracionTurnos(event) {
    const data = {
      ...event,
    };

    this.datosConfiguracionTurnos.emit(data);
    this.mostrarModalConfigurarTurnos = false;
  }
}
