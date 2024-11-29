import {
    Directive,
    ElementRef,
    Host,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { Editor } from 'primeng/editor'

@Directive({
    selector: '[appEditorOnlyView]',
    standalone: true,
})
export class EditorOnlyViewDirective implements OnChanges {
    @Input() showToolbar = false
    private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef)

    constructor(@Host() private pEditor: Editor) {
        this.updateEditorModules()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['showToolbar']) {
            this.updateEditorModules()
        }
    }

    private updateEditorModules(): void {
        const editorModules = {
            toolbar: this.showToolbar,
        }

        if (this.pEditor) {
            this.pEditor.readonly = true
            this.pEditor.modules = editorModules
        }
    }
}
