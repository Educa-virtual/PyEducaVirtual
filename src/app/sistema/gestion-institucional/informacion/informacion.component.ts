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

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    public query: GeneralService,
    private store: LocalStoreService
  ) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.')
    this.perfil = this.store.getItem('dremoPerfil');
    console.log(this.perfil);
    //const iNivelTipoId = this.perfil.iNivelTipoId
    this.logo = this.perfil.cIieeLogo || 'assets/images/logo-proyecto.svg'; // cambia la imagen si esta vacio
    this.iIieeId = this.perfil.iIieeId;

    try {
      this.form = this.fb.group({
        cIieeNombre: [{ value: this.perfil.cIieeNombre || '', disabled: true }],
        cIieeRUC: [{ value: this.perfil.cIieeRUC || '', disabled: true }],
        cIieeRslCreacion: [''],
        cIieeDireccion: [''],
      });
    } catch (error) {
      //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
    }

    console.log(this.perfil);
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
}
