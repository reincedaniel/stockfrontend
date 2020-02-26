<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="dark"
        indicator-color="dark"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Saidas" />
        <q-tab icon="fast_food" disable name="estoque" label="" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
                    <q-dialog v-model="mediumSaida" persistent>
            <q-card style="width: 800px; max-width: 100vw;">
              <q-card-section>
                <div class="text-h6">Ver Detalhes</div>
              </q-card-section>

              <q-card-section class="q-pt-none">

                  <!-- TABLE Articles -->
                  <q-table
                    class="no-border-radius my-sticky-column-table"
                    :data="ordem"
                    color="info"
                    :columns="columnsVer"
                    selection="single"
                    
                  ></q-table>
  
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="positive" @click="ordem= []" label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <div class="row q-gutter-sm">
              <q-input
                color="primary"
                autofocus
                dense
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn size="xs" color="grey-7" @click="filter = ''" icon="format_clear" />
              <q-btn size="md" round v-if="!Object.keys(selected).length" color="info" @click="refresh()" icon="refresh" />
              <q-btn size="md" v-if="Object.keys(selected).length == 1" color="positive" label="Ver Detalhes" @click="verDetalhes(selected[0].id)" icon="toc" />

            </div>
        </div>
          <div class="q-pa-md">
            <!-- TABLE Articles -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="data"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="multiple"
              :selected.sync="selected"
              :fullscreen="isFullscreen"
            >
                <template v-slot:top>
                <q-btn class="q-mr-md" color="primary" icon="fullscreen"  @click="isFullscreen=!isFullscreen" />
                <q-btn label="Exportar - Excel" color="primary" @click="onexport" icon="print" />
              </template>
            
            </q-table>
          </div>
        </q-tab-panel>

        <q-tab-panel v-model="tab" name="estoque">
          <p>Estoque</p>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    return {
      tab: "itens",
      model: null,
      mediumSaida:false,
      isFullscreen:false,
      dis_stock:false,
      options: [],
      ordem:[],
      options1: [],
      listOrders:[],
      providerGet:[],
      statusOption:'Activo',
      ad: localStorage.getItem("level"),
      filter: "",
      selected: [],
          Datas: {
      // We will make a Workbook contains 2 Worksheets
      'animals': [
                  {"name": "cat", "category": "animal"}
                  ,{"name": "dog", "category": "animal"}
                  ,{"name": "pig", "category": "animal"}
                ],
      'pokemons': [
                  {"name": "pikachu", "category": "pokemon"}
                  ,{"name": "Arbok", "category": "pokemon"}
                  ,{"name": "Eevee", "category": "pokemon"}
                ]
    },
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Código (Saida)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "description", align: "left", label: "Cliente/Equipamento", field: "description",sortable: true },
/*         { name: "manufactured_by", align: "left", label: "Fabricante", field: "manufactured_by",sortable: true }, 
        { name: "modelo", align: "left", label: "Modelo", field: "modelo",sortable: true },      */
        { name: "operation", align: "left", label: "Operação", field: "operation",sortable: true },
        { name: "qtd_dis",align: "left",  label: "ARTG-Dis.", field: "qtd_dis",sortable: true },
        { name: "qtd_total",align: "left",  label: "ARTG-Total", field: "qtd_total",sortable: true },        
/*         { name: "user",align: "left", label: "Usuário", field: "user",sortable: true }, */
        { name: "createdAt",align: "left", label: "Data de Saida", field: "createdAt",sortable: true }
      ],
      data: [],
      columnsVer: [
        {
          name: "artigo",
          required: true,
          label: "Artigo (Descrição)",
          align: "left",
          field: row => row.artigo,
          format: val => `${val}`,
          sortable: true
        },
        { name: "qtd_total", align: "left", label: "QTD", field: "qtd_total",sortable: true },
        { name: "operation", align: "left", label: "Operação", field: "operation",sortable: true }/* ,
        { name: "qtd_dis",align: "left",  label: "ARTG-Dis.", field: "qtd_dis",sortable: true },
        { name: "qtd_total",align: "left",  label: "ARTG-Total", field: "qtd_total",sortable: true },
        { name: "createdAt",align: "left", label: "Data de Saida", field: "createdAt",sortable: true } */
      ]
    };
  },
  mounted(){
    this.refresh();
  },
  methods: {

    onexport () { // On Click Excel download button
    
      this.Datas.animals = [];

          for (let i in this.selected) {
            if (this.selected.hasOwnProperty(i)) {
                    this.Datas.animals.push({
                          id: this.selected[i].id,
                          Código: this.serializeUs(this.selected[i].internal_code),
                         Destino: this.data[i].description,
                         Operação: this.serializeUs(this.selected[i].operation), 
                          Tipo_de_Artigo: this.serializeUs(this.selected[i].qtd_dis),
                          Quantidade_de_Artigo: this.serializeUs(this.selected[i].qtd_total),
                          Data: this.selected[i].createdAt
                        });
                }
          }    
      // export json to Worksheet of Excel
      // only array possible
      var animalWS = XLSX.utils.json_to_sheet(this.Datas.animals) 
     // var pokemonWS = XLSX.utils.json_to_sheet(this.Datas.pokemons) 

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new() // make Workbook of Excel

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
     XLSX.utils.book_append_sheet(wb, animalWS, 'animals') // sheetAName is name of Worksheet
     // XLSX.utils.book_append_sheet(wb, pokemonWS, 'pokemons')   

      // export Excel file
      XLSX.writeFile(wb, 'book.xlsx') // name of the file is 'book.xlsx'
    },
    //SerializeUs
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },
    serializeUsNumber(value) {
      if(value=='' || value ==null)return '0'
      else return value
    },
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("order/resetListOrders");
      this.listOfOrders()
      this.bemFeito = false
    },
     verDetalhes(id) {
        this.mediumSaida =true
          for (let i in this.listOrders) {
            if (this.listOrders.hasOwnProperty(i)) {
              if(this.listOrders[i].id == id){
              this.listOrders[i].OrderItems.forEach(c => {
                  
                    this.ordem.push({
                          id: c.id,
                          internal_code: c.internal_code,
                          qtd_total: this.serializeUs(c.quantity_item),
                          artigo: c.Article.description,
                          operation: this.listOrders[i].Operation == null
                              ? '------'
                              : this.serializeUs(this.listOrders[i].Operation.name),
                          
                        });
                  
                    
                })

                }
            }
          } 

    },
    // *******************LIST orders
    listOfOrders() {
      this.$store
        .dispatch("order/listOrders")
        .then(res => {

          res.data.orders.forEach(data => {

            this.$store.commit("order/setListOrders", data);
            this.listOrders = this.$store.getters[
              "order/getListOrders"
            ];
          });

          this.data = [];
          
          for (let i in this.listOrders) {
            if (this.listOrders.hasOwnProperty(i)) {
              let valQTD=0

              this.listOrders[i].OrderItems.forEach(c => {
                  if(this.listOrders[i].id == c.orderId){
                    valQTD = parseInt(valQTD) + parseInt(c.quantity_item)
                  }
                    
                })
                var dataEx = this.listOrders[i].createdAt.split('T')
                    this.data.push({
                      createdAt: dataEx[0],
                          id: this.listOrders[i].id,
                          internal_code: this.serializeUs(this.listOrders[i].internal_code),
                          qtd_dis: this.serializeUs(this.listOrders[i].quantity_input),
                          qtd_total: this.serializeUs(valQTD),                          
                          description: this.listOrders[i].Client == null
                              ? this.serializeUs(this.listOrders[i].Material.description)
                              : this.serializeUs(this.listOrders[i].Client.name),
                          operation: this.listOrders[i].Operation == null
                              ? '------'
                              : this.serializeUs(this.listOrders[i].Operation.name),
                          
                        });
                }
          }          


        })

        .catch(err => {
          this.$store.commit("order/setErrors", err);
        });
    }

  }
};
</script>

<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
 

  thead tr:first-child th:first-child
    /* bg color is important for th;#9eefff just specify one */
    background-color: #fff

  td:first-child
    background-color: white

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

