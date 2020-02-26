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
            Olá <strong class="text-primary">{{userNow}}</strong> , antes de tudo analise os gráficos. . . em seguida podes realizar as tuas operações!
            <template v-slot:action>
              <q-btn to="/input" color="primary" label="Entradas" />
            </template>
          </q-banner>
          <div class="row flex flex-center">

            <div class="col-md-4">
              <canvas class="q-pr-md" id="myChart" width="100px" height="75px"></canvas>
            </div>
            
            <div class="col-md-4">
              <canvas class="q-pl-md" id="myChart1" width="100px" height="75px"></canvas>
            </div>            
 
          </div>

          <div class="row flex flex-center q-pt-xl">

            <div class="col-md-4">
              <canvas class="q-pr-md" id="myChart2" width="100px" height="75px"></canvas>
            </div>
            
            <div class="col-md-4">
              <canvas class="q-pl-md" id="myChart3" width="100px" height="75px"></canvas>
            </div>            
 
          </div>
<!--           <q-banner class="bg-grey-3 text-grey-9 q-mt-xl">
            <template v-slot:avatar>
              <q-icon name="info" color="primary" />
            </template>
            ... Sabias que "U-Stock App" dá seguraça e controle para o seu Estoque? (º_^)
            <template v-slot:action>
              <q-btn flat color="primary" label="Ler +" />
            </template>
          </q-banner> -->

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
      userNow: localStorage.getItem('name'),
      tab: "itens",
      x1V:0,
      x1M:'Stock Zerado!',
      x2V:0,
      x2M:'Stock Mínimo',
      x3V:0,
      x3M:'Stock Máximo',
      x4V:0,
      x4M:'Stock Superior ao Limite Máximo',
      listArticles:[],
      stockMax:[],
      stockMin:[],
      stockZero:[],
      stockSuper:[]

    };
  },
  mounted() {
    
/*     this.drawTheChart();
    this.drawTheChart1();
    this.drawTheChart2();
    this.drawTheChart3(); */

  },
  created(){
    this.drawTheChart();
    this.drawTheChart1();
    this.drawTheChart2();
    this.drawTheChart3();
  },
  methods: {
    list() {
        this.$store.commit("article/resetListArticles");
        this.$store
        .dispatch("article/listArticles")
        .then(res => {
          
          res.data.articles.forEach(data => {
            this.$store.commit("article/setListArticles", data);
            this.listArticles = this.$store.getters["article/getListArticles"];
          });
           console.log(this.listArticles)
        })
        .catch(err => {
          this.$store.commit("article/setErrors", err);
        });
    },
    drawTheChart() {
      this.$store.commit("article/resetListArticles");
        this.$store
        .dispatch("article/listArticles")
        .then(res => {
          
          res.data.articles.forEach(data => {
            this.$store.commit("article/setListArticles", data);
            this.listArticles = this.$store.getters["article/getListArticles"];
          });

            for (let i in this.listArticles){
              if(this.listArticles[i].quantity == 0){
                console.log("Stock 0")
              }

              else if(this.listArticles[i].quantity > 0 && this.listArticles[i].quantity == this.listArticles[i].total){
                console.log("Stock Mínimo")
              }

              
              else if(this.listArticles[i].quantity == this.listArticles[i].discount){
                console.log("Stock Máximo")
              }
              else {
                console.log("Stock Superior ao Limíte Máximo")
              }

            }
        })
        .catch(err => {
          this.$store.commit("article/setErrors", err);
        });



      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Ei"],
          datasets: [
            {
              label: "# de Produtos",
              data: [1,100],
              backgroundColor: ["#c10015"],
              borderColor: ["#f7f9fa"],
              borderWidth: 5
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
        type: "doughnut",
        data: {
          labels: ["Entrada de Stock Hoje"],
          datasets: [
            {
              label: "#Stock",
              data: [0,100],
              backgroundColor: ["#0b9fbd"],
              borderColor: ["#f7f9fa"],
              borderWidth: 5
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
        type: "pie",
        data: {
          labels: ["Transferência de Stock Hoje"],
          datasets: [
            {
              label: "#Transferência",
              data: [70,7],
              backgroundColor: ["#31ccec"],
              borderColor: ["#f7f9fa"],
              borderWidth: 5
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
    drawTheChart3() {
      var ctx = document.getElementById("myChart3");
      var myChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Equipamentos com Defeito"],
          datasets: [
            {
              label: "#Equipamentos",
              data: [8,70],
              backgroundColor: ["#0b9fbd"],
              borderColor: ["#f7f9fa"],
              borderWidth: 5
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
