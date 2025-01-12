import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'jsonHighlight',
  standalone: true,
})
export class JsonHighlightPipe implements PipeTransform {
  transform(value: unknown): string {
    if (!value) return ''

    const json = JSON.stringify(value, null, 2) // Beautify JSON with indentation
    return json
      .replace(/"(.*?)":/g, '<span class="text-blue-500">"$1"</span>:') // Keys
      .replace(/: "(.*?)"/g, ': <span class="text-green-500">"$1"</span>') // String values
      .replace(/: (\d+)/g, ': <span class="text-purple-500">$1</span>') // Numbers
      .replace(/: (true|false)/g, ': <span class="text-red-500">$1</span>') // Booleans
      .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>') // Nulls
  }
}
