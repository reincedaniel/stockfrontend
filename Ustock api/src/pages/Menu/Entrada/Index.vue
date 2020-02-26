<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="negative"
        indicator-color="negative"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Lista de Entradas" />
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
              <q-btn size="xs" color="blue-7" v-if="!Object.keys(selected).length" to="/category" icon="toll" />
              <q-btn size="md" round v-if="!Object.keys(selected).length" color="info" @click="refresh()" icon="refresh" />
              <q-btn size="md" round color="primary" v-if="!Object.keys(selected).length" @click="medium = true" icon="add_box" />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="editArticle()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteArticle()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

              <q-btn to="/input" size="md" color="positive" label="In"  icon="redo" />
              <q-btn size="md" color="primary" label="Out" icon="undo" />


            </div>
          </div>
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
                    v-model="article.serial_number"
                    label="Serial"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="article.year_made"
                    label="Ano"
                    type="number"
                    dense
                  /> 

                  <q-input
                    color="primary"
                    v-model="article.manufactured_by"
                    label="Fabricante"
                    dense

                  />                 

                  <q-input
                    color="primary"
                    v-model="article.modelo"
                    label="Modelo"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="article.color"
                    label="Cor"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="article.purchase"
                    label="Preço de Compra (Kz)"
                    type="number"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="article.discount"
                    label="Desconto (Kz)"
                    type="number"                    
                    dense
                  /> 
                  
                  <q-select
                    label="IVA"
                    :options="[0,14]"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                  />  

                  <q-input
                    color="primary"
                    v-model="article.total"
                    label="Total (Kz)"
                    type="number"                    
                    dense
                  />                                                                       

                  <q-select
                    label="Tipo"
                    v-model="typeOption"
                    :options="type"
                    use-input
                  />                  

                  <q-select
                  :rules="[val => !!val || 'Obrigatório']"
                    color="primary"
                    v-model="catergoryOption"
                    use-input
                    input-debounce="0"
                    label="Categoria"
                    :options="options1"
                    @filter="filterFn"
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
                    label="Tipo"
                    v-model="statusOption"
                    :options="['Activo','Inativo']"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                  />  

                <q-input
                  v-if="statusOption =='Inativo'"
                  autofocus=""
                    color="primary"
                    v-model="article.obs"
                    label="Observação"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />
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
              :data="dataOR"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="single"
              :selected.sync="selected"
            ></q-table>
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
      options: [],
      options1: [],
      statusOption:'Activo',
      ad: localStorage.getItem("level"),
      editButton: false,
      catergoryOption: '',
      typeOption:'A',
      listCategories: [],
      listOrderItems:[],
      listArticles: [],
      catGet: [],
      type:['A','B', 'C'],
      medium: false,
      dataOR:[],
      dis: true,
      articleId: null,
      article: {
        internal_code: null,
        description: null,
        marca: null,
        modelo: null,
        color: null,
        obs: null,
        type_value: null,
        manufactured_by: null,
        serial_number: null,
        categoryId: null,
        year_made: null,
        status: null,
        userId:null,
        iva:null,
        purchase:null,
        total:null,
        discount:null
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
        { name: "description", align: "left", label: "Artigo", field: "description",sortable: true },
        { name: "manufactured_by", align: "left", label: "Fabricante", field: "manufactured_by",sortable: true },
        { name: "modelo", align: "left", label: "Modelo", field: "modelo",sortable: true },
        //{ name: "serial_number", align: "left", label: "Serial", field: "serial_number" },
        //{ name: "color", align: "left", label: "Cor", field: "color",sortable: true },
        { name: "year_made", align: "left", label: "Ano", field: "year_made",sortable: true },
        { name: "Category",align: "left",  label: "Categoria", field: "Category",sortable: true },
        //{ name: "purchase",align: "left",  label: "Preço(KZ)", field: "purchase",sortable: true },
        //{ name: "discount",align: "left",  label: "Desconto(KZ)", field: "discount",sortable: true },
        //{ name: "iva",align: "left",  label: "IVA", field: "iva",sortable: true },
        //{ name: "total",align: "left",  label: "Total(KZ)", field: "total",sortable: true },                        
        //{ name: "type_value",align: "left",  label: "Tipo", field: "type_value",sortable: true },
        //{ name: "status", align: "left", label: "Estado", field: "status",sortable: true },
        //{ name: "obs",align: "left", label: "OBS.", field: "obs",sortable: true },
        //{ name: "user",align: "left", label: "Usuário", field: "user",sortable: true },
        { name: "quantity_item",align: "left", label: "Quantidade", field: "quantity_item",sortable: true }

        /* ,
        {
          name: "price",
          label: "Preço (Kz)",
          field: "sale_price",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        } */
      ],
      data: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {

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
      this.$store.commit("orderitem/resetListOrderItems");
      this.listOfOrderItems()
    },

    // ****************ADD RPODUCTS
    addArticle() {
      if(this.statusOption == 'Inativo' && (this.article.obs =='' ||this.article.obs ==null)) {}
      else {
      this.catGet = this.listCategories.filter(c => {
        return c.name == this.catergoryOption;
      });
        // this.articles.total = this.articles.purchase - this.articles.discount
        this.article.iva ==null ||this.article.iva ==''?this.article.iva=0:this.article.iva
        this.article.purchase ==null ||this.article.purchase ==''?this.article.purchase=0:this.article.purchase
        this.article.discount ==null ||this.article.discount ==''?this.article.discount=0:this.article.discount
        this.article.total ==null ||this.article.total ==''?this.article.total=0:this.article.total   

      this.article.type_value = this.typeOption
      this.article.userId = localStorage.getItem("id")
      this.article.categoryId = this.catGet[0].id;
      this.article.year_made =='' ? this.article.year_made = 0:this.article.year_made =this.article.year_made
      this.article.status = this.statusOption=='Activo'?true:false
      if(this.article.status==true)this.article.obs =null

      this.$store
        .dispatch("article/addArticles", this.article)
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
                    this.filter = this.article.description
                    this.listOfArticles();
                    this.onReset();
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
            .dispatch("article/deleteArticles", this.selected[0].id)
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
                      this.$store.commit("article/resetListArticles");
                      this.listOfArticles();
                      this.onReset();
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
        .onCancel(() => {

        });
    },
    //*****************UPDATE article */
    updateArticle() {
      if(this.statusOption == 'Inativo' && (this.article.obs =='' ||this.article.obs ==null)) {}
      else {
        if(this.catergoryOption)
            this.catGet = this.listCategories.filter(c => {return c.name == this.catergoryOption})

        if(this.catGet.length>0)    
            this.article.categoryId = this.catGet[0].id
        
        // this.articles.total = this.articles.purchase - this.articles.discount
        this.article.iva ==null ||this.article.iva ==''?this.article.iva="0":this.article.iva
        this.article.purchase ==null ||this.article.purchase ==''?this.article.purchase="0":this.article.purchase
        this.article.discount ==null ||this.article.discount ==''?this.article.discount="0":this.article.discount
        this.article.total ==null ||this.article.total ==''?this.article.total="0":this.article.total  
        this.article.userId = localStorage.getItem("id")
        this.article.type_value = this.typeOption
        this.article.year_made =='' ? this.article.year_made = "0":this.article.year_made =this.article.year_made
        this.article.status = this.statusOption=='Activo'?true:false
        if(this.article.status==true)this.article.obs =null

        this.$store
          .dispatch("article/updateArticles", {
            id: this.articleId,
            data: this.article
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
                    this.filter = this.article.description
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
      this.editButton = true;
      this.medium = true;
      this.articleId = this.selected[0].id;
      this.article.internal_code = this.selected[0].internal_code;
      this.article.description = this.selected[0].description;
      this.article.serial_number = this.selected[0].serial_number;
      this.article.year_made = this.selected[0].year_made;
      this.article.manufactured_by = this.selected[0].manufactured_by;
      this.article.modelo = this.selected[0].modelo;
      this.article.color = this.selected[0].color;
      this.article.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
      this.catergoryOption = this.selected[0].Category=='Nenhuma'?'':this.selected[0].Category;
      this.typeOption = this.selected[0].type_value

      this.article.purchase = this.selected[0].purchase;
      this.article.iva = this.selected[0].iva;
      this.article.discount = this.selected[0].discount;
      this.article.total = this.selected[0].total;                  
      
    },

    // ********************RESET FORM Articles
    onReset() {
      this.medium = false;

      this.article.purchase = null;
      this.article.iva = null;
      this.article.discount = null;
      this.article.total = null;       
      
      this.articleId = null
      this.article.description = null
      this.article.serial_number = null
      this.article.year_made = null
      this.article.manufactured_by = null
      this.article.modelo = null
      this.article.color = null
      this.article.obs = null
      this.catergoryOption = '';
      this.typeOption = 'A'
      this.statusOption = 'Activo'
      this.editButton = false
      this.selected =[]
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

        this.dataOR = [];
          for (let i in this.listOrderItems) {
            if (this.listOrderItems.hasOwnProperty(i)) {
              this.dataOR.push({
                id: this.listOrderItems[i].id,
                internal_code: this.serializeUs(this.listOrderItems[i].Article.internal_code),
                description: this.listOrderItems[i].Article.description,
                marca: this.serializeUs(this.listOrderItems[i].Article.marca),
                modelo: this.serializeUs(this.listOrderItems[i].Article.modelo),
                color: this.serializeUs(this.listOrderItems[i].Article.color),
                obs: this.serializeUs(this.listOrderItems[i].Article.obs),
                type_value: this.serializeUs(this.listOrderItems[i].Article.type_value),
                manufactured_by: this.serializeUs(this.listOrderItems[i].Article.manufactured_by),
                serial_number: this.serializeUs(this.listOrderItems[i].Article.serial_number),
                categoryId: this.listOrderItems[i].Article.categoryId,
                Category:this.listOrderItems[i].Category==null?'Nenhuma':this.listOrderItems[i].Category.name,
                year_made: this.serializeUs(this.listOrderItems[i].Article.year_made),
                status: this.listOrderItems[i].Article.status==true?'Activo':'Inativo',
                purchase : this.serializeUs(this.listOrderItems[i].Article.purchase),
                iva : this.serializeUs(this.listOrderItems[i].Article.iva),
                discount : this.serializeUs(this.listOrderItems[i].Article.discount),
                quantity_item : this.serializeUs(this.listOrderItems[i].quantity_item),                
                total : this.serializeUs(this.listOrderItems[i].Article.total) 
              });
            }
          }

          console.log('-----dssd----')
          console.log(this.dataOR)

        })
        .catch(err => {
          this.$store.commit("provider/setErrors", err);
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
    background-color: #31CCEC

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

