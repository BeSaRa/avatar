import { VacationStatus } from '@/enums/vacation-status'

export interface VacationResultContract {
  PartitionKey: string
  RowKey: string
  Vacation_Type: string
  Employee_ID: number
  Employee_Name: string
  Manager_Name: string
  Department: string
  Start_Date: Date | string
  End_Date: Date | string
  Total_Days: number
  Status: VacationStatus
  Comments: string
  changeState: boolean
}
