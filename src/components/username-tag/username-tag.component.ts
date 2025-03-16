import { STORAGE_ITEMS } from '@/constants/storage-items'
import { Component, signal } from '@angular/core'

@Component({
  selector: 'app-username-tag',
  standalone: true,
  imports: [],
  templateUrl: './username-tag.component.html',
  styleUrl: './username-tag.component.scss',
})
export class UsernameTagComponent {
  username = signal(localStorage.getItem(STORAGE_ITEMS.USERNAME) ?? '')
}
