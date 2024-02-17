import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { cloneDeep } from 'lodash';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import * as fileSaver from 'file-saver';


@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, MatFormFieldModule, FormsModule, MatIconModule, MatInputModule]
})
export class ListingsComponent {
  coinDetails: any;
  cexDetails: any;
  isExchangesLoading: any = true;
  isMetricsLoading: any = true;
  searchInput: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.apiService.coinDetails.subscribe((data) => {
      console.log('listings cex', data);
      this.coinDetails = data;
      this.isMetricsLoading = false;
      this.isExchangesLoading = true;
      if (data && data.tickers) {
        this.cexDetails = data.tickers;
        this.cexDetails = this.cexDetails.filter((listing: any) => (listing.target.toLowerCase() === 'usdt' || listing.target.toLowerCase() === 'weth' || listing.target.toLowerCase() === 'eth'))
        fetch('assets/data/exchanges.json').then(res => res.json())
          .then(jsonData => {
            this.cexDetails.forEach((listing: any) => {
              console.log(listing)
              const result = jsonData.find((el: any) => el.name === listing.market.name);
              if (result && result.image)
                listing.image = result.image;
              if (result && result.trust_score_rank)
                listing.cexRank = result.trust_score_rank;
            });
            if (this.cexDetails && this.cexDetails.length > 0) {
              this.cexDetails.sort((i: any, j: any) => i.cexRank - j.cexRank)
              // console.log('Sorted Array', this.cexDetails)
            }
            setTimeout(() => {
              this.isExchangesLoading = false;
            }, 1000);
          });
      }
    })
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
  filterExchange() {
    const exchanges = _.cloneDeep(this.cexDetails);
    if (this.searchInput) {
      return exchanges.filter((object) => {
        return object.market.name.toLowerCase().includes(this.searchInput.toLowerCase());
      });
    } else return this.cexDetails;
  }
  captureAndDownloadImage(): void {
    const element = document.getElementById('listings_details'); // Add an id to the container div
    
    if (element) {
      html2canvas(element).then((canvas) => {
        // Convert canvas to blob and save as image
        canvas.toBlob((blob: any) => {
          fileSaver.saveAs(blob, 'whereiscoin_image.png');
        });
      });
    }
  }
}
