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
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

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

  //Para importar imagen
  typesFiles = {
    file: true,
    url: false,
    youtube: false,
    repository: false,
    image: false,
  };
  filesUrl = [];
  ruta_imagen: string;

  private _confirmService = inject(ConfirmationModalService);
  private backendApi = environment.backendApi;
  private http = inject(HttpClient);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    public query: GeneralService,
    private store: LocalStoreService
  ) {
    this.anioEscolar = this.store.getItem('dremoYear');
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.')
    this.perfil = this.store.getItem('dremoPerfil');

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
    {
      labelTooltip: 'Actualizar información de la Institución',
      text: 'Actualizar datos',
      icon: 'pi pi-save',
      accion: 'update',
      class: 'p-button-primary',
    },
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
          console.log(this.registro);
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
          // console.log('Request completed')
          this.form.controls['cIieeRUC'].setValue(this.registro[0].cIieeRUC);
          this.form.controls['cIieeRslCreacion'].setValue(this.registro[0].cIieeRslCreacion);
          this.form.controls['cIieeDireccion'].setValue(this.registro[0].cIieeDireccion);
          this.form.controls['cIieeUrlReglamentoInterno'].setValue(
            this.registro[0].cIieeUrlReglamentoInterno
          ),
            (this.filesUrl = []);
          if ((this.registro[0].cIieeUrlReglamentoInterno ?? '').length > 0) {
            this.filesUrl.push({
              name: 'Reglamento interno cargado',
              ruta: this.registro[0].cIieeUrlReglamentoInterno,
            });
          }
        },
      });
  }
  btnItem(elemento) {
    const { accion } = elemento;
    switch (accion) {
      case 'update':
        if (this.form.valid) {
          const params = {
            esquema: 'acad',
            tabla: 'institucion_educativas',
            json: JSON.stringify({
              cIieeRslCreacion: this.form.value.cIieeRslCreacion,
              cIieeDireccion: this.form.value.cIieeDireccion,
              cIieeUrlReglamentoInterno: this.form.value.cIieeUrlReglamentoInterno,
            }),
            campo: 'iIieeId',
            condicion: this.iIieeId,
          };

          console.log(params, 'parametros dem uodate');
          this.query.updateAcademico(params).subscribe({
            next: (data: any) => {
              console.log(data.data);
            },
            error: error => {
              console.log(error, 'error al actualizar');
              // if(error && error.message){
              //   //  console.error(error?.message || 'Error en la respuesta del servicio');
              // }
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

  async onUploadChange(evt: any, tipo: any) {
    alert(this.ruta_imagen);
    const file = evt.target.files[0];
    if (file) {
      const dataFile = await this.objectToFormData({
        file: file,
        nameFile: this.ruta_imagen, //ruta de imagen
      });
      this.http
        .post(`${this.backendApi}/general/subir-archivo?` + 'skipSuccessMessage=true', dataFile)
        .pipe(
          map((event: any) => {
            if (event.validated) {
              switch (tipo) {
                case 'reglamento':
                  this.filesUrl = [];
                  this.filesUrl.push({
                    name: file.name,
                    ruta: event.data,
                  });
                  this.form.get('cIieeUrlReglamentoInterno')?.setValue(this.filesUrl[0].ruta);
                  //this.guardarItinerario();
                  break;
              }
            }
          }),
          catchError((error: any) => {
            return throwError(error.error.message);
          })
        )
        .toPromise();
    }
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

  openLink(item) {
    if (!item) return;
    const ruta = environment.backend + '/' + item;
    window.open(ruta, '_blank');
  }
}
