import { Component, inject, OnInit } from '@angular/core';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [ReactiveFormsModule, ContainerPageComponent, PrimengModule, CardModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.scss',
})
export class ConfiguracionesComponent implements OnInit {
  mensaje: Message[] = [
    {
      severity: 'warn',
      detail: 'En caso de existir configuración existente la elimina y crea nuevos',
    },
  ];
  dremoYear: number;
  perfil: any[] = [];
  iYAcadId: number;
  respuesta: any;

  form: FormGroup;
  private _confirmService = inject(ConfirmationModalService);

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    public query: GeneralService,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.dremoYear = this.store.getItem('dremoYear');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
  }
  ngOnInit(): void {
    console.log(this.store);
    // this.mensajeInformativo()
  }

  mensajeInformativo() {
    const title = 'Configurar inicio escolar';

    this._confirmService.openConfiSave({
      message: '¿Está seguro de que desea configurar Inicio escolar?',
      header: title,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción a realizar al confirmar
      },
      reject: () => {
        // Acción a realizar al rechazar
        // this.router.navigate([
        //     '/gestion-institucional/configGradoSeccion',
        // ])
      },
    });
  }
  generarInicioAnioMasivo() {
    this._confirmService.openConfiSave({
      message:
        '¿Está seguro de que desea configurar Inicio escolar?. La informacion existente de año ' +
        this.dremoYear +
        ' se eliminará',
      header: 'Mensaje de alerta',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción a realizar al confirmar
        // this.generarConfiguracionMasivaInicio()
      },
      reject: () => {
        // Acción a realizar al rechazar
        this.messageService.add({
          severity: 'error',
          summary: 'Error de procesamiento',
          detail: 'Se calcelo la operación',
        });
        // this.router.navigate([
        //     '/gestion-institucional/configGradoSeccion',
        // ])
      },
    });
  }
  // Procedimiento
  generarConfiguracionMasivaInicio() {
    this.query
      .generarConfiguracionMasivaInicio({
        iYAcadId: Number(this.iYAcadId),
      })
      .subscribe({
        next: (data: any) => {
          this.respuesta = data.data;
          console.log(data);
        },
        error: error => {
          console.error('Error fetching Años Académicos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error de procesamiento',
            detail: 'No se realizo procesamiento ' + error,
          });
        },
        complete: () => {
          console.log('Request completed');
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje de sistema',
            detail: 'Operacion exitosa ',
          });
        },
      });
  }
}
