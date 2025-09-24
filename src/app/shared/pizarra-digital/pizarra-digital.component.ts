import { PrimengModule } from '@/app/primeng.module';
import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  forwardRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import Konva from 'konva';
import { toSVG } from 'src/app/shared/utils/konva-to-svg';

type Tool = 'pen' | 'rect' | 'circle' | 'eraser' | 'select' | 'text';

@Component({
  selector: 'app-pizarra-digital',
  standalone: true,
  imports: [FormsModule, PrimengModule],
  templateUrl: './pizarra-digital.component.html',
  styleUrls: ['./pizarra-digital.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PizarraDigitalComponent),
      multi: true,
    },
  ],
})
export class PizarraDigitalComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('stageHost', { static: true }) stageHost!: ElementRef<HTMLDivElement>;
  @Input() id: string | number;
  @Input() svgUrl?: string;

  @Output() exportImageSvg = new EventEmitter<{ svg: string; id: string | number }>();

  private stage!: Konva.Stage;
  private gridLayer!: Konva.Layer; // cuadrícula
  private backgroundLayer!: Konva.Layer; // imagen inicial (pizarra previa)
  private drawLayer!: Konva.Layer; // lo que dibuja el usuario

  private currentLine?: Konva.Line;
  private currentShape?: Konva.Shape;
  private eraserCursor?: Konva.Circle;
  private currentTextarea?: HTMLTextAreaElement;
  tr!: Konva.Transformer;

  private isDrawing = false;
  private startPos = { x: 0, y: 0 };

  tool: Tool = 'pen';
  strokeColor = '#000000';
  strokeWidth = 3;
  textInput = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    const container = this.stageHost.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.stage = new Konva.Stage({
      container,
      width,
      height,
      draggable: false,
    });

    // 1. cuadrícula
    this.gridLayer = new Konva.Layer({ listening: false, name: 'gridLayer' });

    this.stage.add(this.gridLayer);
    this.drawGrid();

    // 2. capa de fondo (imagen previa)
    this.backgroundLayer = new Konva.Layer();
    this.stage.add(this.backgroundLayer);

    this.tr = new Konva.Transformer({
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });

    // 3. capa de dibujo del usuario
    this.drawLayer = new Konva.Layer();
    this.stage.add(this.drawLayer);

    this.attachEvents();

    // cargar imagen inicial si existe
    if (this.svgUrl) {
      Konva.Image.fromURL(this.svgUrl, imageNode => {
        imageNode.setAttrs({
          x: 0,
          y: 0,
          width: this.stage.width(),
          height: this.stage.height(),
          draggable: true, // permitir arrastrar
        });
        this.backgroundLayer.add(imageNode);
        this.enableEditing(imageNode);
        this.backgroundLayer.draw();
      });
    }

    // edición de texto con doble click
    this.stage.on('dblclick dbltap', e => {
      const shape = e.target as Konva.Shape;
      if (shape && shape.getClassName && shape.getClassName() === 'Text') {
        const textNode = shape as Konva.Text;
        textNode.draggable(false);
        this.openTextareaForTextNode(textNode);
        this.currentTextarea?.addEventListener('blur', () => {
          textNode.draggable(this.tool === 'select');
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
      document.body.removeChild(this.currentTextarea);
      this.currentTextarea = undefined;
    }
    this.stage.destroy();
  }

  // --- ControlValueAccessor ---
  writeValue(value: any): void {
    if (!value) return;
    try {
      const json = typeof value === 'string' ? JSON.parse(value) : value;
      this.drawLayer.destroyChildren();

      const nodes = Konva.Node.create(json, this.stage.container() as HTMLElement);
      if (nodes instanceof Konva.Stage || nodes instanceof Konva.Layer) {
        nodes.getChildren().forEach((child: any) => {
          this.drawLayer.add(child);
          this.enableEditing(child);
        });
      }

      this.drawLayer.draw();
      this.setTool(this.tool);
    } catch (e) {
      console.error('Error restaurando dibujo:', e);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (!this.stage) return;
    this.stage.listening(!isDisabled);
  }

  private propagateChanges() {
    const json = this.drawLayer.toJSON();
    this.onChange(json);
  }

  // --- Herramientas ---
  setTool(t: Tool) {
    this.tool = t;

    // recorrer nodos de ambas capas (imagen de fondo + dibujos)
    const allNodes = [...this.backgroundLayer.getChildren(), ...this.drawLayer.getChildren()];

    allNodes.forEach(node => {
      switch (t) {
        case 'select':
          node.draggable(true);
          node.off('click'); // limpiar handlers previos
          node.on('click', () => {
            this.tr.nodes([node]);
            this.drawLayer.draw();
          });
          break;

        case 'eraser':
          node.draggable(false);
          node.off('click');
          node.on('click', () => {
            node.destroy();
            this.drawLayer.draw();
            this.backgroundLayer.draw();
          });
          break;

        default:
          // para pen, line, rect, circle...
          node.draggable(false);
          node.off('click');
          break;
      }
    });

    // limpiar selección del transformer si no está en modo select
    if (t !== 'select') {
      this.tr.nodes([]);
      this.drawLayer.draw();
      this.backgroundLayer.draw();
    }
  }

  private attachEvents() {
    this.stage.on('mousedown touchstart', () => this.onPointerDown());
    this.stage.on('mousemove touchmove', () => this.onPointerMove());
    this.stage.on('mouseup touchend', () => {
      this.onPointerUp();
      this.propagateChanges();
    });
  }

  private getPointerPos() {
    return this.stage.getPointerPosition() || { x: 0, y: 0 };
  }

  private onPointerDown() {
    const pos = this.stage.getPointerPosition();
    if (!pos) return;
    this.isDrawing = true;
    this.startPos = pos;

    if (this.tool === 'pen' || this.tool === 'eraser') {
      const color = this.tool === 'eraser' ? '#ffffff' : this.strokeColor;
      const width = this.tool === 'eraser' ? this.strokeWidth * 4 : this.strokeWidth;

      this.currentLine = new Konva.Line({
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth: width,
        lineCap: 'round',
        lineJoin: 'round',
        globalCompositeOperation: this.tool === 'eraser' ? 'destination-out' : undefined,
      });
      this.drawLayer.add(this.currentLine);
    } else if (this.tool === 'rect') {
      this.currentShape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
      this.drawLayer.add(this.currentShape);
    } else if (this.tool === 'circle') {
      this.currentShape = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
      this.drawLayer.add(this.currentShape);
    } else if (this.tool === 'text') {
      const initialText = this.textInput?.trim() ? this.textInput : '';
      const textNode = new Konva.Text({
        x: pos.x,
        y: pos.y,
        text: initialText,
        fontSize: 20,
        fill: this.strokeColor,
        draggable: true,
      });
      this.drawLayer.add(textNode);
      this.drawLayer.draw();
      this.openTextareaForTextNode(textNode, pos);
      this.isDrawing = false;
    }

    this.drawLayer.draw();
  }

  private onPointerMove() {
    if (!this.isDrawing) return;
    const pos = this.getPointerPos();

    if (this.tool === 'pen' || this.tool === 'eraser') {
      if (!this.currentLine) return;
      this.currentLine.points(this.currentLine.points().concat([pos.x, pos.y]));
    } else if (this.tool === 'rect' && this.currentShape instanceof Konva.Rect) {
      const x = Math.min(this.startPos.x, pos.x);
      const y = Math.min(this.startPos.y, pos.y);
      this.currentShape.position({ x, y });
      this.currentShape.width(Math.abs(pos.x - this.startPos.x));
      this.currentShape.height(Math.abs(pos.y - this.startPos.y));
    } else if (this.tool === 'circle' && this.currentShape instanceof Konva.Circle) {
      const dx = pos.x - this.startPos.x;
      const dy = pos.y - this.startPos.y;
      this.currentShape.radius(Math.sqrt(dx * dx + dy * dy));
    }
    this.drawLayer.batchDraw();
  }

  private onPointerUp() {
    this.isDrawing = false;
    this.currentLine = undefined;
    this.currentShape = undefined;
  }

  clearCanvas() {
    this.drawLayer.destroyChildren();
    this.backgroundLayer.destroyChildren();
    this.stage.draw();
  }

  // --- CUADRÍCULA ---
  private drawGrid() {
    const width = this.stage.width();
    const height = this.stage.height();
    const gridSize = 20;

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: '#ffffff',
      listening: false,
    });
    this.gridLayer.add(background);

    for (let i = 0; i < Math.ceil(width / gridSize); i++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [i * gridSize, 0, i * gridSize, height],
          stroke: '#eee',
          strokeWidth: 1,
          listening: false,
        })
      );
    }
    for (let j = 0; j < Math.ceil(height / gridSize); j++) {
      this.gridLayer.add(
        new Konva.Line({
          points: [0, j * gridSize, width, j * gridSize],
          stroke: '#eee',
          strokeWidth: 1,
          listening: false,
        })
      );
    }
    this.gridLayer.draw();
  }

  // --- IMPORTAR IMAGEN ---
  onUploadSVG(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target?.result as string;
      Konva.Image.fromURL(url, imageNode => {
        imageNode.setAttrs({ x: 50, y: 50, width: 200, height: 200, draggable: true });
        this.backgroundLayer.add(imageNode);
        this.backgroundLayer.draw();
      });
    };
    reader.readAsDataURL(file);
  }

  // --- EXPORTAR SVG (imagen + dibujos) ---
  exportarSVG() {
    if (!this.stage) return;

    // Recorremos todos los Image en la capa de fondo
    this.backgroundLayer.getChildren().forEach(node => {
      if (node instanceof Konva.Image) {
        const image = node.image();
        if (image instanceof HTMLImageElement) {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;

          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(image, 0, 0);

          const dataURL = canvas.toDataURL();
          node.setAttr('imageSrc', dataURL);
        }
      }
    });

    const svg = toSVG(this.stage); // ahora sí tendrá la <image> embebida
    this.exportImageSvg.emit({ svg, id: this.id });
  }

  private applyToolToNode(node: any) {
    if (node instanceof Konva.Group) {
      node.getChildren().forEach((child: any) => this.applyToolToNode(child));
      node.draggable(this.tool === 'select');
    } else if (node instanceof Konva.Text || node instanceof Konva.Shape) {
      node.draggable(this.tool === 'select');
    }
  }

  private enableEditing(node: Konva.Node) {
    if (node instanceof Konva.Text) {
      node.draggable(this.tool === 'select');
      node.off('dblclick dbltap');
      node.on('dblclick dbltap', () => {
        node.draggable(false);
        this.openTextareaForTextNode(node as Konva.Text);
        this.currentTextarea?.addEventListener('blur', () => {
          node.draggable(this.tool === 'select');
        });
      });
    } else if (node instanceof Konva.Group) {
      node.getChildren().forEach(child => this.enableEditing(child));
      node.draggable(this.tool === 'select');
    } else if (node instanceof Konva.Shape) {
      node.draggable(this.tool === 'select');
    }
  }

  // --- helpers para texto in-place ---
  private openTextareaForTextNode(textNode: Konva.Text, stagePos?: { x: number; y: number }) {
    if (this.currentTextarea) {
      try {
        document.body.removeChild(this.currentTextarea);
      } catch {
        /* empty */
      }
      this.currentTextarea = undefined;
    }

    const pos = stagePos ?? { x: textNode.x(), y: textNode.y() };
    const stageBox = this.stage.container().getBoundingClientRect();
    const areaX = stageBox.left + window.scrollX + pos.x;
    const areaY = stageBox.top + window.scrollY + pos.y;

    const textarea = document.createElement('textarea');
    textarea.value = textNode.text() || '';
    textarea.style.position = 'absolute';
    textarea.style.top = areaY + 'px';
    textarea.style.left = areaX + 'px';
    textarea.style.minWidth = '120px';
    textarea.style.width = '220px';
    textarea.style.minHeight = '24px';
    textarea.style.fontSize = (textNode.fontSize() || 20) + 'px';
    textarea.style.border = '1px solid rgba(0,0,0,0.2)';
    textarea.style.padding = '4px';
    textarea.style.zIndex = '999999';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.color = (textNode.fill() as string) || '#000';
    textarea.style.fontFamily = (textNode.fontFamily && textNode.fontFamily()) || 'inherit';

    textarea.addEventListener('mousedown', e => e.stopPropagation());
    textarea.addEventListener('touchstart', e => e.stopPropagation());

    document.body.appendChild(textarea);
    this.currentTextarea = textarea;

    setTimeout(() => {
      textarea.focus();
      textarea.select();
    }, 0);

    const finish = () => {
      const newText = textarea.value;
      if (!newText.trim()) {
        textNode.destroy();
      } else {
        textNode.text(newText);
        textNode.fill(this.strokeColor);
      }
      this.drawLayer.draw();
      if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
        document.body.removeChild(this.currentTextarea);
      }
      this.currentTextarea = undefined;
    };

    const cancel = () => {
      if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
        document.body.removeChild(this.currentTextarea);
      }
      this.currentTextarea = undefined;
      if (!textNode.text()) {
        textNode.destroy();
        this.drawLayer.draw();
      }
    };

    const keyHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        finish();
      } else if (ev.key === 'Escape') {
        cancel();
      }
    };

    textarea.addEventListener('keydown', keyHandler);
    textarea.addEventListener('blur', finish);
  }
}
