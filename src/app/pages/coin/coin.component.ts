import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseCardComponent } from '@fuse/components/card';
import { SearchCryptoComponent } from 'app/shared/search-crypto/search-crypto.component';
import { ListingsComponent } from 'app/shared/listings/listings.component';

@Component({
  selector: 'app-coin',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, MatTabsModule, CommonModule, FuseCardComponent, RouterLink, SearchCryptoComponent, ListingsComponent],
  templateUrl: './coin.component.html',
  styleUrl: './coin.component.scss'
})
export class CoinComponent {
  coinDetails: any;
  cexDetails: any;
  isExchangesLoading: any = true;
  isMetricsLoading: any = true;
  activeTab: any = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    this.activeTab = 'metrics';
    this.route.params.subscribe(params => {
      const coinID = params['id'] || null;
      // Use the profileId value as needed
      if (coinID) {
        if (this.coinDetails && this.coinDetails.id === coinID) {
          return;
        }
        this.isMetricsLoading = true;
        this.apiService.getCoinInfo(coinID).subscribe((data) => {
          this.apiService.coinDetails.next(data);
        })
      } else {
        this.apiService.coinDetails.next(null);
      }
    });
    this.apiService.coinDetails.subscribe((data) => {
      console.log('Data Refreshed', data);
      this.coinDetails = data;
      this.isMetricsLoading = false;
      this.isExchangesLoading = true;
      if (data && data.tickers) {
        this.cexDetails = data.tickers;
        this.cexDetails = this.cexDetails.filter((listing: any) => (listing.target.toLowerCase() === 'usdt' || listing.target.toLowerCase() === 'weth' || listing.target.toLowerCase() === 'eth'))
        fetch('assets/data/exchanges.json').then(res => res.json())
          .then(jsonData => {
            this.cexDetails.forEach((listing: any) => {
              const result = jsonData.find((el: any) => el.name === listing.market.name);
              if (result && result.image)
                listing.image = result.image;
              if (result && result.trust_score_rank)
                listing.cexRank = result.trust_score_rank;
            });
            if (this.cexDetails && this.cexDetails.length > 0) {
              this.cexDetails.sort((firstItem, secondItem) => firstItem.cexRank - secondItem.cexRank);
              // console.log('Sorted Array', this.cexDetails)
            }
            setTimeout(() => {
              this.isExchangesLoading = false;
            }, 1000);
          });
      }
    })
  }

  navigateHome() {
    this.router.navigate([''])
  }
  numberToReadable(number: any) {
    const suffixes = ['', 'K', 'M', 'B', 'T']; // Add more suffixes as needed
    const suffixNum = Math.floor(("" + number).length / 3);
    let shortValue: any = parseFloat((suffixNum != 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(2));
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  }
  goToTrade(url: any) {
    window.open(url, '_blank');
  }
  athPercentage(currentPrice: any, allTimeHigh: any) {
    return ((allTimeHigh - currentPrice) / currentPrice) * 100;
  }
  athTimes(currentPrice: any, allTimeHigh: any) {
    return allTimeHigh / currentPrice
  }
  yourNotificationFunction(event: any) {

  }
  convertExponentialToNormal(number: any) {
    var exponentialNumber = parseFloat(number);
    var normalNumber: any = exponentialNumber.toString();

    // Check if the number is in exponential notation
    if (normalNumber.indexOf('e') !== -1) {
      var exponentPosition = normalNumber.indexOf('e');
      var exponent = parseInt(normalNumber.slice(exponentPosition + 1));
      normalNumber = exponentialNumber.toFixed(Math.abs(exponent) + 2);
    } else {
      return number;
    }
    // normalNumber = normalNumber.toString();

    return normalNumber;
  }
  viewCoin(coinID: any) {
    this.router.navigate(['coin', coinID]);
  }
}
