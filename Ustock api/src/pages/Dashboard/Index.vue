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

          <q-banner class="bg-grey-3 text-grey-8" id = "inicio">
            <template v-slot:avatar>
              <q-icon name="extension" color="primary" />
            </template>
            Olá <strong class="text-primary">{{userNow}}</strong> , antes de tudo analise os gráficos. . . em seguida podes realizar as tuas operações!
            <template v-slot:action>
              <q-btn to="/entrada" color="primary" label="Entradas" />
            </template>
          </q-banner>

        <div id="depois" v-show="pause==false" class="q-pt-md">
          <div  class="row flex flex-center">
            
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
        </div>
<!--           <q-
</div>
banner class="bg-grey-3 text-grey-9 q-mt-xl">
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
      pause:true,
      tab: "itens",
      x1V:0,
      x1M:0,
      x2V:0,
      x2M:0,
      x3V:0,
      x3M:0,
      x4V:0,
      x4M:0,
      stockMax:[],
      stockMin:[],
      stockZero:[],
      stockSuper:[],
      listArticles:[],
      listInputs:[],
      listOrders:[]
    };
  },
  mounted() {
    this.refreshAll() 
    this.timePause()
  },

  methods: {

    refreshAll() {
      this.drawTheChart();
      this.drawTheChart1();
      this.drawTheChart2();
      this.drawTheChart3();
    },
    timePause() {
      setTimeout(function(){  
      //document.getElementById("#inicio").hide(1800)
        $("#inicio").hide(1800)
      }, 3000); 

      setTimeout(function(){  
        //document.getElementById("#depois").show(1800)

      $("#depois").show(2200)
     this.pause = false
      }, 3400); 
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
                this.x1V = this.x1V +1
              }

              else if(this.listArticles[i].quantity == this.listArticles[i].total){
                this.x2V = this.x2V +1
              }

              
              else if(this.listArticles[i].quantity == this.listArticles[i].discount){
                this.x3V = this.x3V +1
              }
              else if(this.listArticles[i].quantity > this.listArticles[i].total && this.listArticles[i].quantity < this.listArticles[i].discount) {
                this.x4V = this.x4V +1
              }
              else {
                console.log("Stock Superior ao Limíte Máximo")
              }

            }
        var total = this.listArticles.length
        if(this.listArticles.length == 0 || this.listArticles == null)
          total = 100

        this.x1M = parseInt(this.x1V)*100/parseInt(total)
        this.x2M = parseInt(this.x2V)*100/parseInt(total)
        this.x3M = parseInt(this.x3V)*100/parseInt(total)
        this.x4M =parseInt(this.x4V)*100/parseInt(total)

        var ctx = document.getElementById("myChart");
          var myChart = new Chart(ctx, {
            type: "pie",
            data: {
              labels: ["Stock Nomal","Stock Zero","Stock Mínimo","Stock Máximo"],
              datasets: [
                {
                  label: "# Pecentagem(%)",
                  data: [this.x4M.toFixed(1),this.x1M.toFixed(1),this.x2M.toFixed(1),this.x3M.toFixed(1)],
                  backgroundColor: ["#1f7a99","#f74545","#faa973","#1a7046"],
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
          
        })
        .catch(err => {
          this.$store.commit("article/setErrors", err);
        });
       
    },
    format(x, y) {
      var z = {
          M: x.getMonth() + 1,
          d: x.getDate(),
          h: x.getHours(),
          m: x.getMinutes(),
          s: x.getSeconds()
      };
      y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
          return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
      });

      return y.replace(/(y+)/g, function(v) {
          return x.getFullYear().toString().slice(-v.length)
      });
    },
    drawTheChart1() {
      this.$store.commit("input/resetListInputs");
        this.$store
        .dispatch("input/listInputs")
        .then(res => {

          res.data.inputs.forEach(data => {

            this.$store.commit("input/setListInputs", data);
            this.listInputs = this.$store.getters[
              "input/getListInputs"
            ];
          });

        var inP = 0, totP = this.listInputs==null ? 0:this.listInputs.length

          for (let i in this.listInputs) {
              if(this.format(new Date(this.listInputs[i].createdAt), 'yyyy-MM-dd') == this.format(new Date(), 'yyyy-MM-dd')){
                inP = inP +1
              }
          }

          var ctx = document.getElementById("myChart1");
            var myChart = new Chart(ctx, {
              type: "doughnut",
              data: {
                labels: ["Entrada de Stock Hoje"],
                datasets: [
                  {
                    label: "#Stock",
                    data: [inP,30],
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
        })
        .catch(err => {
          this.$store.commit("input/setErrors", err);
        });
 
    },
    drawTheChart2() {

      this.$store
        .dispatch("order/listOrders")
        .then(res => {

          res.data.orders.forEach(data => {

            this.$store.commit("order/setListOrders", data);
            this.listOrders = this.$store.getters[
              "order/getListOrders"
            ];
          })

          var inO = 0, totO = this.listOrders==null ? 0:this.listOrders.length

          for (let i in this.listOrders) {
            if(this.format(new Date(this.listOrders[i].createdAt), 'yyyy-MM-dd') == this.format(new Date(), 'yyyy-MM-dd')){
                inO = inO +1
              }
          }

                var ctx = document.getElementById("myChart2");
      var myChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Transferência de Stock Hoje"],
          datasets: [
            {
              label: "#Transferência",
              data: [inO,30],
              backgroundColor: ["#9e4991"],
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
        })
        .catch(err => {
          this.$store.commit("order/setErrors", err);
        });

    },
    drawTheChart3() {

      this.$store
        .dispatch("material/listMaterials")
        .then(res => {
          res.data.materials.forEach(data => {
            this.$store.commit("material/setListMaterials", data);
            this.listMaterials = this.$store.getters["material/getListMaterials"];
          });
          var inM = 0, totM = this.listMaterials==null ? 0:this.listMaterials.length
          for (let i in this.listMaterials) {
              if(this.listMaterials[i].status== false){
                inM = inM +1
              }
          }

              var ctx = document.getElementById("myChart3");
              var myChart = new Chart(ctx, {
                type: "pie",
                data: {
                  labels: ["Equipamentos com Defeito"],
                  datasets: [
                    {
                      label: "#Equipamentos",
                      data: [inM,totM],
                      backgroundColor: ["#3a6dba"],
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
        })

    },
    streamData() {}
  }
};
</script>
 