import { Component, inject } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { GlobalLoaderServiceService } from './global-loader-service/global-loader-service.service'
import { Observable } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
    selector: 'app-global-loader',
    standalone: true,
    imports: [ProgressSpinnerModule, DialogModule, AsyncPipe],
    templateUrl: './global-loader.component.html',
    styleUrl: './global-loader.component.scss',
})
export class GlobalLoaderComponent {
    private _loaderService = inject(GlobalLoaderServiceService)
    public isVisible$: Observable<boolean> = this._loaderService.loading$
}
