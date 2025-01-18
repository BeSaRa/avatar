import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatChipsModule } from '@angular/material/chips'

@Component({
  selector: 'app-chips-input',
  standalone: true,
  imports: [MatChipsModule, CommonModule, FormsModule],
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.scss'],
})
export class ChipsInputComponent {
  chips: string[] = []
  inputValue = ''
  placeholder = 'Add a tag...'
  error = ''

  addChip(): void {
    const value = this.inputValue.trim()
    if (!value) {
      this.error = 'Tag cannot be empty.'
      return
    }

    if (this.chips.includes(value)) {
      this.error = 'Tag already exists.'
      return
    }

    this.chips.push(value)
    this.inputValue = ''
    this.error = ''
  }

  removeChip(index: number): void {
    this.chips.splice(index, 1)
  }
}
