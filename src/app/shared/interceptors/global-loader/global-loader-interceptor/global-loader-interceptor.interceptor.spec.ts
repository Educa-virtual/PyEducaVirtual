import { TestBed } from '@angular/core/testing'
import { HttpInterceptorFn } from '@angular/common/http'

import { globalLoaderInterceptorInterceptor } from './global-loader-interceptor.interceptor'

describe('globalLoaderInterceptorInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() =>
            globalLoaderInterceptorInterceptor(req, next)
        )

    beforeEach(() => {
        TestBed.configureTestingModule({})
    })

    it('should be created', () => {
        expect(interceptor).toBeTruthy()
    })
})
