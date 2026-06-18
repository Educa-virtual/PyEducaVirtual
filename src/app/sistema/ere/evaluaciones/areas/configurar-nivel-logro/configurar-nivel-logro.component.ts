import { PrimengModule } from '@/app/primeng.module';
import { StringCasePipe } from '@/app/shared/pipes/string-case.pipe';
import { ICurso } from '@/app/sistema/aula-virtual/sub-modulos/cursos/interfaces/curso.interface';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ApiNivelLogrosService } from '../../../services/api-nivel-logros.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CdkAutofill } from '@angular/cdk/text-field';

@Component({
  selector: 'app-configurar-nivel-logro',
  standalone: true,
  imports: [PrimengModule, CdkAutofill],
  templateUrl: './configurar-nivel-logro.component.html',
  styleUrl: './configurar-nivel-logro.component.scss',
  providers: [StringCasePipe],
})
export class ConfigurarNivelLogroComponent implements OnInit {
  private nivelLogrosService = inject(ApiNivelLogrosService);
  private maxFilas: number = 4;
  visible: boolean = false;
  curso: ICurso;
  titulo: string = '';
  nivelLogros: any[] = [];
  formlogros!: FormGroup;
  errores: boolean[] = [];

  constructor(
    private stringCasePipe: StringCasePipe,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.errores = new Array(this.maxFilas).fill(false);
  }

  // dialog que dispara desde el icon trophy
  @Input() set mostrar(value: boolean) {
    this.visible = value;
  }
  get mostrar(): boolean {
    return this.visible;
  }

  @Output() mostrarChange = new EventEmitter<boolean>();

  ngOnInit() {
    this.nivelLogrosService.obtenerListaNivelLogros().subscribe(data => {
      this.nivelLogros = data;
    });
    this.formlogros = this.fb.group({
      logros: this.fb.array([this.createLogro()]),
    });
  }

  createLogro(): FormGroup {
    return this.fb.group({
      iDesde: [null],
      iHasta: [null],
      iNivelLogroId: [null],
    });
  }

  get logros(): FormArray {
    return this.formlogros.get('logros') as FormArray;
  }

  addFilaLogro() {
    this.logros.push(this.createLogro());
  }

  registrarLogros() {
    this.messageService.clear();
    if (this.formlogros.invalid) {
      this.messageService.add({
        key: 'configurarNivelLogro',
        severity: 'error',
        summary: 'Error',
        detail: 'Complete todos los campos obligatorios (resaltados en rojo)',
      });
      return;
    }
    this.nivelLogrosService
      .registrarNivelLogrosArea(this.curso, this.formlogros.value.logros)
      .subscribe({
        next: () => {
          this.messageService.add({
            key: 'configurarNivelLogro',
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Se han registrado los niveles de logro',
          });
          this.visible = false;
        },
        error: error => {
          console.error(error);
          this.messageService.add({
            key: 'configurarNivelLogro',
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  mostrarDialog(datos: { curso: ICurso }) {
    this.curso = datos.curso;
    this.formlogros.reset();

    this.titulo =
      this.stringCasePipe.transform(this.curso.cCursoNombre) +
      this.curso.cGradoAbreviacion.toString().substring(0, 1) +
      '° Grado - ' +
      this.curso.cNivelTipoNombre.toString().replace('Educación ', '');
    this.obtenerNivelLogrosArea();
    this.visible = true;
  }

  obtenerNivelLogrosArea() {
    this.nivelLogrosService.obtenerNivelLogrosArea(this.curso).subscribe({
      next: respuesta => {
        this.logros.clear();
        if (respuesta.data.length > 0) {
          respuesta.data.forEach((nivelLogro: any) => {
            const logroForm = this.fb.group({
              iDesde: [nivelLogro.nNivelLCDesde],
              iHasta: [nivelLogro.nNivelLCHasta],
              iNivelLogroId: [nivelLogro.iNivelLogroId],
            });
            this.logros.push(logroForm);
          });
        }
        for (let i = respuesta.data.length; i < this.maxFilas; i++) {
          this.addFilaLogro();
        }
        if (this.logros.length > 0 && respuesta.data.length == 0) {
          this.logros.at(0).get('iDesde')?.setValue(0);
        }
        this.validarFormulario();
      },
      error: error => {
        console.error(error);
        this.messageService.add({
          key: 'configurarNivelLogro',
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  onDialogHide(): void {
    this.mostrarChange.emit(false);
  }

  onInputBlur(elemento: 'iDesde' | 'iHasta', event: any, formIndex: number) {
    const valor = event.target.value;
    const formArray = this.formlogros.get('logros') as FormArray;
    if (valor && Number(valor) > 0) {
      if (elemento == 'iDesde') {
        if (formIndex > 0) {
          const prevFormArray = formArray.at(formIndex - 1);
          prevFormArray.get('iHasta')?.setValue(Number(valor) - 0.01);
        }
      } else if (elemento == 'iHasta') {
        if (formIndex < this.logros.length - 1) {
          const nextFormArray = formArray.at(formIndex + 1);
          nextFormArray.get('iDesde')?.setValue(Number(valor) + 0.01);
        }
      }
    }
    this.validarFormulario();
  }

  validarFormulario() {
    const formArray = this.formlogros.get('logros') as FormArray;
    formArray.controls.forEach((form: FormGroup, index: number) => {
      const iDesde = Number(form.get('iDesde')?.value);
      const iHasta = Number(form.get('iHasta')?.value);
      const iNivelLogroId = Number(form.get('iNivelLogroId')?.value);

      if (iDesde || iHasta || iNivelLogroId) {
        form?.markAsTouched();
        ['iDesde', 'iHasta', 'iNivelLogroId'].forEach(control => {
          form.get(control)?.setValidators([Validators.required]);
          form.get(control)?.updateValueAndValidity();
          form.get(control)?.markAsTouched();
          form.get(control)?.markAsDirty();
          form.get(control)?.updateValueAndValidity();
        });

        const iSumaPuntajes = Number(this.curso?.iPuntajeSum) ?? iHasta;
        if (
          iDesde >= iHasta ||
          iDesde < 0 ||
          iHasta < 0 ||
          iHasta > iSumaPuntajes ||
          iDesde > iSumaPuntajes
        ) {
          form.get('iHasta')?.setErrors({ error: true });
          this.errores[index] = true;
        } else {
          form.get('iHasta')?.setErrors(null);
          this.errores[index] = false;
        }
      } else {
        ['iDesde', 'iHasta', 'iNivelLogroId'].forEach(control => {
          form.get(control)?.setErrors(null);
          form.get(control)?.clearValidators();
          form.get(control)?.updateValueAndValidity();
        });
        form?.clearValidators();
        form?.setErrors(null);
        form?.updateValueAndValidity();
      }
    });
  }
}
