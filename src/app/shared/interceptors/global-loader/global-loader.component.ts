import { Component, inject } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { GlobalLoaderServiceService } from './global-loader-service/global-loader-service.service'
import { Observable } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
    selector: 'app-global-loader',
    standalone: true,
    imports: [ProgressSpinnerModule, DialogModule, AsyncPipe],
    templateUrl: './global-loader.component.html',
    styleUrl: './global-loader.component.scss',
    animations: [
        trigger('fadeInOut', [
            state(
                'void',
                style({
                    opacity: 0,
                })
            ),
            transition('void <=> *', animate(300)),
        ]),
    ],
})
export class GlobalLoaderComponent {
    private _loaderService = inject(GlobalLoaderServiceService)
    public isVisible$: Observable<boolean> = this._loaderService.loading$
}
