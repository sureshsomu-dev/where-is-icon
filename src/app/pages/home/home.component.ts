import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCryptoComponent } from 'app/shared/search-crypto/search-crypto.component';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchCryptoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  config: FuseConfig;
  scheme: 'dark' | 'light';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _fuseConfigService: FuseConfigService) {

  }
  ngOnInit() {
    this._fuseConfigService.config$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: FuseConfig) => {
        // Store the config
        this.config = config;
      });
  }
}
