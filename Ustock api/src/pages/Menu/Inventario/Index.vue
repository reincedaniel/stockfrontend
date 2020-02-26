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
        <q-tab icon="item" name="itens" label="Artigo" />
        <q-tab icon="fast_food" disable name="estoque" label />
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
              <!--               <q-btn size="xs" color="blue-7" v-if="!Object.keys(selected).length" to="/category" icon="toll" /> -->
              <q-btn
                size="md"
                round
                v-if="!Object.keys(selected).length"
                color="info"
                @click="refresh()"
                icon="refresh"
              />
              <q-btn
                size="md"
                round
                color="primary"
                v-if="!Object.keys(selected).length"
                @click="medium = true"
                icon="add_box"
              />
              <q-btn
                v-if="Object.keys(selected).length==1 && ad==1"
                @click="editArticle()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length==1 && ad==1"
                @click="deleteArticle()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

              <q-btn
                v-if="Object.keys(selected).length==1 && ad==1"
                @click="mediumIn = true"
                size="md"
                color="accent"
                label="Dar Entrada de Stock"
                icon="redo"
              />
              <!-- <q-btn size="md" color="primary" label="Out" icon="undo" /> -->
            </div>
          </div>
          <q-dialog v-model="mediumIn" persistent>
            <q-card style="width: 800px; max-width: 100vw;">
              <q-card-section>
                <div class="text-h6">Entrada de Stock</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">
                  <q-input
                    autofocus
                    color="primary"
                    v-model="input.purchase"
                    label="Preço de Compra (Kz)"
                    type="number"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="input.discount"
                    label="Desconto (%)"
                    type="number"
                    dense
                  />

                  <q-select
                    label="IVA (%)"
                    :options="['0','14']"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                    behavior="menu"
                    color="primary"
                    v-model="input.iva"
                    input-debounce="0"
                    style="width: 250px"
                  />

                  <q-input
                    color="primary"
                    v-model="input.total"
                    disable
                    label="Total (Kz)"
                    type="number"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="input.quantity_input"
                    label="Quantidade"
                    type="number"
                    dense
                  />

                  <q-select
                    color="primary"
                    v-model="providerValue"
                    use-input
                    input-debounce="0"
                    label="Fornecedor"
                    :options="optionsProvider1"
                    @filter="filterFn4"
                    style="width: 250px"
                    behavior="menu"
                    :rules="[val => !!val || 'Obrigatório']"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">Não Encontrado!</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </q-card-section>
              <q-card-actions align="right" class="text-primary">
                <!--                 <q-btn color="green-8" v-if="bemFeito ==true" label="Entrada de Stock Bem Sucedida" @click="onReset()" v-close-popup /> -->
                <q-btn color="warning" label="Cancelar" @click="onReset()" v-close-popup />
                <q-btn @click="addInp()" color="secondary" label="Confirmar" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="medium" persistent>
            <q-card style="width: 800px; max-width: 100vw;">
              <q-card-section>
                <div class="text-h6">Artigo</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">
                  <q-input
                    autofocus
                    color="primary"
                    v-model="article.description"
                    label="Descrição"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="article.total"
                    type="number"
                    label="Stock Mín."
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    type="number"
                    v-model="article.discount"
                    label="Stock Max."
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="article.serial_number"
                    label="Serial Number"
                    dense
                  />

                  <q-input color="primary" v-model="article.manufactured_by" label="Marca" dense />

                  <q-input color="primary" v-model="article.modelo" label="Modelo" dense />

                  <q-select
                    label="Tipo"
                    v-model="statusOption"
                    :options="['Activo','Inativo']"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                  />

                  <q-input
                    v-if="statusOption =='Inativo'"
                    autofocus
                    color="primary"
                    v-model="article.obs"
                    label="Motivo"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />

                  <q-input color="primary" v-model="article.info" label="Observação" dense />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onReset()" v-close-popup />
                <q-btn
                  v-if="editButton ==false"
                  @click="addArticle()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButton ==true"
                  @click="updateArticle()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE Articles -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="data"
              :fullscreen.sync="isFullscreen"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="multiple"
              :selected.sync="selected"
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
      isFullscreen:false,
      model: null,
      dis_stock: false,
      options: [],
      options1: [],
      listInputs: [],
      listArticlesQuantity: [],
      providerGet: [],
              Datas: {
      // We will make a Workbook contains 1 Worksheet
      'animals': []
    },
      statusOption: "Activo",
      ad: localStorage.getItem("level"),
      editButton: false,
      catergoryOption: "",
      typeOption: "A",
      listProviders: [],
      providerValue: "",
      optionsProvider: [],
      optionsProvider1: [],
      listCategories: [],
      listArticles: [],
      catGet: [],
      type: ["A", "B", "C"],
      medium: false,
      mediumIn: false,
      bemFeito: false,
      dis: true,
      articleId: null,
      providerId: null,
      inputId: null,
      input: {
        providerId: null, //agora
        purchase: null, //agora
        iva: null, //agora
        discount: null, //agora
        total: 0, //agora
        quantity_input: null, //agora
        userId: null
      },
      articleXXXX: {
        internal_code: null,
        description: null,
        marca: null,
        modelo: null,
        color: null,
        obs: null,
        type_value: null,
        manufactured_by: null,
        serial_number: null,
        year_made: null,
        status: null,
        userId: null,
        iva: null,
        purchase: null,
        total: null,
        discount: null
      },
      article: {
        internal_code: null,
        description: null,
        modelo: null,
        obs: null,
        info: null,
        manufactured_by: null,
        serial_number: null,
        status: null,
        userId: null,
        quantity:0,
        total:10,
        discount:20,
        providerId: null
      },
      filter: "",
      selected: [],
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Código (Artigo)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "description",
          align: "left",
          label: "Artigo",
          field: "description",
          sortable: true
        },
        {
          name: "manufactured_by",
          align: "left",
          label: "Fabricante",
          field: "manufactured_by",
          sortable: true
        },
        {
          name: "modelo",
          align: "left",
          label: "Modelo",
          field: "modelo",
          sortable: true
        },
        {
          name: "serial_number",
          align: "left",
          label: "Serial Number",
          field: "serial_number"
        },
        {
          name: "stockMin",
          align: "left",
          label: "Stock-Mín",
          field: "stockMin",
          sortable: true
        },
        {
          name: "stockMax",
          align: "left",
          label: "Stock-Max",
          field: "stockMax",
          sortable: true
        },
        {
          name: "quantity_input",
          align: "left",
          label: "Stock",
          field: "quantity_input",
          sortable: true
        },
        /*         { name: "purchase",align: "left",  label: "Preço(KZ)", field: "purchase",sortable: true },
        { name: "discount",align: "left",  label: "Desconto(%)", field: "discount",sortable: true },
        { name: "iva",align: "left",  label: "IVA(%)", field: "iva",sortable: true },
        { name: "total",align: "left",  label: "Total(KZ)", field: "total",sortable: true },
        { name: "Provider",align: "left",  label: "Fornecedor", field: "Provider",sortable: true }, */
        {
          name: "status",
          align: "left",
          label: "Estado",
          field: "status",
          sortable: true
        },
        {
          name: "obs",
          align: "left",
          label: "Motivo",
          field: "obs",
          sortable: true
        },
        {
          name: "info",
          align: "left",
          label: "OBS.",
          field: "info",
          sortable: true
        }
        /*         { name: "user",align: "left", label: "Usuário", field: "user",sortable: true } */
      ],
      data: []
    };
  },
  mounted() {
    //this.refresh();
  },
  created() {
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
                         Artigo: this.data[i].description,
                         Fabricante: this.serializeUs(this.selected[i].manufactured_by), 
                          Modelo: this.serializeUs(this.selected[i].modelo),
                          Serial : this.serializeUs(this.selected[i].serial_number),
                          Stock_Min : this.serializeUs(this.selected[i].stockMin),
                          Stock_Max : this.serializeUs(this.selected[i].stockMax),
                          Stock : this.serializeUs(this.selected[i].quantity_input),
                          Motivo_Inativo : this.serializeUs(this.selected[i].info)
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
      if (value == "" || value == null) return "-------";
      else return value;
    },
    serializeUsNumber(value) {
      if (value == "" || value == null) return "0";
      else return value;
    },
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("article/resetListArticles");
      this.$store.commit("provider/resetListProviders");
      this.$store.commit("input/resetListInputs");
      this.listOfProviders();
      this.listOfInputs();
      /*       this.$store.commit("category/resetListCategories");
      this.listOfCategories(); */
      this.listOfArticles();
      this.bemFeito = false;
    },
    // ****************ADD RPODUCTS
    addInp() {
      if (this.providerValue == "" || this.providerValue == null) {
      } else {
        this.bemFeito = true;
        this.input.iva == null || this.input.iva == ""
          ? (this.input.iva = 0)
          : this.input.iva;
        this.input.purchase == null || this.input.purchase == ""
          ? (this.input.purchase = 0)
          : this.input.purchase;
        this.input.discount == null || this.input.discount == ""
          ? (this.input.discount = 0)
          : this.input.discount;

        this.input.quantity_input == null || this.input.quantity_input == ""
          ? (this.input.quantity_input = 0)
          : this.input.quantity_input;
        this.input.total == null || this.input.total == ""
          ? (this.input.total = 0)
          : this.input.total;
        this.input.userId = localStorage.getItem("id");
        this.providerGet.push(
          this.listProviders.filter(c => {
            return c.name == this.providerValue;
          })
        );

        this.input.articleId = this.selected[0].id;
        this.input.providerId = this.providerGet[0][0].id;

        this.input.total =
          parseFloat(this.input.purchase) -
          (parseFloat(this.input.discount) * parseFloat(this.input.purchase)) /
            100;
        this.input.total =
          parseFloat(this.input.total) +
          (parseFloat(this.input.iva) * parseFloat(this.input.total)) / 100;

        this.$store
          .dispatch("input/addInputsArticles", { Input: this.input })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("input/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel adicionar Stock!";
                  break;

                case 1:
                  {
                    var valor = 0;
                    valor =
                      parseInt(res.data.inputsx.quantity==null?0:res.data.inputsx.quantity) +
                      parseInt(this.input.quantity_input);
                    this.$store.dispatch("article/updateArticles", {
                      idArticle: this.selected[0].id,
                      Article: { quantity: valor }
                    }).then((f)=>{
                      this.refresh();
                    });
                    clr = "green-4";
                    msm = "Confirmado Com Sucesso!";

                    // this.$store.commit("input/resetListInputs");
                    this.filter = this.selected[0].description;

                    this.mediumIn = false;
                    this.onReset();
                  }
                  break;

                case 11:
                  msm = "O Produto já existe!";
                  break;

                default:
                  msn = "Contacte o Suporte da UCall: +244 936785605!";
                  break;
              }
              this.$q.notify({
                color: clr,
                position: "top-right",
                textColor: "white",
                icon: "fas fa-check-circle",
                message: msm
              });
            }
          })
          .catch(err => {
            this.$store.commit("input/setErrors", err);
          });
      }
    },

    // ****************ADD RPODUCTS
    addArticle() {
      if (this.article.description == "" || this.article.description == null) {
      } else {
        this.article.userId = localStorage.getItem("id");
        this.article.status = this.statusOption == "Activo" ? true : false;
        if (this.article.status == true) this.article.obs = null;

        this.$store
          .dispatch("article/addArticles", { Article: this.article })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("article/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel adicionar Produto!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Categoria Com Sucesso!";
                    this.$store.commit("article/resetListArticles");
                    this.editButton = false;
                    this.filter = this.article.description;
                    this.onReset();
                    this.onReset();
                    this.refresh()
                  }
                  break;

                case 11:
                  msm = "O Produto já existe!";
                  break;

                default:
                  msn = "Contacte o Suporte da UCall: +244 936785605!";
                  break;
              }
              this.$q.notify({
                color: clr,
                position: "top-right",
                textColor: "white",
                icon: "fas fa-check-circle",
                message: msm
              });
            }
          })
          .catch(err => {
            this.$store.commit("login/setErrors", err);
          });
      }
    },
    //****************DELETE Articles */
    deleteArticle() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar este produto?",
          cancel: "Cancelar",
          ok:"Confirmar",
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("article/deleteArticles", {
              idArticle: this.selected[0].id,
              idInput: this.selected[0].inputId
            })
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("article/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Apagar este Produto!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Produto Apagado Com Sucesso!";
                      this.onReset();
                      this.refresh()
                      this.filter = "";
                    }
                    break;

                  default:
                    msn = "Contacte o Suporte da UCall: +244 936785605!";
                    break;
                }
                this.$q.notify({
                  color: clr,
                  position: "top-right",
                  textColor: "white",
                  icon: "fas fa-check-circle",
                  message: msm
                });
              }
            })
            .catch(err => {
              this.$store.commit("login/setErrors", err);
            });
        })
        .onCancel(() => {});
    },
    //*****************UPDATE article */
    updateArticle() {
      if (
        this.statusOption == "Inativo" &&
        (this.article.obs == "" || this.article.obs == null)
      ) {
      } else {
        this.article.userId = localStorage.getItem("id");
        this.article.status = this.statusOption == "Activo" ? true : false;
        if (this.article.status == true) this.article.obs = null;

        this.$store
          .dispatch("article/updateArticles", {
            idArticle: this.articleId,
            Article: this.article
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("article/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Produto!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizado Com Sucesso!";
                    this.$store.commit("article/resetListArticles");
                    this.editButton = false;
                    this.filter = this.article.description;
                    this.listOfArticles();
                    this.onReset();
                    this.onReset();
                  }
                  break;

                default:
                  msn = "Contacte o Suporte da UCall: +244 936785605!";
                  break;
              }
              this.$q.notify({
                color: clr,
                position: "top-right",
                textColor: "white",
                icon: "fas fa-check-circle",
                message: msm
              });
            }
          })
          .catch(err => {
            this.$store.commit("login/setErrors", err);
          });
      }
    },
    // *******************EDIT article (SEND VALUES TO FORM)
    editArticle() {
      this.dis_stock = true;
      this.editButton = true;
      this.medium = true;
      this.articleId = this.selected[0].id;
      this.providerId = this.selected[0].providerId;
      this.inputId = this.selected[0].inputId;
      this.article.internal_code = this.selected[0].internal_code;
      this.article.description = this.selected[0].description;
            this.article.total = this.selected[0].stockMin;
      this.article.discount = this.selected[0].stockMax;
      this.article.serial_number =
        this.selected[0].serial_number == "-------"
          ? ""
          : this.selected[0].serial_number;
      this.article.manufactured_by =
        this.selected[0].manufactured_by == "-------"
          ? ""
          : this.selected[0].manufactured_by;
      this.article.modelo =
        this.selected[0].modelo == "-------" ? "" : this.selected[0].modelo;
      this.article.obs =
        this.selected[0].obs == "-------" ? "" : this.selected[0].obs;
      this.article.info =
        this.selected[0].info == "-------" ? "" : this.selected[0].info;

      this.providerValue =
        this.selected[0].Provider == "Nenhum" ? "" : this.selected[0].Provider;
      // PPP
      this.statusOption = this.selected[0].status;
      this.input.quantity_input = this.selected[0].quantity_input;
      this.input.purchase = this.selected[0].purchase;
      this.input.iva = this.selected[0].iva;
      this.input.discount = this.selected[0].discount;
      this.input.total = this.selected[0].total;
    },

    // ********************RESET FORM Articles
    onReset() {
      this.medium = false;
      this.dis_stock = false;
      this.articleId = null;
      this.article.description = null;
      this.article.serial_number = null;
      this.article.manufactured_by = null;
      this.article.modelo = null;
      this.article.providerId = null;
      this.article.info = null;
      this.article.obs = null;
      this.statusOption = "Activo";
      this.editButton = false;
      this.selected = [];
      this.input.quantity_input = null;
      this.input.purchase = null;
      this.input.iva = null;
      this.input.discount = null;
      this.input.total = null;
    },

    // **************************POPULATE TABLE CATEGORY
    listOfCategories() {
      this.$store
        .dispatch("category/listCategories")
        .then(res => {
          res.data.categories.forEach(data => {
            this.$store.commit("category/setListCategories", data);
            this.listCategories = this.$store.getters[
              "category/getListCategories"
            ];
          });
          this.options = [];
          this.listCategories.forEach(c => {
            this.options.push(c.name);
          });
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    },
    // **************************POPULATE TABLE inputs
    listOfInputs() {
      this.$store
        .dispatch("input/listInputs")
        .then(res => {
          res.data.inputs.forEach(data => {
            this.$store.commit("input/setListInputs", data);
            this.listInputs = this.$store.getters["input/getListInputs"];
          });
        })

        .catch(err => {
          this.$store.commit("input/setErrors", err);
        });
    },
    // ****************************POPULATE TABLE Articles
    listOfArticles() {
      this.$store
        .dispatch("article/listArticles")
        .then(res => {
          res.data.articles.forEach(data => {
            this.$store.commit("article/setListArticles", data);
            this.listArticles = this.$store.getters["article/getListArticles"];
          });
          this.data = [];

          for (let i in this.listArticles) {
            if (this.listArticles.hasOwnProperty(i)) {
              this.data.push({
                id: this.listArticles[i].id,
                internal_code: this.serializeUs(
                  this.listArticles[i].internal_code
                ),
                description: this.listArticles[i].description,
                marca: this.serializeUs(this.listArticles[i].marca),
                modelo: this.serializeUs(this.listArticles[i].modelo),
                stockMin: this.serializeUs(this.listArticles[i].total),
                stockMax: this.serializeUs(this.listArticles[i].discount),
                obs: this.serializeUs(this.listArticles[i].obs),
                info: this.serializeUs(this.listArticles[i].info),
                manufactured_by: this.serializeUs(
                  this.listArticles[i].manufactured_by
                ),
                serial_number: this.serializeUs(
                  this.listArticles[i].serial_number
                ),
                status:
                  this.listArticles[i].status == true ? "Activo" : "Inativo",

                purchase:
                  this.listArticles[i].Input == null
                    ? "0"
                    : this.serializeUs(this.listArticles[i].Input.purchase),

                iva:
                  this.listArticles[i].Input == null
                    ? "0"
                    : this.serializeUs(this.listArticles[i].Input.iva),
                discount:
                  this.listArticles[i].Input == null
                    ? "0"
                    : this.serializeUs(this.listArticles[i].Input.discount),
                total:
                  this.listArticles[i].Input == null
                    ? "0"
                    : this.serializeUs(this.listArticles[i].Input.total),
                providerId: this.listArticles[i].providerId,
                inputId:
                  this.listArticles[i].Input == null
                    ? "0"
                    : this.listArticles[i].Input.id,
                quantity_input: this.listArticles[i].quantity==null||this.listArticles[i].quantity==''?0:this.listArticles[i].quantity,
                Provider:
                  this.listArticles[i].Provider == null
                    ? "Nenhum"
                    : this.listArticles[i].Provider.name,
                ProviderCode:
                  this.listArticles[i].Provider == null
                    ? "Nenhum"
                    : this.listArticles[i].Provider.internal_code,
                user: this.serializeUs(this.listArticles[i].User.name)
              });

              // this.$store.dispatch("article/updateArticles", {idArticle: this.data[i].id,Article: {quantity: this.data[i].quantity_input}})
            }
          }
        })
        .catch(err => {
          this.$store.commit("article/setErrors", err);
        });
    },
    // **************************POPULATE TABLE Provider
    listOfProviders() {
      this.$store
        .dispatch("provider/listProviders")
        .then(res => {
          res.data.providers.forEach(data => {
            this.$store.commit("provider/setListProviders", data);
            this.listProviders = this.$store.getters[
              "provider/getListProviders"
            ];
          });

          this.optionsProvider = [];
          this.listProviders.forEach(c => {
            if (c.status == true) this.optionsProvider.push(c.name);
          });

          this.dataProvider = [];
          for (let i in this.listProviders) {
            if (this.listProviders.hasOwnProperty(i)) {
              this.dataProvider.push({
                id: this.listProviders[i].id,
                internal_code: this.serializeUs(
                  this.listProviders[i].internal_code
                ),
                name: this.serializeUs(this.listProviders[i].name),
                email: this.serializeUs(this.listProviders[i].email),
                phone1: this.serializeUs(this.listProviders[i].phone1),
                phone2: this.serializeUs(this.listProviders[i].phone2),
                status:
                  this.listProviders[i].status == true ? "Activo" : "Inativo",
                obs: this.serializeUs(this.listProviders[i].obs)
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("provider/setErrors", err);
        });
    },

    // *****************************FILTER FOR article´s SELECT
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options1 = this.options;
        });
        return;
      }
      // ****The same
      update(() => {
        const needle = val.toLowerCase();
        this.options1 = this.options.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFn4(val, update) {
      if (val === "") {
        update(() => {
          this.optionsProvider1 = this.optionsProvider;
        });
        return;
      }
      // ****The same
      update(() => {
        const needle = val.toLowerCase();
        this.optionsProvider1 = this.optionsProvider.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    } //provider
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

