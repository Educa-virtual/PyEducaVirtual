import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ContainerPageComponent } from './container-page/container-page.component'
import { BtnLoadingComponent } from './btn-loading/btn-loading.component'

const components = [ContainerPageComponent, BtnLoadingComponent]

@NgModule({
    exports: components,
    imports: [CommonModule, FormsModule, RouterModule, components],
})
export class SharedModule {}
