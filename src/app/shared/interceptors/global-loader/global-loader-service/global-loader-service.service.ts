import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class GlobalLoaderServiceService {
    private loading = new BehaviorSubject<boolean>(false)
    public loading$ = this.loading.asObservable()
    private timer: ReturnType<typeof setTimeout> | null = null
    private loadingRequests = 0

    constructor() {}

    show() {
        this.loadingRequests++
        if (this.loadingRequests == 1) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.loading.next(true)
        }
    }

    hide() {
        this.loadingRequests--
        if (this.loadingRequests === 0) {
            this.timer = setTimeout(() => {
                this.loading.next(false)
            }, 300)
        }
    }
}
