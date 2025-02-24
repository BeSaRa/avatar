import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay'
import { NgClass } from '@angular/common'
import { Component, output, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-supported-language',
  standalone: true,
  imports: [ReactiveFormsModule, OverlayModule, PerfectScrollDirective, NgClass],
  templateUrl: './supported-language.component.html',
  styleUrl: './supported-language.component.scss',
})
export class SupportedLanguageComponent extends OnDestroyMixin(class {}) {
  onLanguageChange = output<string>()
  languageControl = new FormControl('en-US', { nonNullable: true })
  languages = [
    { name: 'Afrikaans', languageCode: 'af-ZA', isRTL: false },
    { name: 'Arabic', languageCode: 'ar-QA', isRTL: true },
    { name: 'Armenian', languageCode: 'hy-AM', isRTL: false },
    { name: 'Bangla', languageCode: 'bn-BD', isRTL: false },
    { name: 'Bosnian', languageCode: 'bs-Latn', isRTL: false },
    { name: 'Bulgarian', languageCode: 'bg-BG', isRTL: false },
    { name: 'Catalan', languageCode: 'ca-ES', isRTL: false },
    { name: 'Chinese (Cantonese, Traditional)', languageCode: 'zh-HK', isRTL: false },
    { name: 'Chinese (Simplified)', languageCode: 'zh-Hans', isRTL: false },
    { name: 'Chinese (Traditional)', languageCode: 'zh-Hant', isRTL: false },
    { name: 'Croatian', languageCode: 'hr-HR', isRTL: false },
    { name: 'Czech', languageCode: 'cs-CZ', isRTL: false },
    { name: 'Danish', languageCode: 'da-DK', isRTL: false },
    { name: 'Dutch', languageCode: 'nl-NL', isRTL: false },
    { name: 'English (Australia)', languageCode: 'en-AU', isRTL: false },
    { name: 'English (United Kingdom)', languageCode: 'en-GB', isRTL: false },
    { name: 'English (United States)', languageCode: 'en-US', isRTL: false },
    { name: 'Estonian', languageCode: 'et-EE', isRTL: false },
    { name: 'Filipino', languageCode: 'fil-PH', isRTL: false },
    { name: 'Finnish', languageCode: 'fi-FI', isRTL: false },
    { name: 'French', languageCode: 'fr-FR', isRTL: false },
    { name: 'French (Canada)', languageCode: 'fr-CA', isRTL: false },
    { name: 'German', languageCode: 'de-DE', isRTL: false },
    { name: 'Greek', languageCode: 'el-GR', isRTL: false },
    { name: 'Gujarati', languageCode: 'gu-IN', isRTL: false },
    { name: 'Hebrew', languageCode: 'he-IL', isRTL: true },
    { name: 'Hindi', languageCode: 'hi-IN', isRTL: false },
    { name: 'Hungarian', languageCode: 'hu-HU', isRTL: false },
    { name: 'Icelandic', languageCode: 'is-IS', isRTL: false },
    { name: 'Indonesian', languageCode: 'id-ID', isRTL: false },
    { name: 'Irish', languageCode: 'ga-IE', isRTL: false },
    { name: 'Italian', languageCode: 'it-IT', isRTL: false },
    { name: 'Japanese', languageCode: 'ja-JP', isRTL: false },
    { name: 'Kannada', languageCode: 'kn-IN', isRTL: false },
    { name: 'Kiswahili', languageCode: 'sw-KE', isRTL: false },
    { name: 'Korean', languageCode: 'ko-KR', isRTL: false },
    { name: 'Latvian', languageCode: 'lv-LV', isRTL: false },
    { name: 'Lithuanian', languageCode: 'lt-LT', isRTL: false },
    { name: 'Malay', languageCode: 'ms-MY', isRTL: false },
    { name: 'Malayalam', languageCode: 'ml-IN', isRTL: false },
    { name: 'Norwegian', languageCode: 'nb-NO', isRTL: false },
    { name: 'Persian', languageCode: 'fa-IR', isRTL: true },
    { name: 'Polish', languageCode: 'pl-PL', isRTL: false },
    { name: 'Portuguese (Brazil)', languageCode: 'pt-BR', isRTL: false },
    { name: 'Portuguese (Portugal)', languageCode: 'pt-PT', isRTL: false },
    { name: 'Romanian', languageCode: 'ro-RO', isRTL: false },
    { name: 'Russian', languageCode: 'ru-RU', isRTL: false },
    { name: 'Serbian (Cyrillic)', languageCode: 'sr-Cyrl-RS', isRTL: false },
    { name: 'Serbian (Latin)', languageCode: 'sr-Latn-RS', isRTL: false },
    { name: 'Slovak', languageCode: 'sk-SK', isRTL: false },
    { name: 'Slovenian', languageCode: 'sl-SI', isRTL: false },
    { name: 'Spanish', languageCode: 'es-ES', isRTL: false },
    { name: 'Spanish (Mexico)', languageCode: 'es-MX', isRTL: false },
    { name: 'Swedish', languageCode: 'sv-SE', isRTL: false },
    { name: 'Tamil', languageCode: 'ta-IN', isRTL: false },
    { name: 'Telugu', languageCode: 'te-IN', isRTL: false },
    { name: 'Thai', languageCode: 'th-TH', isRTL: false },
    { name: 'Turkish', languageCode: 'tr-TR', isRTL: false },
    { name: 'Ukrainian', languageCode: 'uk-UA', isRTL: false },
    { name: 'Urdu', languageCode: 'ur-PK', isRTL: false },
    { name: 'Vietnamese', languageCode: 'vi-VN', isRTL: false },
  ]
  isDropdownOpen = signal(false)
  selectedLanguage = signal('English (United States)')

  dropdownPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  ]

  toggleDropdown() {
    this.isDropdownOpen.update(() => !this.isDropdownOpen())
  }

  selectLanguage(name: string, code: string) {
    this.selectedLanguage.set(name)
    this.onLanguageChange.emit(code)
    this.isDropdownOpen.set(false)
  }
}
