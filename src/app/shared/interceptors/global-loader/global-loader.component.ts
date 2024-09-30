import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { GlobalLoaderServiceService } from './global-loader-service/global-loader-service.service'
import { Observable } from 'rxjs'
import { AsyncPipe, NgIf } from '@angular/common'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
    selector: 'app-global-loader',
    standalone: true,
    imports: [ProgressSpinnerModule, DialogModule, AsyncPipe, NgIf],
    templateUrl: './global-loader.component.html',
    styleUrl: './global-loader.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,

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
export class GlobalLoaderComponent implements OnInit {
    private _loaderService = inject(GlobalLoaderServiceService)
    public isVisible$: Observable<boolean>

    ngOnInit() {
        this.isVisible$ = this._loaderService.loading$
    }
}
