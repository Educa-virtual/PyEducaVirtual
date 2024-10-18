import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteRoutingModule } from './docente-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        DocenteRoutingModule,
        ButtonModule
    ]
})
export class DocenteModule { }
