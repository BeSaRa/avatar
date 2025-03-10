import { FAQContract } from '@/contracts/FAQ-contract'
import { AsyncPipe } from '@angular/common'
import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FAQComponent {
  questions = input.required<FAQContract[]>()
  selectedQuestion = output<string>()
}
