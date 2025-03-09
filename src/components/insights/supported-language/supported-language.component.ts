import { PerfectScrollDirective } from '@/directives/perfect-scroll.directive'
import { OnDestroyMixin } from '@/mixins/on-destroy-mixin'
import { LocalService } from '@/services/local.service'
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay'
import { NgClass } from '@angular/common'
import { Component, output, signal, inject, input, effect, untracked } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-supported-language',
  standalone: true,
  imports: [ReactiveFormsModule, OverlayModule, PerfectScrollDirective, NgClass],
  templateUrl: './supported-language.component.html',
  styleUrl: './supported-language.component.scss',
})
export class SupportedLanguageComponent extends OnDestroyMixin(class {}) {
  lang = inject(LocalService)
  onLanguageChange = output<string>()
  withDefaultValue = input<boolean>(true)
  languageControl = new FormControl('en-US', { nonNullable: true })
  languages = [
    { name: 'Afrikaans', arName: 'الأفريكانية', languageCode: 'af-ZA', isRTL: false },
    { name: 'Arabic', arName: 'العربية', languageCode: 'ar-QA', isRTL: true },
    { name: 'Armenian', arName: 'الأرمينية', languageCode: 'hy-AM', isRTL: false },
    { name: 'Bangla', arName: 'البنغالية', languageCode: 'bn-BD', isRTL: false },
    { name: 'Bosnian', arName: 'البوسنية', languageCode: 'bs-Latn', isRTL: false },
    { name: 'Bulgarian', arName: 'البلغارية', languageCode: 'bg-BG', isRTL: false },
    { name: 'Catalan', arName: 'الكاتالانية', languageCode: 'ca-ES', isRTL: false },
    {
      name: 'Chinese (Cantonese, Traditional)',
      arName: 'الصينية (الكانتونية، التقليدية)',
      languageCode: 'zh-HK',
      isRTL: false,
    },
    { name: 'Chinese (Simplified)', arName: 'الصينية (المبسطة)', languageCode: 'zh-Hans', isRTL: false },
    { name: 'Chinese (Traditional)', arName: 'الصينية (التقليدية)', languageCode: 'zh-Hant', isRTL: false },
    { name: 'Croatian', arName: 'الكرواتية', languageCode: 'hr-HR', isRTL: false },
    { name: 'Czech', arName: 'التشيكية', languageCode: 'cs-CZ', isRTL: false },
    { name: 'Danish', arName: 'الدنماركية', languageCode: 'da-DK', isRTL: false },
    { name: 'Dutch', arName: 'الهولندية', languageCode: 'nl-NL', isRTL: false },
    { name: 'English (Australia)', arName: 'الإنجليزية (أستراليا)', languageCode: 'en-AU', isRTL: false },
    { name: 'English (United Kingdom)', arName: 'الإنجليزية (المملكة المتحدة)', languageCode: 'en-GB', isRTL: false },
    { name: 'English (United States)', arName: 'الإنجليزية (الولايات المتحدة)', languageCode: 'en-US', isRTL: false },
    { name: 'Estonian', arName: 'الإستونية', languageCode: 'et-EE', isRTL: false },
    { name: 'Filipino', arName: 'الفلبينية', languageCode: 'fil-PH', isRTL: false },
    { name: 'Finnish', arName: 'الفنلندية', languageCode: 'fi-FI', isRTL: false },
    { name: 'French', arName: 'الفرنسية', languageCode: 'fr-FR', isRTL: false },
    { name: 'French (Canada)', arName: 'الفرنسية (كندا)', languageCode: 'fr-CA', isRTL: false },
    { name: 'German', arName: 'الألمانية', languageCode: 'de-DE', isRTL: false },
    { name: 'Greek', arName: 'اليونانية', languageCode: 'el-GR', isRTL: false },
    { name: 'Gujarati', arName: 'الغوجاراتية', languageCode: 'gu-IN', isRTL: false },
    { name: 'Hebrew', arName: 'العبرية', languageCode: 'he-IL', isRTL: true },
    { name: 'Hindi', arName: 'الهندية', languageCode: 'hi-IN', isRTL: false },
    { name: 'Hungarian', arName: 'الهنغارية', languageCode: 'hu-HU', isRTL: false },
    { name: 'Icelandic', arName: 'الأيسلندية', languageCode: 'is-IS', isRTL: false },
    { name: 'Indonesian', arName: 'الإندونيسية', languageCode: 'id-ID', isRTL: false },
    { name: 'Irish', arName: 'الأيرلندية', languageCode: 'ga-IE', isRTL: false },
    { name: 'Italian', arName: 'الإيطالية', languageCode: 'it-IT', isRTL: false },
    { name: 'Japanese', arName: 'اليابانية', languageCode: 'ja-JP', isRTL: false },
    { name: 'Kannada', arName: 'الكانادية', languageCode: 'kn-IN', isRTL: false },
    { name: 'Kiswahili', arName: 'السواحيلية', languageCode: 'sw-KE', isRTL: false },
    { name: 'Korean', arName: 'الكورية', languageCode: 'ko-KR', isRTL: false },
    { name: 'Latvian', arName: 'اللاتفية', languageCode: 'lv-LV', isRTL: false },
    { name: 'Lithuanian', arName: 'اللتوانية', languageCode: 'lt-LT', isRTL: false },
    { name: 'Malay', arName: 'الملايو', languageCode: 'ms-MY', isRTL: false },
    { name: 'Malayalam', arName: 'المالايالامية', languageCode: 'ml-IN', isRTL: false },
    { name: 'Norwegian', arName: 'النرويجية', languageCode: 'nb-NO', isRTL: false },
    { name: 'Persian', arName: 'الفارسية', languageCode: 'fa-IR', isRTL: true },
    { name: 'Polish', arName: 'البولندية', languageCode: 'pl-PL', isRTL: false },
    { name: 'Portuguese (Brazil)', arName: 'البرتغالية (البرازيل)', languageCode: 'pt-BR', isRTL: false },
    { name: 'Portuguese (Portugal)', arName: 'البرتغالية (البرتغال)', languageCode: 'pt-PT', isRTL: false },
    { name: 'Romanian', arName: 'الرومانية', languageCode: 'ro-RO', isRTL: false },
    { name: 'Russian', arName: 'الروسية', languageCode: 'ru-RU', isRTL: false },
    { name: 'Serbian (Cyrillic)', arName: 'الصربية (السيريلية)', languageCode: 'sr-Cyrl-RS', isRTL: false },
    { name: 'Serbian (Latin)', arName: 'الصربية (اللاتينية)', languageCode: 'sr-Latn-RS', isRTL: false },
    { name: 'Slovak', arName: 'السلوفاكية', languageCode: 'sk-SK', isRTL: false },
    { name: 'Slovenian', arName: 'السلوفينية', languageCode: 'sl-SI', isRTL: false },
    { name: 'Spanish', arName: 'الإسبانية', languageCode: 'es-ES', isRTL: false },
    { name: 'Spanish (Mexico)', arName: 'الإسبانية (المكسيك)', languageCode: 'es-MX', isRTL: false },
    { name: 'Swedish', arName: 'السويدية', languageCode: 'sv-SE', isRTL: false },
    { name: 'Tamil', arName: 'التاميلية', languageCode: 'ta-IN', isRTL: false },
    { name: 'Telugu', arName: 'التيلوغوية', languageCode: 'te-IN', isRTL: false },
    { name: 'Thai', arName: 'التايلاندية', languageCode: 'th-TH', isRTL: false },
    { name: 'Turkish', arName: 'التركية', languageCode: 'tr-TR', isRTL: false },
    { name: 'Ukrainian', arName: 'الأوكرانية', languageCode: 'uk-UA', isRTL: false },
    { name: 'Urdu', arName: 'الأردية', languageCode: 'ur-PK', isRTL: true },
    { name: 'Vietnamese', arName: 'الفيتنامية', languageCode: 'vi-VN', isRTL: false },
  ]

  isDropdownOpen = signal(false)
  selectedLanguage = signal('')

  dropdownPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  ]

  /**
   *
   */
  constructor() {
    super()
    effect(() => {
      untracked(() => {
        if (this.withDefaultValue()) {
          this.selectedLanguage.set(
            this.lang.currentLanguage === 'ar' ? 'الإنجليزية (الولايات المتحدة)' : 'English (United States)'
          )
        }
      })
    })
  }

  toggleDropdown() {
    this.isDropdownOpen.update(() => !this.isDropdownOpen())
  }

  selectLanguage(name: string, code: string) {
    this.selectedLanguage.set(name)
    this.onLanguageChange.emit(code)
    this.isDropdownOpen.set(false)
  }
}
