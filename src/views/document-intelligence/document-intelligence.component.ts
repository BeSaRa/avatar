import { Component } from '@angular/core'
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component'

@Component({
  selector: 'app-document-intelligence',
  standalone: true,
  imports: [FileUploaderComponent],
  templateUrl: './document-intelligence.component.html',
  styleUrl: './document-intelligence.component.scss',
})
export class DocumentIntelligenceComponent {}
