/* eslint-disable max-len */
import { Component, computed, inject, input } from '@angular/core'
import { SVG_ICONS } from '@/constants/svg-icons'
import { CommonModule } from '@angular/common'
import { SanitizerPipe } from '@/pipes/sanitizer.pipe'
import { RouterModule } from '@angular/router'
import { LocalService } from '@/services/local.service'
import { CardColor } from '@/constants/card-color-type'

@Component({
  selector: 'app-nav-card',
  standalone: true,
  imports: [CommonModule, RouterModule, SanitizerPipe],
  templateUrl: './nav-card.component.html',
  styleUrl: './nav-card.component.scss',
})
export class NavCardComponent {
  color = input<CardColor>('primary')

  icon = input.required<keyof typeof SVG_ICONS>()
  title = input.required<string>()
  description = input.required<string>()
  link = input.required<string>()
  shape = input.required<'vertical' | 'horizontal'>()

  lang = inject(LocalService)

  isVertical = computed(() => this.shape() === 'vertical')
  isOutline = computed(() => this.color().includes('outline'))

  readonly svgIcons = SVG_ICONS

  colorClasses = {
    primary:
      'bg-primary/90 border-primary/90 hover:border-primary-600/90 hover:bg-primary-600/90 [&_.arrow]:bg-primary-600/90 text-primary-contrast [&_.icon]:text-primary-contrast/70 [&_.desc]:text-primary-contrast/70',
    accent:
      'bg-accent/90 border-accent/90 hover:border-accent-600/90 hover:bg-accent-600/90 [&_.arrow]:bg-accent-600/90 text-accent-contrast [&_.icon]:text-accent-contrast/70 [&_.desc]:text-accent-contrast/70',
    secondary:
      'bg-secondary/90 border-secondary/90 hover:border-secondary-600/90 hover:bg-secondary-600/90 [&_.arrow]:bg-secondary-600/90 text-secondary-contrast [&_.icon]:text-secondary-contrast/70 [&_.desc]:text-secondary-contrast/70',
    tertiary:
      'bg-tertiary/90 border-tertiary/90 hover:border-tertiary-600/90 hover:bg-tertiary-600/90 [&_.arrow]:bg-tertiary-600/90 text-tertiary-contrast [&_.icon]:text-tertiary-contrast/70 [&_.desc]:text-tertiary-contrast/70',
    'primary-outline':
      'bg-white/70 border-primary-100 hover:bg-primary-50/80 [&_.arrow]:bg-primary-50/80 text-primary [&_.icon]:text-primary-400 [&_.desc]:text-primary-400',
    'accent-outline':
      'bg-white/70 border-accent-100 hover:bg-accent-50/80 [&_.arrow]:bg-accent-50/80 text-accent [&_.icon]:text-accent-400 [&_.desc]:text-accent-400',
    'secondary-outline':
      'bg-white/70 border-secondary-100 hover:bg-secondary-50/80 [&_.arrow]:bg-secondary-50/80 text-secondary [&_.icon]:text-secondary-400 [&_.desc]:text-secondary-400',
    'tertiary-outline':
      'bg-white/70 border-tertiary-100 hover:bg-tertiary-50/80 [&_.arrow]:bg-tertiary-50/80 text-tertiary [&_.icon]:text-tertiary-400 [&_.desc]:text-tertiary-400',
  }
}
