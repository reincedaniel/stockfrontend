<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="secondary"
        indicator-color="secondary"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Transferência" />
        <q-tab icon="fast_food" disable name="estoque" label />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
          <q-dialog v-model="mediumArtigo" persistent>
            <q-card style="width: 800px; max-width: 100vw;">
              <q-card-section>
                <div class="text-h6">Transferência de Stock</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-select
                    v-if="paraOQ==true"
                    color="primary"
                    v-model="clientValue"
                    use-input
                    input-debounce="0"
                    label="Cliente"
                    :options="optionsClient1"
                    @filter="filterFny1"
                    style="width: 250px"
                    autofocus
                    behavior="menu"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">Não Encontrado!</q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                  v-if="paraOQ==true"
                    color="primary"
                    v-model="operationValue"
                    use-input
                    input-debounce="0"
                    label="Operação"
                    :options="optionsOperation1"
                    @filter="filterFny2"
                    style="width: 250px"
                    behavior="menu"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">Não Encontrado!</q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                  <q-select
                    v-if="paraOQ==false"
                    color="primary"
                    v-model="materialValue"
                    use-input
                    autofocus
                    input-debounce="0"
                    label="Equipamento"
                    :options="optionsMaterial1"
                    @filter="filterFny3"
                    style="width: 250px"
                    behavior="menu"
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
                <q-btn
                  @click="rita()"
                  color="secondary"
                  icon="refresh"
                /> 
                <q-btn color="warning" label="Cancelar" v-close-popup />
                <q-btn
                  @click="addArticle()"
                  color="primary"
                  icon="arrow_upward"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <q-banner dense inline-actions class="text-white text-center bg-secondary">
              <label class="text-bold text-h4">{{articleToBuy.length}} Artigo(s)</label>

              <template v-slot:action>
                <q-btn
                  class="text-primary bg-white"
                  v-if="articleToBuy.length>0"
                  @click="mediumArtigo = true"
                  label="Confirmar"
                  icon="arrow_right"
                />
              </template>
            </q-banner>
            <div class="row q-gutter-sm q-pt-md">
              <q-input
                color="primary"
                autofocus
                dense
                debounce="300"
                @keyup="serchArticle()"
                v-model="filter"
                placeholder="Pesquisar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn size="xs" color="grey-7" @click="filter=''" icon="format_clear" />
              <q-btn size="md" round color="info" @click="actualizarProd()" icon="refresh" />
              <q-btn size="md" color="info" label="Artigos" to='/proser' icon="widgets" />
<!--               <q-btn size="md" color="positive" label="Entradas" to='/entrada' icon="arrow_upward" /> -->
            </div>
          </div>
          <div class="row">
            <q-scroll-area class="col" style="height: 410px;">
              <q-list padding class="no-border-radius q-mr-md" style="max-width: 100%">
                <!--                         <q-item-label header>Produtos & Serviços</q-item-label> -->
                <q-item clickable v-ripple v-for="(myArticle,index) in data1" :key="index">
                  <q-item-section avatar top>
                    <q-avatar icon="eco" color="primary" text-color="white" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{myArticle.description}}</q-item-label>
                    <q-item-label caption>Code: {{myArticle.internal_code}}  |  Fab.: {{myArticle.manufactured_by}}  |  Modelo: {{myArticle.modelo}}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <label class="text-bold text-blue">Stock: {{myArticle.quantity}} Artigo(s)</label>
                  </q-item-section>                       

                  <q-item-section side>
                    <q-btn
                      size="sm"
                      v-if="(myArticle.quantity==0)==false"
                      @click="addIn(index,myArticle)"
                      icon="arrow_upward"
                      color="blue-9"
                    />

                    <q-btn
                    v-if="(myArticle.quantity==0)==true"
                    disable
                      size="sm"
                      @click="addIn(index,myArticle)"
                      icon="arrow_upward"
                      color="negative"
                    />
                  
                  </q-item-section>
                </q-item>

                <q-separator spaced />
                <q-item-label header>. . .</q-item-label>
              </q-list>
            </q-scroll-area>

            <q-scroll-area class="col" style="height: 410px;">
              <q-list padding class="no-border-radius" style="max-width: 100%">
                <!--                         <q-item-label header>Produtos & Serviços</q-item-label> rounded-borders bordered-->

                <q-item clickable v-ripple v-for="(myArticle,index) in articleToBuy" :key="index">
                  <q-item-section avatar top>
                    <q-avatar icon="loyalty" color="primary" text-color="white" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{myArticle.description}}</q-item-label>
                    <q-item-label caption>Fab.: {{myArticle.manufactured_by}} | MOdelo: {{myArticle.modelo}}</q-item-label>
                  </q-item-section>
<!-- 
                  <q-item-section side>
                    <label class="text-bold text-blue">{{myArticle.total}} Kz</label>
                  </q-item-section> -->

<!--                   <q-item-section side>
                    <label class="text-bold text-blue">{{myArticle.quantity}} Artigo(s) - {{myArticle.qtd}} Artigo(s)</label>
                    <q-popup-edit v-model.number="myArticle.qtd" buttons persistent>
                      <q-input type="number" v-model.number="myArticle.qtd" dense autofocus />
                    </q-popup-edit>
                    
                  </q-item-section> -->

                  <q-item-section side>
                     <label class="text-bold text-blue">{{myArticle.quantity}} Artigo(s) - {{myArticle.qtd}} Artigo(s)</label>
                      <q-popup-edit v-model="myArticle.qtd" :validate="val => val<(myArticle.quantity+1)">
                      <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                        <q-input
                          autofocus
                          dense
                          :value="myArticle.qtd"
                          hint="Quatidade de Artigos a Tranferir"
                          :rules="[
                            val => validate(value) || 'Este Valor é Superior ao Stock'
                          ]"
                          @input="emitValue"
                        >
                          <template v-slot:after>
                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="set" :disable="validate(value) === false || initialValue === value" />
                          </template>
                        </q-input>
                      </template>
                    </q-popup-edit>

                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                     
                      round
                      size="xs"
                      @click="plusAdd(index, myArticle)"
                      icon="add"
                      color="blue-7"
                    />
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      round
                      size="xs"
                      @click="plusRem(index, myArticle)"
                      icon="remove"
                      color="red-7"
                    />
                  </q-item-section>

                  <q-item-section side></q-item-section>

                  <q-item-section side>
                    <q-btn
                      size="sm"
                      @click="addOut(index,myArticle)"
                      icon="indeterminate_check_box"
                      color="red"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>

          <div class="row">
            <div class="col q-pr-xs q-pl-md">
              <q-banner inline-actions class="text-white bg-primary">
                Refresh Total. Obs.:
                <strong>Vai Limpar a coluna ao lado!</strong> ->
                <template v-slot:action>
                  <q-btn flat @click="refresh()" color="white" icon="refresh" label="Refresh" />
                </template>
              </q-banner>
            </div>
            <div class="col q-pr-md">
              <q-banner inline-actions class="text-white bg-blue-9 text-center">
                <label class="text-bold text-h5">
                  Stock
                  <q-icon name="shopping_cart"></q-icon>
                </label>
              </q-banner>
            </div>
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
export default {
  data() {
    return {
      tab: "itens",
      model: null,
      mediumArtigo: false,
      myPrice: 0,
      paraOQ:true,
      options: [],
      operationValue: "",
      materialValue: "",
      locationValue: "",
      clientValue: "",
      options1: [],
      ad: localStorage.getItem("level"),
      uId: localStorage.getItem("id"),      
      editButton: false,
      catergoryOption: "",
      optionsClient: [],
      optionsClient1: [],
      optionsMaterial: [],
      optionsMaterial1: [],
      optionsLocation1: [],
      optionsLocation: [],
      optionsOperation1: [],
      optionsOperation: [],
      listCategories: [],
      listArticles: [],
      locationGet:[],
      materialGet: [],
      clientGet:[],
      operationGet:[],
      listOperations: [],
      listClients: [],
      dataOperation: [],
      listLocations: [],
      dataLocation: [],
      listMaterials:[],
      listOrderItems:[],
      catGet: [],
      medium: false,
      dis: true,
      articleId: null,
      OrderItems: [],
      article: {
        name: null,
        key: null,
        sale_price: null,
        purchase: null,
        expiration_date: "",
        unity: null,
        quantity: null
      },
      input: {
        internal_code: null,
        internal_code_order: null,
        materialId: null, //agora
        locationId: null, //agora
        input_date: null,
        purchase: null, //agora
        iva: null, //agora
        discount: null, //agora
        orderId: null,
        total: 0, //agora
        quantity_input: null, //agora
        clientId: null, //agora
        status: null,
        userId: null
      },
      order: {
        internal_code: null,
        clientId: null,
        userId: null,
        status: null
      },
      orderItem: {
        articleId: null,
        userId: null,
        quantity_item: null
      },
      filter: "",
      selected: [],
      data: [],
      data1: [],
      articleToBuy: []
    };
  },
/*   created() {
    this.refresh();
  }, */
  mounted(){
    this.refresh();
  },
  methods: {
    //Exception
    rita(){
        this.paraOQ = !this.paraOQ
        this.operationValue = ''
        this.materialValue = ''
        this.clientValue = ''


    },
    //SerializeUs
    serializeUs(value) {
      if (value == "" || value == null) return "-------";
      else return value;
    },
    serializeUsNumber(value) {
      if(value=='' || value ==null)return '0'
      else return value
    },
    // ********************* Refresh alll store
    actualizarProd() {
      this.filter = "";
      this.data1 = this.data;
    },
    refresh() {
      this.mediumArtigo = false
      this.$store.commit("material/resetListMaterials"); 
      this.$store.commit("material/resetListMaterials"); 
      this.$store.commit("client/resetListClients");      
      this.$store.commit("location/resetListLocations");
      this.$store.commit("operation/resetListOperations");
      this.$store.commit("article/resetListArticles");
      this.$store.commit("category/resetListCategories");
      this.$store.commit("orderitem/resetListOrderItems");      
      this.$store.commit("material/resetListMaterials");   
      this.listOfOrderItems()
      this.listOfArticles();
      this.listOfLocations();
      this.listOfClients()
      this.listOfOperations();
      this.listOfCategories();
      this.listOfMaterials()
      
      this.articleToBuy = [];
      this.myPrice = 0;
      this.locationValue=''
      this.materialValue= ''
      this.input.input_date = ''
      this.input.total = 0
    },
    addIn(id, articleX) {
      this.myPrice = parseFloat(this.myPrice) + parseFloat(articleX.sale_price);
      this.input.total = parseFloat(this.input.total) + parseFloat(articleX.total);
      //this.data1.splice(id,1)
      this.data.splice(id, 1);
      this.articleToBuy.unshift(articleX);
      this.actualizarProd();
    },
    addOut(id, articleX) {
      this.myPrice = parseFloat(this.myPrice) - parseFloat(articleX.sale_price);
      this.input.total = parseFloat(this.input.total) - parseFloat(articleX.total);
      this.articleToBuy.splice(id, 1);
      this.data.unshift(articleX);
      this.actualizarProd();
    },
    plusAdd(id, articleX) {
      if(articleX.qtd>=articleX.quantity){
        articleX.qtd = articleX.quantity
      }else {
      articleX.qtd = parseFloat(articleX.qtd) + 1;
      this.myPrice = parseFloat(this.myPrice) + parseFloat(articleX.sale_price);}
    },
    plusRem(id, articleX) {
      if (parseFloat(articleX.qtd) > 1) {
        articleX.qtd = parseFloat(articleX.qtd) - 1;
        this.myPrice =
          parseFloat(this.myPrice) - parseFloat(articleX.sale_price);
      }
    },
    serchArticle() {
      if (this.filter === "") {
        this.data1 = this.data;
      } else
        this.data1 = this.data.filter(
          v =>
            v.description.toLowerCase().includes(this.filter.toLowerCase()) ||
            v.internal_code.toLowerCase().includes(this.filter.toLowerCase()) ||
            v.Category.toLowerCase().includes(this.filter.toLowerCase())
        );
    },
    showPrice() {
      this.myPrice = 0;
      for (let i in this.selected) {
        if (this.selected.hasOwnProperty(i)) {
          this.myPrice =
            parseFloat(this.myPrice) + parseFloat(this.selected[i].sale_price);
        }
      }
      return this.myPrice;
      /* this.$q.dialog({
         color: 'info',
        title: 'Preço',
        message: 'Total do Preço: '+this.myPrice
      }).onOk(() => {}) */
    },
    // **************************Add INPUT
    verInput(id){

      var xc=true
      for (let i in this.listOrderItems) {
        if (this.listOrderItems.hasOwnProperty(i)) {
          if(this.listOrderItems[i].articleId==id){
            xc=false 
          }
         
        }
      }
      return xc

    }
    ,
    addArticle() {

      this.OrderItems=[]

      this.clientGet= this.listClients.filter(c => {
        return c.name == this.clientValue;
      })

         this.operationGet=this.listOperations.filter(c => {
        return c.name == this.operationValue;
      })

      this.materialGet=this.listMaterials.filter(c => {
        return c.description == this.materialValue;
      })

      for (let i in this.articleToBuy) {
        if (this.articleToBuy.hasOwnProperty(i)) {
            this.OrderItems.push({
              articleId :this.articleToBuy[i].id,
              quantity_item:this.articleToBuy[i].qtd,
              userId: this.uId
            })

        var prc = parseInt(this.articleToBuy[i].quantity) - parseInt(this.articleToBuy[i].qtd)
        this.$store.dispatch("article/updateArticles", {idArticle: this.articleToBuy[i].id,Article: {quantity: prc}})
        }


      }


      var Order =  {
        userId :this.uId,
        materialId: this.materialGet.length==0?0:this.materialGet[0].id,
        quantity_input: this.OrderItems.length,
        operationId: this.operationGet.length==0?0:this.operationGet[0].id,
        clientId: this.clientGet.length==0?0:this.clientGet[0].id,
        OrderItems: this.OrderItems
      };


      this.$store
        .dispatch("order/addOrders", Order)
        .then(res => {
          let msm = "",
            clr = "red-4";
          if (res.data.code < 0) {
            this.$store.commit("order/setErrors", res.data);
          } else {
            switch (res.data.code) {
              case 0: {
                msm = "Não foi possivel Registrar a Transferência!";
               }
                break;

              case 1:
                {
                    clr = "green-4";
                    msm = "Transferência Registrada Com Sucesso!";
                    this.$store.commit("order/resetListOrders");
                    this.refresh()

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
          this.$store.commit("order/setErrors", err);
        });

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

          this.listCategories.forEach(c => {
            this.options.push(c.name);
          });
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    },
    // **************************POPULATE TABLE operation
    listOfOperations() {
      this.$store
        .dispatch("operation/listOperations")
        .then(res => {
          res.data.operations.forEach(data => {
            this.$store.commit("operation/setListOperations", data);
            this.listOperations = this.$store.getters[
              "operation/getListOperations"
            ];
          });

          this.optionsOperation = [];
          this.listOperations.forEach(c => {
            if (c.status == true) this.optionsOperation.push(c.name);
          });

          this.dataOperation = [];
          for (let i in this.listOperations) {
            if (this.listOperations.hasOwnProperty(i)) {
              this.dataOperation.push({
                id: this.listOperations[i].id,
                internal_code: this.serializeUs(
                  this.listOperations[i].internal_code
                ),
                name: this.serializeUs(this.listOperations[i].name),
                status:
                  this.listOperations[i].status == true ? "Activo" : "Inativo",
                obs: this.serializeUs(this.listOperations[i].obs)
              });
            }
          }
         
        })
        .catch(err => {
          this.$store.commit("operation/setErrors", err);
        });
    },
        // **************************POPULATE TABLE Materials
    listOfMaterials() {
      this.$store
        .dispatch("material/listMaterials")
        .then(res => {
          res.data.materials.forEach(data => {
            this.$store.commit("material/setListMaterials", data);
            this.listMaterials = this.$store.getters[
              "material/getListMaterials"
            ];
          });

          this.optionsMaterial = [];
          this.listMaterials.forEach(c => {
            if (c.status == true) this.optionsMaterial.push(c.description);
          });
        })
        .catch(err => {
          this.$store.commit("operation/setErrors", err);
        });
    },

    // ****************************POPULATE TABLE PRODUCTS
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
              if(this.listArticles[i].status==true){
                  this.data.push({
                  id: this.listArticles[i].id,
                  internal_code: this.serializeUs(
                    this.listArticles[i].internal_code
                  ),
                  description: this.listArticles[i].description,
                  marca: this.serializeUs(this.listArticles[i].marca),
                  modelo: this.serializeUs(this.listArticles[i].modelo),
                  color: this.serializeUs(this.listArticles[i].color),
                  quantity: this.listArticles[i].quantity==null||this.listArticles[i].quantity==''?0:this.listArticles[i].quantity,
                  obs: this.serializeUs(this.listArticles[i].obs),
                  type_value: this.serializeUs(this.listArticles[i].type_value),
                  purchase : this.serializeUsNumber(this.listArticles[i].purchase),
                  iva : this.serializeUsNumber(this.listArticles[i].iva),
                  discount : this.serializeUsNumber(this.listArticles[i].discount),
                  total : this.serializeUsNumber(this.listArticles[i].total) ,
                  manufactured_by: this.serializeUs(
                    this.listArticles[i].manufactured_by
                  ),
                  serial_number: this.serializeUs(
                    this.listArticles[i].serial_number
                  ),
                  year_made: this.serializeUs(this.listArticles[i].year_made),
                  status:
                    this.listArticles[i].status == true ? "Activo" : "Inativo",
                  user: this.serializeUs(this.listArticles[i].User.name),
                  qtd: 1,
                  cart: false
                }); 
              }

            }
          }
          this.data1 = this.data;
        })
        .catch(err => {
          this.$store.commit("article/setErrors", err);
        });
    },

    // **************************POPULATE TABLE location
    listOfLocations() {
      this.$store
        .dispatch("location/listLocations")
        .then(res => {
          res.data.locations.forEach(data => {
            this.$store.commit("location/setListLocations", data);
            this.listLocations = this.$store.getters[
              "location/getListLocations"
            ];
          });

          this.optionsLocation = [];
          this.listLocations.forEach(c => {
            if (c.status == true) this.optionsLocation.push(c.description);
          });

          this.dataLocation = [];
          for (let i in this.listLocations) {
            if (this.listLocations.hasOwnProperty(i)) {
              this.dataLocation.push({
                id: this.listLocations[i].id,
                description: this.serializeUs(
                  this.listLocations[i].description
                ),
                corredor: this.serializeUs(this.listLocations[i].corredor),
                pratileira: this.serializeUs(this.listLocations[i].pratileira),
                status:
                  this.listLocations[i].status == true ? "Activo" : "Inativo",
                obs: this.serializeUs(this.listLocations[i].obs)
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("location/setErrors", err);
        });
    },
    // **************************POPULATE TABLE Client
    listOfClients() {
      this.$store
        .dispatch("client/listClients")
        .then(res => {
          res.data.clients.forEach(data => {
            this.$store.commit("client/setListClients", data);
            this.listClients = this.$store.getters[
              "client/getListClients"
            ];
          });

          this.optionsClient = [];
          this.listClients.forEach(c => {
            if (c.status == true) this.optionsClient.push(c.name);
          });
           
          this.dataClient = [];
          for (let i in this.listClients) {
            if (this.listClients.hasOwnProperty(i)) {
              this.dataClient.push({
                id: this.listClients[i].id,
                internal_code: this.serializeUs(this.listClients[i].internal_code),
                name: this.serializeUs(this.listClients[i].name),
                status: this.listClients[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listClients[i].obs)
                
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("client/setErrors", err);
        });
    },
    // **************************POPULATE TABLE Material
    listOfMaterials() {
      this.$store
        .dispatch("material/listMaterials")
        .then(res => {
          res.data.materials.forEach(data => {
            this.$store.commit("material/setListMaterials", data);
            this.listMaterials = this.$store.getters[
              "material/getListMaterials"
            ];
          });

          this.optionsMaterial = [];
          this.listMaterials.forEach(c => {
            if (c.status == true) this.optionsMaterial.push(c.description);
          });
          
          this.dataMaterial = [];
          for (let i in this.listMaterials) {
            if (this.listMaterials.hasOwnProperty(i)) {
              this.dataMaterial.push({
                id: this.listMaterials[i].id,
                internal_code: this.serializeUs(this.listMaterials[i].internal_code),
                name: this.serializeUs(this.listMaterials[i].name),
                 email: this.serializeUs(this.listMaterials[i].email),
                  phone1: this.serializeUs(this.listMaterials[i].phone1),
                   phone2: this.serializeUs(this.listMaterials[i].phone2),
                status: this.listMaterials[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listMaterials[i].obs)
                
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("material/setErrors", err);
        });
    },
        // **************************POPULATE TABLE OrderItems
    listOfOrderItems() {
      this.$store
        .dispatch("orderitem/listOrderItems")
        .then(res => {
          this.$store.commit("orderitem/resetListOrderItems"); 
          res.data.orderitems.forEach(data => {
            this.$store.commit("orderitem/setListOrderItems", data);
            this.listOrderItems = this.$store.getters[
              "orderitem/getListOrderItems"
            ];
          });

        })
        .catch(err => {
          this.$store.commit("material/setErrors", err);
        });
    }
    ,
    // *****************************FILTER FOR article´s SELECT
    filterFny3(val, update) {
      if (val === "") {
        update(() => {
          this.optionsMaterial1 = this.optionsMaterial;
        });
        return;
      }
      // ****The same
      update(() => {
        const needle = val.toLowerCase();
        this.optionsMaterial1 = this.optionsMaterial.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    }, //operações
    filterFny2(val, update) {
      if (val === "") {
        update(() => {
          this.optionsOperation1 = this.optionsOperation;
        });
        return;
      }
      // ****The same
      update(() => {
        const needle = val.toLowerCase();
        this.optionsOperation1 = this.optionsOperation.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    }, //operações
    filterFny1(val, update) {
      if (val === "") {
        update(() => {
          this.optionsClient1 = this.optionsClient;
        });
        return;
      }
      // ****The same
      update(() => {
        const needle = val.toLowerCase();
        this.optionsClient1 = this.optionsClient.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    } //Clientes

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

