import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { HttpEvent } from '@angular/common/http';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FileUpload } from 'primeng/fileupload';

interface UploadEvent {
  originalEvent: HttpEvent<any> | Event;
  files: File[];
}

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [PrimengModule],
  providers: [MessageService],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: FileUpload;
  form: FormGroup;
  iConfigId: number = null;
  iYAcadId: number = null;
  btnNuevo: boolean;

  perfil: any;
  configuracion: any = {};

  archivoSeleccionado: File | null = null;
  hay_archivo: boolean = false;

  estados_configuracion: Array<object>;

  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private store: LocalStoreService,
    private confirmService: ConfirmationModalService,
    private route: ActivatedRoute
  ) {
    this.stepService.setActiveIndex(0);
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iConfigId: [null],
        iYAcadId: [null],
        cYAcadNombre: [{ value: '', disabled: true }],
        cServEdNombre: [{ value: '', disabled: true }],
        cNivelTipoNombre: [{ value: '', disabled: true }],
        cNivelNombre: [{ value: '', disabled: true }],
        iServEdId: [null],
        cConfigDescripcion: [null],
        iEstadoConfigId: [null, Validators.required],
        cConfigNroRslAprobacion: [null],
        cConfigUrlRslAprobacion: [null],
        bConfigEsBilingue: [null],
        archivo: [null],
      });
    } catch (error) {
      console.error(error, 'Error al inicializar el formulario');
    }
    this.stepService
      .crearConfiguracion({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iConfigId: this.iConfigId,
      })
      .subscribe((data: any) => {
        this.estados_configuracion = this.stepService.getEstadosConfiguracion(
          data?.estados_configuracion
        );
      });

    this.verConfiguracion();
  }

  verConfiguracion() {
    this.stepService
      .verConfiguracion({
        iConfigId: this.iConfigId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormConfiguracion(data.data);
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  setFormConfiguracion(data: any) {
    this.form.reset();
    this.form.patchValue(data);
    const iEstadoConfigId = data.iEstadoConfigId ? Number(data.iEstadoConfigId) : null;
    this.form.get('iEstadoConfigId').setValue(iEstadoConfigId);
    this.hay_archivo = data?.cConfigUrlRslAprobacion ? true : false;
  }

  handleArchivo(event: any) {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    if (file) {
      this.archivoSeleccionado = file;
      this.form.get('archivo').setValue(file);
    } else {
      this.hay_archivo = false;
      this.archivoSeleccionado = null;
      this.form.get('cConfigUrlRslAprobacion').setValue(null);
      this.form.get('archivo').setValue(null);
    }
  }

  descargarArchivo(item: any = null, event = null) {
    event?.preventDefault();
    if (!item) {
      item = {
        iConfigId: this.iConfigId,
        iYAcadId: this.iYAcadId,
        cConfigUrlRslAprobacion: this.form.value.cConfigUrlRslAprobacion,
      };
    }
    this.stepService.descargarAprobacion(item).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: error => {
        console.error('Error descargando archivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message ?? 'No se pudo descargar el archivo',
        });
      },
    });
  }

  confirmarCambios() {
    this.confirmService.openConfiSave({
      header: 'Confirmación',
      message: '¿Realmente desea actualizar la configuración?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.actualizarConfiguracion();
      },
    });
  }

  actualizarConfiguracion() {
    const formData: FormData = new FormData();
    formData.append('iCredEntPerfId', this.perfil.iCredEntPerfId);
    formData.append('iConfigId', this.form.value.iConfigId);
    formData.append('iEstadoConfigId', this.form.value.iEstadoConfigId);
    formData.append('cConfigNroRslAprobacion', this.form.value.cConfigNroRslAprobacion);
    formData.append('cConfigUrlRslAprobacion', this.form.value.cConfigUrlRslAprobacion);
    formData.append('cConfigDescripcion', this.form.value.cConfigDescripcion);
    formData.append('bConfigEsBilingue', this.form.value.bConfigEsBilingue);
    if (this.archivoSeleccionado) {
      formData.append('archivo', this.form.value.archivo);
    }

    this.stepService.actualizarConfiguracion(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Configuración actualizada',
        });
        this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/academico`]);
      },
      error: error => {
        console.error('Error guardando configuracion:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
