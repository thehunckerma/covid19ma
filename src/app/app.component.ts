import { Component, DoCheck, } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

import { SoficoopData } from './interfaces/soficoop-data';
import { LatestData } from './interfaces/latest-data';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {

  private latestData: LatestData;
  private backupData: Array<any>;
  private X: Array<string> = [];
  private rocX: Array<string> = [];
  // private X: Array<string> =
  //   [
  //     '03/2',
  //     '03/3',
  //     '03/4',
  //     '03/5',
  //     '03/6',
  //     '03/7',
  //     '03/8',
  //     '03/9',
  //     '03/10',
  //     '03/11',
  //     '03/12',
  //     '03/13',
  //     '03/14',
  //     '03/15',
  //     '03/16'
  //   ]; // Data before 3/16
  // private Y: Array<number> = [1, 1, 1, 2, 2, 2, 2, 2, 3, 5, 6, 7, 17, 28, 29];
  private Y: Array<number> = [];
  private rocY: Array<number> = [];

  lineChartData: ChartDataSets[] = [
    { data: this.Y, label: 'Covid-19 in Morocco' },
  ];

  lineChartLabels: Label[] = this.X;

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'gray',
      backgroundColor: 'rgba(255,190,70,0.5)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  // ROC -----------------------------------------------------------------------------------------

  lineChartData0: ChartDataSets[] = [
    { data: this.rocY, label: 'Covid-19 Rate Of Change in Morocco' },
  ];

  lineChartLabels0: Label[] = this.rocX;

  lineChartOptions0 = {
    responsive: true,
  };

  lineChartColors0: Color[] = [
    {
      borderColor: 'gray',
      backgroundColor: 'rgba(255,90,70,0.5)',
    },
  ];

  lineChartLegend0 = true;
  lineChartPlugins0 = [];
  lineChartType0 = 'line';

  render = false;
  hide = true;

  data: Array<any> = [];
  displayedColumns: string[] = [
    'cases',
    'todayCases',
    'deaths',
    'todayDeaths',
    'recovered',
    'active',
    'critical',
    'timestamp'
  ];
  constructor(
    private http: HttpClient,
    public datepipe: DatePipe,
    private _snackBar: MatSnackBar
  ) {
    this.http.get('http://covid19.soficoop.com/country/ma').subscribe((data: SoficoopData) => {
      // console.log(JSON.stringify(data));
      data.snapshots.forEach(element => {
        const time = this.datepipe.transform(element.timestamp, 'dd/MM');
        if (this.X.includes(time)) {
          this.data.pop();
          this.Y.pop();
        } else {
          this.X.push(time);
          if(time === '24/03'){
            element.cases = 170;
            element.active = '170';
            this.data.push(element);
            return 0;
          }
        }
        this.data.push(element);
        this.Y.push(element.cases);
      });
      for (let i = 1; i < this.Y.length; i++) {
        this.rocY.push((this.Y[i] / this.Y[i - 1] - 1) * 100);
        this.rocX.push(this.X[i]);
      }
      // this.rocX.shift();
      this.render = true;
    }, e => console.log(e));
    // this.http.get('https://coronavirus-19-api.herokuapp.com/countries/morocco').subscribe((data: LatestData) => {
    //   this.latestData = data;
    // });
  }

  send(f: NgForm) {
    this.backupData = [];
    for (const i of [...Array(this.Y.length).keys()]) {
      this.backupData.push(
        {
          x: this.X[i],
          y: this.Y[i]
        }
      )
    }
    this.backupData.push({ pass: f.value.password });
    const backupDataJSON = JSON.stringify(this.backupData);
    this.http.post('http://runplaywithcarbon.com/data-cov.php', backupDataJSON).subscribe((data: any) => {
      console.log(data)
      this._snackBar.open(data.msg, 'Close', {
        duration: 2000,
      });
    });
  }
  ngDoCheck() {
  }
}