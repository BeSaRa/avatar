import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { VersionComponent } from '@/components/version/version.component'
import { CommonService } from '@/services/common.service'
import { AppStore } from '@/stores/app.store'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VersionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  commonService = inject(CommonService)
  appStore = inject(AppStore)

  ngOnInit(): void {
    this.commonService.generateSpeechToken()
  }
}
