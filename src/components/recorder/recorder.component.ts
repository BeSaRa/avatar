import { Component, signal } from '@angular/core'
import { NgClass } from '@angular/common'

@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [NgClass],
  templateUrl: './recorder.component.html',
  styleUrl: './recorder.component.scss',
})
export class RecorderComponent {
  isRecording = signal(false)

  toggleRecording() {
    this.isRecording.update(value => !value)
  }
}
