interface FunctionCallMap {
  fill_vacation_form: {
    vacation_type: string
    employee_name: string
    employee_ID: number
    manager_name: string
    employee_department: string
    start_date: string
    end_date: string
    comments: string
  }
  approve: {
    employee_ID: number
  }
  reject: {
    employee_ID: number
  }
  pending: {
    employee_ID: number
  }
  'submit-form': {
    'confirm-text': string
  }
  'get-all-vacation-forms': {
    text: string
  }
  'filter-vacation-forms-by': {
    coulomn_name: string
    value: string
  }
  'get-employee-vacation-forms': {
    employee_ID: number
  }
  'get-employee-vacations-count': {
    employee_ID: number
  }
}

export type FunctionName = keyof FunctionCallMap
export type FunctionArguments<TFunctionName extends FunctionName> = FunctionCallMap[TFunctionName]

interface FunctionContract<TFunctionName extends FunctionName> {
  name: TFunctionName
  arguments: FunctionArguments<TFunctionName>
}

export interface ToolCallContract<TFunctionName extends FunctionName = FunctionName> {
  id: string
  function: FunctionContract<TFunctionName>
  type: string
}
