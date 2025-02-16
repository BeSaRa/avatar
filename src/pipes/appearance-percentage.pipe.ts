import { Instance } from '@/contracts/insights'
import { calculateAppearancePercentage } from '@/utils/insights.utils'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'appearancePercentage',
  standalone: true,
})
export class AppearancePercentagePipe implements PipeTransform {
  transform(instances: Instance[], videoLength: number) {
    return calculateAppearancePercentage(instances, videoLength)
  }
}
