<template>
  <Layout title="Chart" v-bind:style="{backgroundColor: theme === 'dark' ? '#1f2126' : ''}">
    <div>
      <v-toolbar dense color="background">
        <v-btn-toggle v-model="currentInterval"
                      dense group @change="changeInterval">
          <v-btn v-for="({ key, text }) in supportedInterval" :key="key" :value="key" small plain>
            {{text}}
          </v-btn>
        </v-btn-toggle>
        <v-divider
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialogIndicatorOpen"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              plain
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-function-variant</v-icon>
              &nbsp;
              Indicator
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Индикаторы</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-container fluid>
                  <v-combobox
                    v-model="currentTechnicalIndicator"
                    @change="setCandleTechnicalIndicator"
                    :items="mainTechnicalIndicatorTypes"
                    label="Индикатор основного графика"
                    clearable
                    dense
                    solo
                  ></v-combobox>
                </v-container>
                <v-container fluid>
                  <v-combobox
                    v-model="currentSubTechnicalIndicator"
                    @change="setSubTechnicalIndicator"
                    :items="subTechnicalIndicatorTypes"
                    label="Индикатор дополнительного графика"
                    solo
                    clearable
                    dense
                  ></v-combobox>
                </v-container>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogIndicatorOpen = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider
          vertical
        ></v-divider>
        <v-overflow-btn
          v-model="currentCurrency"
          @change="changeCurrency"
          :items="supportedСurrency"
          item-text="text"
          item-value="key"
          editable
          hide-details
          overflow
        ></v-overflow-btn>
        <v-divider
          vertical
        ></v-divider>
        <v-overflow-btn
          v-model="currentChartType"
          @change="setChartType"
          :items="chartTypes"
          item-text="text"
          item-value="key"
          editable
          hide-details
          overflow
        ></v-overflow-btn>
        <v-divider
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn class="ma-2" tile large icon @click="changeTheme">
          <span v-if="theme === 'light'">
            <v-icon>mdi-weather-night </v-icon>  Dark
          </span>
          <span v-else>
            <v-icon>mdi-white-balance-sunny </v-icon>  Light
          </span>
        </v-btn>
      </v-toolbar>
    </div>
    <v-row
      class="fill-height"
      no-gutters
    >
      <v-card>
        <v-navigation-drawer
          mini-variant
          mini-variant-width="60"
          permanent
          color="background"
        >
          <v-list-item
            v-for="({ key, text, icon }) in graphicMarks"
            :key="key">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="setGraphicMarkType(key)"
                  v-bind="attrs"
                  v-on="on"
                  small
                  icon
                >
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ text }}</span>
            </v-tooltip>
          </v-list-item>

          <v-divider></v-divider>


          <v-list-item>
            <v-btn
              @click="removeAllGraphicMark()"
              small
              icon
            >
              <v-icon>mdi-beaker-remove</v-icon>
            </v-btn>
          </v-list-item>
        </v-navigation-drawer>
      </v-card>
      <div id="technical-indicator-k-line" class="k-line-chart"/>
    </v-row>
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
      currentChartType: 'candle_solid',
      dialogIndicatorOpen: false,
      theme: 'light',
      graphicMarks: [
        {key: 'priceLine', text: 'priceLine', icon: 'mdi-ray-start'},
        {key: 'priceChannelLine', text: 'priceChannelLine', icon: 'mdi-menu '},
        {key: 'parallelStraightLine', text: 'parallelStraightLine', icon: 'mdi-tune-variant '},
        {key: 'fibonacciLine', text: 'fibonacciLine', icon: 'mdi-format-align-justify '},
        {key: 'rect', text: 'rect', icon: 'mdi-vector-rectangle'},
        {key: 'circle', text: 'circle', icon: 'mdi-vector-circle'}
      ],
      currentSubTechnicalIndicator: 'VOL',
      currentTechnicalIndicator: 'MA',
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
      currentCurrency: `USD/BYN`,
      currency: {key: `USD/BYN`, text: `USD to BYN`},
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
      if (!type) {
        this.kLineChart.removeTechnicalIndicator('candle_pane')
        this.currentTechnicalIndicator = null
      } else {
        this.kLineChart.createTechnicalIndicator(type, false, {id: 'candle_pane'})
        this.currentTechnicalIndicator = type
      }
    }
    ,
    setSubTechnicalIndicator: function (type) {
      if (!type) {
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
      console.log('currency', currency);
      this.requestData(currency, this.currentInterval)
      this.currentCurrency = currency
    }
    ,
    changeTheme: function () {
      const isDark = this.theme === 'dark';
      this.$vuetify.theme.dark = !isDark;
      const targetTheme = isDark ? 'light' : 'dark';
      this.setTheme(targetTheme);
    },
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
