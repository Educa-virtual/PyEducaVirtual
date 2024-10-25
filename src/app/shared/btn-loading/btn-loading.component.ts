import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-btn-loading',
    standalone: true,
    imports: [],
    templateUrl: './btn-loading.component.html',
    styleUrl: './btn-loading.component.scss',
})
export class BtnLoadingComponent {
    @Input() loading: boolean
    @Input() btnClass: string
    @Input() loadingText = 'Please wait'
    @Input() type: 'button' | 'submit' = 'submit'
}
