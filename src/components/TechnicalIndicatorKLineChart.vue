<template>
  <Layout title="Chart" v-bind:style="{backgroundColor: theme === 'dark' ? '#1f2126' : ''}">
    <div
      class="k-line-chart-menu-container">Type of chart:
      <button
        v-for="({ key, text }) in chartTypes"
        :key="key"
        v-on:click="setChartType(key)">
        {{ text }}
      </button>
    </div>
    <div
      class="k-line-chart-menu-container">
      Theme:
      <button
        v-on:click="setTheme('dark')">
        dark
      </button>
      <button
        v-on:click="setTheme('light')">
        light
      </button>
    </div>
    <div
      class="k-line-chart-menu-container">
      Currency:
      <button
        v-for="({ key, text }) in supportedСurrency"
        :key="key"
        v-on:click="changeCurrency(key)">
        {{ text }}
      </button>
    </div>
    <div
      class="k-line-chart-menu-container">
      Interval:
      <button
        v-for="({ key, text }) in supportedInterval"
        :key="key"
        v-on:click="changeInterval(key)">
        {{ text }}
      </button>
    </div>
    <div id="technical-indicator-k-line" class="k-line-chart"/>
    <div
      class="k-line-chart-menu-container">
      <span style="padding-right: 10px">Индикатор основного графика</span>
      <button
        v-for="type in mainTechnicalIndicatorTypes"
        :key="type"
        v-on:click="setCandleTechnicalIndicator(type)">
        {{ type }}
      </button>
      <span style="padding-right: 10px;padding-left: 12px">Индикатор дополнительного графика</span>
      <button
        v-for="type in subTechnicalIndicatorTypes"
        :key="type"
        v-on:click="setSubTechnicalIndicator(type)">
        {{ type }}
      </button>
    </div>
    <div
      class="k-line-chart-menu-container">
      <button
        v-for="({ key, text }) in graphicMarks"
        :key="key"
        v-on:click="setGraphicMarkType(key)">
        {{ text }}
      </button>
      <button
        v-on:click="removeAllGraphicMark()">
        Remove all
      </button>
    </div>
  </Layout>
</template>

<script>
import {dispose, init} from 'klinecharts'
import Layout from "@/Layout"
import {get} from "axios";
import {circle} from "./util/circle";
import {rect} from "./util/rect";
import getThemeOptions from "./util/theme";

export default {
  name: 'TechnicalIndicatorKLineChart',
  components: {Layout},
  data: function () {
    return {
      mainTechnicalIndicatorTypes: ['MA', 'EMA', 'SAR'],
      subTechnicalIndicatorTypes: ['VOL', 'MACD', 'KDJ'],
      chartTypes: [
        {key: 'candle_solid', text: 'candle solid'},
        {key: 'candle_stroke', text: 'candle stroke'},
        {key: 'candle_up_stroke', text: 'candle up stroke'},
        {key: 'candle_down_stroke', text: 'candle down stroke'},
        {key: 'ohlc', text: 'OHLC'},
        {key: 'area', text: 'area'}
      ],
      theme: 'light',
      graphicMarks: [
        {key: 'priceLine', text: 'priceLine'},
        {key: 'priceChannelLine', text: 'priceChannelLine'},
        {key: 'parallelStraightLine', text: 'parallelStraightLine'},
        {key: 'fibonacciLine', text: 'fibonacciLine'},
        {key: 'rect', text: 'rect'},
        {key: 'circle', text: 'circle'}
      ],
      currentSubTechnicalIndicator: 'VOL',
      currentTechnicalIndicator: String,
      candleNewData: [],
      kLineData: [],
      supportedInterval: [
        {key: `1m`, text: `1 min`},
        {key: `5m`, text: `5 min`},
        {key: `15m`, text: `15 min`},
        {key: `30m`, text: `30 min`},
        {key: `1h`, text: `1 hour`},
        {key: `4h`, text: `4 hour`},
        {key: `1w`, text: `1 week`}
      ],
      supportedСurrency: [
        {key: `USD/BYN`, text: `USD to BYN`},
        {key: `EUR/BYN`, text: `EUR to BYN`},
        {key: `EUR/USD`, text: `EUR to USD`}
      ],
      currentCurrency: `USD/BYM`,
      currentInterval: `4h`
    }
  }
  ,
  mounted: function () {
    this.kLineChart = init('technical-indicator-k-line')
    this.paneId = this.kLineChart.createTechnicalIndicator(this.currentSubTechnicalIndicator, false)
    this.kLineChart.setStyleOptions({candle: {tooltip: {labels: ['T', 'O', 'C', 'H', 'L', 'V']}}})
    this.requestData(`USD/BYN`, `4h`)
    this.kLineChart.addCustomGraphicMark(rect)
    this.kLineChart.addCustomGraphicMark(circle)

  }
  ,
  methods: {
    setCandleTechnicalIndicator: function (type) {
      if (this.currentTechnicalIndicator === type) {
        this.kLineChart.removeTechnicalIndicator('candle_pane')
        this.currentTechnicalIndicator = null
      } else {
        this.kLineChart.createTechnicalIndicator(type, false, {id: 'candle_pane'})
        this.currentTechnicalIndicator = type
      }
    }
    ,
    setSubTechnicalIndicator: function (type) {
      if (this.currentSubTechnicalIndicator === type) {
        this.kLineChart.removeTechnicalIndicator(this.paneId)
        this.currentSubTechnicalIndicator = null
      } else {
        this.kLineChart.createTechnicalIndicator(type, false, {id: this.paneId})
        this.currentSubTechnicalIndicator = type
      }
    }
    ,
    setChartType: function (type) {
      this.kLineChart.setStyleOptions({
        candle: {
          type
        }
      })
    }
    ,
    setTheme: function (theme) {
      this.theme = theme
      this.kLineChart.setStyleOptions(getThemeOptions(theme))
    }
    ,
    setGraphicMarkType: function (graphicMarkType) {
      this.kLineChart.createGraphicMark(graphicMarkType)
    }
    ,
    removeAllGraphicMark() {
      this.kLineChart.removeGraphicMark()
    }
    ,
    requestData: function (currency, interval) {
      get(`https://api-adapter.backend.currency.com/api/v1/klines?symbol=` + currency + '&interval=' + interval)
        .then(response => {
            this.candleData = JSON.parse(JSON.stringify(response.data));
            this.kLineChart.applyNewData(this.mapToKLineData(this.candleData))
          },
        );
    },
    changeInterval: function (interval) {
      this.requestData(this.currentCurrency, interval)
      this.currentInterval = interval
    },
    changeCurrency: function (currency) {
      this.requestData(currency, this.currentInterval)
      this.currentCurrency = currency
    }
    ,
    mapToKLineData: function (data) {
      for (let index = 0; index < data.length; index++) {
        this.kLineData.push({
          timestamp: data[index][0],
          open: Number(data[index][1]),
          high: Number(data[index][2]),
          low: Number(data[index][3]),
          close: Number(data[index][4]),
          volume: data[index][5],
          turnover: (data[index][1] + data[index][4] + data[index][2] + data[index][3]) / 4 * data[index][5]
        })
      }
      return this.kLineData
    }
  }
  ,
  destroyed: function () {
    dispose('technical-indicator-k-line')
  }
}
</script>
