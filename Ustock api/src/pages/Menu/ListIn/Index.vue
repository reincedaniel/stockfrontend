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
        <q-tab icon="item" name="itens" label="Entradas" />
        <q-tab icon="fast_food" disable name="estoque" label="" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
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
      dis_stock:false,
      isFullscreen:false,
      options: [],
      options1: [],
      listInputs:[],
      providerGet:[],
      statusOption:'Activo',
      ad: localStorage.getItem("level"),
      filter: "",
      selected: [],
      Datas: {
      'animals': []
    },
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Código (Entrada)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "description", align: "left", label: "Entradas", field: "description",sortable: true },
/*         { name: "manufactured_by", align: "left", label: "Fabricante", field: "manufactured_by",sortable: true }, 
        { name: "modelo", align: "left", label: "Modelo", field: "modelo",sortable: true },      */
        { name: "quantity_input", align: "left", label: "QTD", field: "quantity_input",sortable: true },
        { name: "purchase",align: "left",  label: "Preço(KZ)", field: "purchase",sortable: true },
        { name: "discount",align: "left",  label: "Desconto(KZ)", field: "discount",sortable: true },
        { name: "iva",align: "left",  label: "IVA", field: "iva",sortable: true },
        { name: "total",align: "left",  label: "Total(KZ)", field: "total",sortable: true },
        { name: "Provider",align: "left",  label: "Fornecedor", field: "Provider",sortable: true },
/*         { name: "user",align: "left", label: "Usuário", field: "user",sortable: true }, */
        { name: "createdAt",align: "left", label: "Data Entrada", field: "createdAt",sortable: true }
      ],
      data: []
    };
  },
  mounted(){
    this.refresh();
  },
  methods: {


    onexport () { // On Click Excel download button
    console.log('-----ddddd----')
console.log(this.selected)
      this.Datas.animals = [];

          for (let i in this.selected) {
            if (this.selected.hasOwnProperty(i)) {
                    this.Datas.animals.push({
                          id: this.selected[i].id,
                          Código: this.serializeUs(this.selected[i].internal_code),
                         Artigo: this.data[i].description,
                         Fabricante: this.serializeUs(this.selected[i].manufactured_by), 
                          Modelo: this.serializeUs(this.selected[i].modelo),
                          Fornecedor:
                            this.selected[i].Provider == null
                              ? "Nenhum"
                              : this.selected[i].Provider,
                          Preço : this.selected[i].purchase == null
                              ? "0"
                              : this.serializeUs(this.selected[i].purchase),

                          IVA : this.selected[i].iva == null
                              ? "0%"
                              : this.serializeUs(this.selected[i].iva)+"%",
                          Desconto : this.selected[i].discount == null
                              ? "0"
                              : this.serializeUs(this.listInputs[i].discount),
                          Total : this.selected[i].total == null
                              ? "0"
                              : this.serializeUs(this.selected[i].total),
                          Quantidade: this.serializeUs(this.selected[i].quantity_input),
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
      this.$store.commit("input/resetListInputs");
      this.listOfInputs()
      this.bemFeito = false
    },
    // *******************LIST INPUTS
    listOfInputs() {
      this.$store
        .dispatch("input/listInputs")
        .then(res => {

          res.data.inputs.forEach(data => {

            this.$store.commit("input/setListInputs", data);
            this.listInputs = this.$store.getters[
              "input/getListInputs"
            ];
          });

          this.data = [];

          for (let i in this.listInputs) {
            if (this.listInputs.hasOwnProperty(i)) {
              var dataEx = this.listInputs[i].createdAt.split('T')
                    this.data.push({
                          id: this.listInputs[i].id,
                          internal_code: this.serializeUs(this.listInputs[i].internal_code),
                         description: this.listInputs[i].Article.description,
                         marca: this.serializeUs(this.listInputs[i].Article.marca),
                          modelo: this.serializeUs(this.listInputs[i].Article.modelo),
                          manufactured_by: this.serializeUs(this.listInputs[i].Article.manufactured_by), 
                          purchase : this.listInputs[i].purchase == null
                              ? "0"
                              : this.serializeUs(this.listInputs[i].purchase),

                          iva : this.listInputs[i].iva == null
                              ? "0"
                              : this.serializeUs(this.listInputs[i].iva),
                          discount : this.listInputs[i].discount == null
                              ? "0"
                              : this.serializeUs(this.listInputs[i].discount),
                          total : this.listInputs[i].total == null
                              ? "0"
                              : this.serializeUs(this.listInputs[i].total),
                          providerId: this.listInputs[i].providerId,
                          quantity_input: this.serializeUs(this.listInputs[i].quantity_input),
                          Provider:
                            this.listInputs[i].Provider == null
                              ? "Nenhum"
                              : this.listInputs[i].Provider.name,
                          ProviderCode:
                            this.listInputs[i].Provider == null
                              ? "Nenhum"
                              : this.listInputs[i].Provider.internal_code,
                          createdAt: dataEx[0],
                        });
                }
          }          


        })

        .catch(err => {
          this.$store.commit("input/setErrors", err);
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

