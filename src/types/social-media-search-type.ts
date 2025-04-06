import { dateRangeValidator } from '@/utils/utils'
import { inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

export function createSocialMediaSearchItemGroup() {
  const fb = inject(FormBuilder)
  return fb.group(
    {
      query: fb.control('', { nonNullable: true, validators: [Validators.required] }),
      start_time: fb.control<string | null>(null),
      end_time: fb.control<string | null>(null),
      max_results: fb.control<number | null>(null, {
        validators: [Validators.min(1)],
      }),
    },
    { validators: dateRangeValidator([['start_time', 'end_time']], ['timeDateRangeInvalid']) }
  )
}

export type SocialMeidaSearchItemGroup = ReturnType<typeof createSocialMediaSearchItemGroup>
export type SocialMeidaSearchItem = ReturnType<SocialMeidaSearchItemGroup['getRawValue']> & { id: string }
