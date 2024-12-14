import { ICitations } from '@/models/base-message'
// noinspection JSUnusedGlobalSymbols

import { FormControlDirective, FormControlName, NgModel } from '@angular/forms'
import { catchError, filter, MonoTypeOperatorFunction, Observable, of } from 'rxjs'

/**
 * to check if the NgControl is NgModel
 * @param control
 */
export function isNgModel(control: unknown): control is NgModel {
  return control instanceof NgModel
}

/**
 * to check if the NgControl is FormControlDirective
 * @param control
 */
export function isFormControlDirective(control: unknown): control is FormControlDirective {
  return control instanceof FormControlDirective
}

/**
 * to check if the NgControl is FormControlName
 * @param control
 */
export function isFormControlName(control: unknown): control is FormControlName {
  return control instanceof FormControlName
}

/**
 * operator to ignore the errors came from observable and keep it a live
 * @param debug just to console log the error
 */
export function ignoreErrors<T>(debug = false): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => {
    return source
      .pipe(
        catchError(error => {
          debug && console.log(error)
          return of('CUSTOM_ERROR' as T)
        })
      )
      .pipe(filter<T>((value): value is T => value !== 'CUSTOM_ERROR'))
  }
}

/**
 * chunk provided array by given bulk size
 * @param arr
 * @param bulkSize
 */
export function arrayChunk<T>(arr: T[], bulkSize = 3): T[][] {
  const bulks: T[][] = []
  for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
    bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize))
  }
  return bulks
}

/**
 * @description Generates the html ordered list of passed string values
 * @param title
 * @param namesList
 */
export function generateHtmlList(title: string, namesList: string[]): HTMLDivElement {
  const div = document.createElement('div')
  div.classList.add('dynamic-list-container')

  const titleElement = document.createElement('h6')
  titleElement.innerText = title

  const list: HTMLOListElement = document.createElement('ol')
  for (const name of namesList) {
    const item = document.createElement('li')
    item.appendChild(document.createTextNode(name))
    list.appendChild(item)
  }

  div.append(titleElement)
  div.append(list)
  return div
}

/**
 * @description Opens the blob data in new browser tab or download if IE browser
 * @param data
 * @param fileName
 */
export function printBlobData(data: Blob, fileName?: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window.navigator as any).msSaveOrOpenBlob(data, fileName ?? 'customs-' + new Date().valueOf() + '.pdf')
  } else {
    const a: HTMLAnchorElement = document.createElement('a')
    const url = URL.createObjectURL(data)
    a.href = URL.createObjectURL(data)
    a.target = '_blank'
    a.click()

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 0)
  }
}

/**
 * @description Checks if given value is valid
 * @param value
 * Value to check for validity
 */
export function isValidValue(value: unknown): boolean {
  return typeof value === 'string' ? value.trim() !== '' : typeof value !== 'undefined' && value !== null
}

/**
 * @description has valida length
 * @param value
 */
export function hasValidLength(value: unknown): boolean {
  if (!isValidValue(value)) {
    return false
  }
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * @description Checks if given object is empty(not having properties)
 * @param objectToCheck
 * Object to check for emptiness
 */
export function isEmptyObject(objectToCheck: object): boolean {
  for (const key in objectToCheck) {
    if (Object.prototype.hasOwnProperty.call(objectToCheck, key)) {
      return false
    }
  }
  return true
}

/**
 * @description Check if object has any property with value
 * @param objectToCheck
 * Object to check for property values
 */
export function objectHasValue(objectToCheck: object): boolean {
  return Object.values(objectToCheck).some(value => isValidValue(value))
}

export function objectHasOwnProperty<O, P extends PropertyKey>(
  object: O,
  property: P
): object is O & Record<P, unknown> {
  return Object.prototype.hasOwnProperty.call(object, property)
}

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() //Timestamp
  //Time in microseconds since page-load or 0 if unsupported
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function* generateChunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

export function chunks<T>(arr: T[], n: number): T[][] {
  return [...generateChunks(arr, n)]
}

export const range = (start: number, stop: number) => Array.from({ length: stop - start + 1 }, (_, i) => start + i)

export function isRTL(str: string) {
  return /[\u0600-\u06FF]+/.test(str)
}
export const formatString = (text: string) => {
  text
    .split(' ')
    .map(word => (isRTL(word) ? '\u202A' : '\u202C') + word)
    .join(' ')
  return text
}

export function formatText<T extends { context: { citations: ICitations[] } }>(text: string, message: T): string {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Replace text between [ and ] with <a> tags
  formattedText = formattedText.replace(/\[(.*?)\]/g, (match, p1) => {
    const item = message.context.citations[Number(p1.replace(/[^0-9]/g, '')) - 1]
    if (!item) {
      return match
    }
    const title = item.title
    const url = item.url

    // eslint-disable-next-line max-len
    return `<br /><small class="px-1 text-primary"><a target="_blank" href="${url}">${title}</a><i class="link-icon"></i></small>`
  })
  // text = text.replace(/\./g, '.<br>')

  // Return the formatted text
  return formattedText.trim()
}

export function preprocessInput(rawInput: string): string {
  try {
    return rawInput
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/\bNone\b/g, 'null') // Replace Python-style None with JSON null
      .replace(/\bTrue\b/g, 'true') // Replace Python-style True with JSON true
      .replace(/\bFalse\b/g, 'false') // Replace Python-style False with JSON false
      .replace(/\\\\"/g, '"') // Unescape double-escaped quotes inside content
      .replace(/"{/g, '{') // Remove unnecessary double-quotes around objects
      .replace(/}"/g, '}') // Remove unnecessary double-quotes around objects
      .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas in objects and arrays
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/g, '$1"$2"$3') // Quote unquoted keys
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\') // Escape lone backslashes
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/"intent":\s*"(\[.*?\])"/, (_, intent) => {
        // Fix double-stringified intent field
        const correctedIntent = intent.replace(/\\"/g, '"')
        return `"intent": ${correctedIntent}`
      })
  } catch (error) {
    throw new Error(`Preprocessing error: ${error}`)
  }
}

export function parseEmbeddedContent(citations: ICitations[]) {
  return citations.map(citation => {
    try {
      // Parse 'content' field if it is valid JSON
      if (typeof citation.content === 'string' && citation.content.trim().startsWith('{')) {
        citation.content = JSON.parse(citation.content)
      }
    } catch (error) {
      console.warn(`Failed to parse content for citation: "${citation.title}". Error: ${error}`)
    }
    return citation
  })
}

export function extractCitationsAndIntents(input: string) {
  try {
    // Preprocess the input
    const preprocessedInput = preprocessInput(input)

    // Parse the preprocessed input
    const parsedInput = JSON.parse(preprocessedInput)

    // Extract citations and intents
    const citations = parsedInput.citations || []
    const intent = parsedInput.intent || []

    // Parse embedded JSON strings in 'content' fields
    const cleanedCitations = parseEmbeddedContent(citations)

    return { citations: cleanedCitations, intent }
  } catch (error) {
    console.error(`Failed to parse input. Error: ${error}`)
    throw new Error(`Failed to parse input: ${error}`)
  }
}

export function extractFileName(url: string) {
  const urlObj = new URL(url)
  const pathName = urlObj.pathname
  const fileName = decodeURI(pathName.split('/').pop() || 'file')
  return fileName
}
