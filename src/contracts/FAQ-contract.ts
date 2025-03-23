import { inject } from '@angular/core'
import { NonNullableFormBuilder, Validators } from '@angular/forms'

export interface ArchiveFAQContract {
  PartitionKey: string
  RowKey: string
  ActualQuestion: string
  TotalCount: number
  OrderIndex: number
  botname: string
}
export type FAQContract = Omit<ArchiveFAQContract, 'OrderIndex'>

export function createFAQForm(faq: ArchiveFAQContract) {
  const fb = inject(NonNullableFormBuilder)
  return fb.group({
    PartitionKey: fb.control(faq.PartitionKey),
    RowKey: fb.control(faq.RowKey),
    ActualQuestion: fb.control(faq.ActualQuestion, [Validators.required]),
    TotalCount: fb.control(faq.TotalCount),
    OrderIndex: fb.control(faq.OrderIndex, [Validators.required, Validators.min(1)]),
    botname: fb.control(faq.botname),
  })
}

export type FAQForm = ReturnType<typeof createFAQForm>
