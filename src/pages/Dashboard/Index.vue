<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Dashboard" />
        <q-tab icon="fast_food" disable name="estoque" label />
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
          <q-banner class="bg-grey-3 text-grey-8">
            <template v-slot:avatar>
              <q-icon name="extension" color="primary" />
            </template>
            Olá <strong>{{userNow}}</strong> , antes de tudo analise os gráficos. . . em seguida podes realizar as tuas operações!
            <template v-slot:action>
              <q-btn to="/input" color="secondary" label="Entradas" />
            </template>
          </q-banner>
          <div class="flex flex-center">

            <div class="col-md-4">
              <canvas id="myChart2" width="400" height="400"></canvas>
            </div>

            <div class="col-md-4">
              <canvas id="myChart1" width="400" height="400"></canvas>
            </div>

            <div class="col-md-4">
              <canvas id="myChart" width="400" height="400"></canvas>
            </div>
            
          </div>
          <q-banner class="bg-grey-3 text-grey-9">
            <template v-slot:avatar>
              <q-icon name="info" color="primary" />
            </template>
            ... Sabias que "U-Stock App" dá seguraça e controle para o seu Estoque? (º_^)
            <template v-slot:action>
              <q-btn flat color="primary" label="Ler +" />
            </template>
          </q-banner>
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="estoque">
          <div class="q-pa-md">
            <p>22</p>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import Chart from "chart.js";
export default {
  data() {
    return {
      userNow: localStorage.getItem('username'),
      tab: "itens",
      curTemp: 24,
      curHum: 12,
      maxvar: 100,
      mChart: null
    };
  },
  mounted() {
    this.drawTheChart();
    this.drawTheChart1();
    this.drawTheChart2();
    this.streamData();
  },
  methods: {
    drawTheChart() {
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Manutenção"],
          datasets: [
            {
              label: "# de Produtos",
              data: [7],
              backgroundColor: ["rgba(38, 166, 154)"],
              borderColor: ["rgba(38, 166, 154, 1)"],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    },
    drawTheChart1() {
      var ctx = document.getElementById("myChart1");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Estoque Em Falta", "Estoque Cheio"],
          datasets: [
            {
              label: "# de Produtos",
              data: [7, 19],
              backgroundColor: ["rgba(38, 166, 154, 1)", "rgba(38, 166, 154)"],
              borderColor: ["rgba(38, 166, 154, 1)", "rgba(38, 166, 154, 1)"],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    },
    drawTheChart2() {
      var ctx = document.getElementById("myChart2");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Tarefas"],
          datasets: [
            {
              label: "# Tarefas/Hoje",
              data: [7],
              backgroundColor: ["#0b9fbd"],
              borderColor: ["rgba(#0b9fbd, 1)"],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    },
    streamData() {}
  }
};
</script>
