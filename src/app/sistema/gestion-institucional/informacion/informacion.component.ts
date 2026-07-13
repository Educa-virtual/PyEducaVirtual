import { Component, inject, OnInit } from '@angular/core';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
// import { catchError, map, throwError } from 'rxjs';
import { InformacionService } from './service/informacion.service';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [ContainerPageComponent, ReactiveFormsModule, FormsModule, PrimengModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.scss',
  providers: [MessageService],
})
export class InformacionComponent implements OnInit {
  form: FormGroup;

  perfil: any;
  iIieeId: number;
  registro: any;
  logo: any;
  anioEscolar: string;
  iYAcadId: string;
  escudo: any;

  //Para importar imagen
  typesFiles = {
    file: true,
    url: false,
    youtube: false,
    repository: false,
    image: false,
  };
  filesUrl: any;
  ruta_imagen: string;

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    public query: GeneralService,
    private store: LocalStoreService,
    private informacionService: InformacionService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.anioEscolar = this.store.getItem('dremoYear');
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.')
    //const iNivelTipoId = this.perfil.iNivelTipoId
    this.logo = this.perfil.cIieeLogo || 'assets/images/logo-proyecto.svg'; // cambia la imagen si esta vacio
    this.iIieeId = this.perfil.iIieeId;
    const codigoModular = this.perfil.cIieeCodigoModular;
    const cYAcadNombre = this.anioEscolar;

    this.ruta_imagen = String(cYAcadNombre + '/' + codigoModular + '/reglamento');

    try {
      this.form = this.fb.group({
        cIieeNombre: [{ value: this.perfil.cIieeNombre || '', disabled: true }],
        cIieeRUC: [{ value: this.perfil.cIieeRUC || '', disabled: true }],
        cIieeRslCreacion: [''],
        cIieeDireccion: [''],
        cIieeUrlReglamentoInterno: [''],
        reglamentoInterno: [''],
      });
    } catch (error) {
      //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
    }

    this.getInstitucion();
  }

  accionesPrincipal: IActionContainer[] = [
    // {
    //   labelTooltip: 'Actualizar información de la Institución',
    //   text: 'Actualizar datos',
    //   icon: 'pi pi-save',
    //   accion: 'update',
    //   class: 'p-button-primary',
    // },
  ];
  getInstitucion() {
    const params = ' iIieeId = ' + this.iIieeId;
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'institucion_educativas',
        campos: '*',
        condicion: params,
      })
      .subscribe({
        next: (data: any) => {
          this.registro = data.data;
        },
        error: error => {
          console.error('Error fetching institucion educativa:', error);
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje',
            detail: 'Error en ejecución',
          });
        },
        complete: () => {
          this.form.controls['cIieeRUC'].setValue(this.registro[0].cIieeRUC);
          this.form.controls['cIieeRslCreacion'].setValue(this.registro[0].cIieeRslCreacion);
          this.form.controls['cIieeDireccion'].setValue(this.registro[0].cIieeDireccion);
          this.filesUrl = this.registro[0].cIieeUrlReglamentoInterno
            ? JSON.parse(this.registro[0].cIieeUrlReglamentoInterno)
            : null;
        },
      });
  }

  obtenerArchivo(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.pathname.split('/').filter(Boolean).pop() || '';
    } catch {
      return url.split('/').pop() || '';
    }
  }

  btnItem(elemento) {
    //const { accion } = elemento;
    switch (elemento) {
      case 'update':
        if (this.form.valid) {
          const params = {
            esquema: 'acad',
            tabla: 'institucion_educativas',
            json: JSON.stringify({
              cIieeRslCreacion: this.form.value.cIieeRslCreacion,
              cIieeDireccion: this.form.value.cIieeDireccion,
            }),
            campo: 'iIieeId',
            condicion: this.iIieeId,
          };

          this.query.updateAcademico(params).subscribe({
            next: () => {},
            error: error => {
              console.log(error, 'error al actualizar');
            },
            complete: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });
            },
          });
        } else {
          console.log('Formulario no válido', this.form.invalid);
        }
        break;
      default:
        break;
    }
  }

  confirmar(elemento: any) {
    // const cant = this.selectRowData.length()
    this._confirmService.openConfiSave({
      header: 'Advertencia de procesamiento',
      message: '¿Desea guardar los cambios?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.btnItem(elemento);
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

  objectToFormData(obj: any) {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '') {
        formData.append(key, obj[key]);
      }
    });

    return formData;
  }

  descargarArchivo(item) {
    const enviar = new FormData();
    enviar.append('ruta', item);

    this.informacionService.recibirMultimedia(enviar).subscribe({
      next: async (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  subirImagen(event: any, id: any) {
    const archivo = event.files[0];
    this.escudo = archivo;
    id.clear();
  }
  guardarEscudo() {
    const enviar = new FormData();
    enviar.append('escudo', this.escudo);
    enviar.append('iYAcadId', this.iYAcadId);
    enviar.append('iCredEntPerfId', this.perfil.iCredEntPerfId);

    this.informacionService.subirImagen(enviar).subscribe({
      next: (respuesta: any) => {
        const datos = respuesta.data.resultado;
        if (datos) {
          this.logo = datos;
          this.perfil.cIieeLogo = datos;
          this.store.setItem('dremoPerfil', this.perfil);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Error al subir el logo',
          });
        }
      },
      complete: () => {
        window.location.reload();
      },
    });
  }

  subirReglamento(evt: any) {
    const documento = evt.target.files[0];
    if (documento) {
      const enviar = new FormData();
      enviar.append('documento', documento);
      enviar.append('dremoYear', this.anioEscolar);
      enviar.append('cIieeCodigoModular', this.perfil.cIieeCodigoModular);
      enviar.append('iPersId', this.perfil.iPersId);
      enviar.append('iCredEntPerfId', this.perfil.iCredEntPerfId);
      enviar.append('iYAcadId', this.iYAcadId);

      this.informacionService.subirDcoumento(enviar).subscribe({
        next: (respuesta: any) => {
          const nombre = respuesta.data.nombre;
          const enlace = respuesta.data.enlace;

          this.filesUrl = {
            nombre: nombre,
            enlace: enlace,
          };
        },
        error: respuesta => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: respuesta.error.message,
          });
        },
      });
    }
  }
}
