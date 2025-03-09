import { CommonModule } from '@angular/common'
import { Component, input } from '@angular/core'

@Component({
  selector: 'app-spinner-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-loader.component.html',
  styleUrl: './spinner-loader.component.scss',
})
export class SpinnerLoaderComponent {
  width = input.required<number>()
  borderWidth = input.required<number>()
  color = input.required<string>()
}
