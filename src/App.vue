<template>
  <v-app>
    <v-main>
      <TechnicalIndicatorKLineChart/>
    </v-main>
  </v-app>
</template>

<script>
import TechnicalIndicatorKLineChart from '@/components/TechnicalIndicatorKLineChart'

export default {
  name: 'App',

  components: {
    TechnicalIndicatorKLineChart
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F2F3F5;
}

div, p {
  box-sizing: border-box;
}

p {
  margin: 0;
}

.app {
}

.k-line-chart-container {
  display: flex;
  flex-direction: column;
  margin: 15px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
  background-color: #FFFFFF;
  padding: 16px 6px 16px 16px;
}

.k-line-chart-title {
  margin: 0;
  color: #252525;
  padding-bottom: 10px;
}

.k-line-chart {
  display: flex;
  flex: 1;
}

.k-line-chart-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  color: #606060;
}

.v-btn {
  text-transform: none;
}

.v-overflow-btn.v-input .v-input__slot {
  border: 0;
}

.k-line-chart-menu-container button {
  cursor: pointer;
  background-color: #2196F3;
  border-radius: 2px;
  margin-right: 8px;
  height: 24px;
  line-height: 26px;
  padding: 0 6px;
  font-size: 12px;
  color: #fff;
  border: none;
  outline: none;
}
</style>
