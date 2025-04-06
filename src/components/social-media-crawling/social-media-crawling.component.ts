import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { SocialMediaService } from '@/services/social-media.service'
import { createSocialMediaSearchItemGroup, SocialMeidaSearchItem } from '@/types/social-media-search-type'
import { generateUUID, removeNullableAndIgnoreKeys } from '@/utils/utils'
import { DatePipe, NgTemplateOutlet } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { catchError, finalize, takeUntil } from 'rxjs'

@Component({
  selector: 'app-social-media-crawling',
  standalone: true,
  imports: [ReactiveFormsModule, PerfectScrollDirective, DatePipe, NgTemplateOutlet],
  templateUrl: './social-media-crawling.component.html',
  styleUrl: './social-media-crawling.component.scss',
})
export class SocialMediaCrawlingComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  socialMediaService = inject(SocialMediaService)
  socialMediaForm = createSocialMediaSearchItemGroup()
  items = signal<Partial<SocialMeidaSearchItem>[]>([])
  prevEditedKey = signal<string | null>(null)
  animateHeader = signal(false)
  isLoading = signal<boolean>(false)
  editedItem = signal<Partial<SocialMeidaSearchItem> | null>(null)
  readonly isEditing = computed(() => this.editedItem() !== null)

  searchX() {
    this.isLoading.set(true)
    this.items.update(exps => exps.map(el => removeNullableAndIgnoreKeys(el, ['id'])))
    this.socialMediaService
      .Xsearch(this.items())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => finalize(() => this.isLoading.set(false))),
        catchError(err => {
          this.isLoading.set(false)
          console.error(err)
          throw err
        })
      )
      .subscribe()
  }

  addSearchItem() {
    const value = { ...this.socialMediaForm.value, id: generateUUID() }
    if (this.editedItem()) {
      const index = this.items().findIndex(x => x === this.editedItem())
      if (index !== -1) {
        const updated = [...this.items()]
        updated[index] = value
        this.items.set(updated)
      }
    } else {
      this.items.update(list => [...list, value])
    }

    this.socialMediaForm.reset()
    this.editedItem.set(null)
  }

  deleteItem(index: number) {
    const currentItems = this.items()
    const deleted = currentItems[index]

    currentItems.splice(index, 1)
    this.items.set([...currentItems])

    // 👇 Cancel edit if this was the currently edited item
    if (this.editedItem() === deleted) {
      this.cancelEdit()
    }
  }

  editItem(exp: Partial<SocialMeidaSearchItem>) {
    const currentKey = exp.id // or exp.id if you have one
    const prevKey = this.prevEditedKey()

    // Same item → no animation
    if (this.isEditing() && prevKey && prevKey !== currentKey) {
      this.animateHeader.set(false)
      setTimeout(() => this.animateHeader.set(true), 0)
    }

    this.socialMediaForm.patchValue(exp)
    this.editedItem.set(exp)
    this.prevEditedKey.set(currentKey!)
  }

  cancelEdit() {
    this.editedItem.set(null)
    this.socialMediaForm.reset()
  }
}
