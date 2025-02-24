import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '00:00:00'

    const parts = value.split(':')
    const seconds = parseFloat(parts[2]) // Convert to float to round milliseconds
    const roundedSeconds = Math.round(seconds) // Round to the nearest whole number

    const minutes = parseInt(parts[1])
    const hours = parseInt(parts[0])

    // Ensure two-digit formatting
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = roundedSeconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }
}
