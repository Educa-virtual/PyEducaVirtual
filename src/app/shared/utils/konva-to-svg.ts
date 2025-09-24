import Konva from 'konva';

export function toSVG(stage: Konva.Stage): string {
  const width = stage.width();
  const height = stage.height();

  let svgContent = '';

  // ⛔ ignorar todo lo que esté en gridLayer
  stage
    .find(node => node.getLayer()?.getAttr('name') !== 'gridLayer')
    .forEach(node => {
      if (node instanceof Konva.Rect) {
        svgContent += `<rect x="${node.x()}" y="${node.y()}" width="${node.width()}" height="${node.height()}" 
        stroke="${node.stroke() || 'none'}" stroke-width="${node.strokeWidth()}" fill="${node.fill() || 'none'}" />`;
      }

      if (node instanceof Konva.Circle) {
        svgContent += `<circle cx="${node.x()}" cy="${node.y()}" r="${node.radius()}" 
        stroke="${node.stroke() || 'none'}" stroke-width="${node.strokeWidth()}" fill="${node.fill() || 'none'}" />`;
      }

      if (node instanceof Konva.Line) {
        if (node.hasName('grid')) return; // seguridad extra
        const points = node.points().join(' ');
        svgContent += `<polyline points="${points}" 
        stroke="${node.stroke() || 'black'}" stroke-width="${node.strokeWidth()}" fill="none" 
        stroke-linecap="round" stroke-linejoin="round" />`;
      }

      if (node instanceof Konva.Text) {
        svgContent += `<text x="${node.x()}" y="${node.y() + node.fontSize()}" 
        font-size="${node.fontSize()}" font-family="${node.fontFamily()}" 
        fill="${node.fill() || 'black'}">${escapeXML(node.text())}</text>`;
      }

      if (node instanceof Konva.Image) {
        const img = node.image();
        if (img instanceof HTMLImageElement) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL();

          svgContent += `<image x="${node.x()}" y="${node.y()}" width="${node.width()}" height="${node.height()}" href="${dataURL}" />`;
        }
      }
    });

  return `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${width}" height="${height}"
         viewBox="0 0 ${width} ${height}">
      ${svgContent}
    </svg>
  `;
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
