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
        class="text-grey">
            <q-tab icon="item" name="itens" label="Vender"/>
            <q-tab icon="fast_food" disable  name="estoque" label=""/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="itens">
                    <div class="q-pa-md">
                          <q-banner dense inline-actions class="text-white text-center bg-primary">
                            <label class="text-bold text-h4">{{productToBuy.length}} Iten(s) = {{myPrice}} Kz</label>
                            <template v-slot:action>
                              <q-btn class="text-primary bg-white" label="Pagar" icon="arrow_right"/>
                            </template>
                          </q-banner>
                      <div class="row q-gutter-sm q-pt-md">
                        <q-input color="primary" autofocus  dense debounce="300" @keyup="serchProduct()" v-model="filter" placeholder="Buscar">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                        <q-btn size="xs" color="grey-7" @click="filter=''" icon="format_clear" />
                        <!-- <q-btn size="xs" color="blue-7" to='/category' icon="toll" /> -->
                        
                        <q-btn v-if="Object.keys(selected).length && ad=='true'"  @click="editProduct()" size="md" round color="warning" icon="create" />
                        <q-btn v-if="Object.keys(selected).length && ad=='true'" @click="deleteProduct()" size="md" round color="negative" icon="delete_forever" />
                        <q-btn size="md" round color="info"  @click="actualizarProd()" icon="refresh" />
                        <q-btn v-if="Object.keys(selected).length" size="md" color="primary"  @click="medium = true" icon="attach_money" label="continuar" />
                      </div>  
                      
                    </div>
                  <div class="row">

                    <q-scroll-area class="col" style="height: 410px;">
                      <q-list padding class="no-border-radius q-mr-md" style="max-width: 100%">
<!--                         <q-item-label header>Produtos & Serviços</q-item-label> -->
                        <q-item clickable v-ripple v-for="(myProduct,index) in data1" :key="index">
                          <q-item-section avatar top>
                            <q-avatar icon="eco" color="primary" text-color="white" />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label >{{myProduct.name}}</q-item-label>
                            <q-item-label caption>Categoria: {{myProduct.Category}}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <label class="text-bold text-blue"> {{myProduct.sale_price}} kz</label>
                          </q-item-section>

                          <q-item-section side>
                            <q-btn size="sm" @click="addIn(index,myProduct)" icon="check_box" color="green" />
                          </q-item-section>                          

                        </q-item>

                        <q-separator spaced />
                        <q-item-label header>. . .</q-item-label>

                      </q-list>
                    </q-scroll-area>

                    <q-scroll-area class="col" style="height: 410px;">
                      <q-list padding class="no-border-radius" style="max-width: 100%">
<!--                         <q-item-label header>Produtos & Serviços</q-item-label> rounded-borders bordered-->

                        <q-item clickable v-ripple v-for="(myProduct,index) in productToBuy" :key="index">
                          <q-item-section avatar top>
                            <q-avatar icon="eco" color="primary" text-color="white" />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label >{{myProduct.name}}</q-item-label>
                            <q-item-label caption>Categoria: {{myProduct.Category}}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <label class="text-bold text-blue">{{myProduct.sale_price}}</label>
                          </q-item-section>

                          <q-item-section side>
                            <label class="text-bold text-blue">({{myProduct.qtd}}X)</label>
                          </q-item-section>

                          <q-item-section side>
                            <q-btn round size="xs" @click="plusAdd(index, myProduct)" icon="add" color="blue-7" />
                          </q-item-section>

                          <q-item-section side>
                            <q-btn round size="xs" @click="plusRem(index, myProduct)" icon="remove" color="red-7" />
                          </q-item-section>

                          <q-item-section side>
                            <q-btn size="sm" @click="addOut(index,myProduct)" icon="indeterminate_check_box" color="red" />
                          </q-item-section>                          

                        </q-item>



                      </q-list>
                    </q-scroll-area>

                    </div>

                    <div class="row">
                        <div class="col q-pr-xs q-pl-md">
                          <q-banner inline-actions class="text-white bg-primary">
                            Refresh Total. Obs.: <strong>Vai Limpar o Carrinho!</strong>  ->
                            <template v-slot:action>
                              <q-btn flat @click="refresh()" color="white" icon="refresh" label="Refresh" />
                            </template>
                          </q-banner>
                        </div>
                        <div class="col q-pr-md">
                          <q-banner inline-actions class="text-white bg-blue-9 text-center">
                            <label class="text-bold text-h5">Carrinho <q-icon name="shopping_cart"></q-icon></label>
 
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
  data () {
    return {
        tab:'itens',
        model: null,
        myPrice:0,
        options: [],
        options1:[],
        ad: localStorage.getItem('isAdmin'),
        editButton: false,
        catergoryOption:'',
        listCategories:[],
        listProducts: [],
        catGet:[],
        medium: false,
        dis: true,
        productId:null,
        product: {
          name: null,
          key: null,
          categoryId: null,
          sale_price: null,
          purchase: null,
          expiration_date: '',
          unity: null,
          quantity: null
        },
      filter: '',
      selected: [],
      data: [],
      data1:[],
      productToBuy:[]
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    // ********************* Refresh alll store
    actualizarProd() {
      this.filter = ''
      this.data1 = this.data
    },
    refresh() {
      this.$store.commit('product/resetListProducts')
      this.$store.commit('category/resetListCategories')
      this.listOfProducts()
      this.listOfCategories()
      this.productToBuy =[]
      this.myPrice = 0
    },
    addIn(id,productX){
      this.myPrice = parseFloat(this.myPrice) + parseFloat(productX.sale_price) 
      //this.data1.splice(id,1)
            this.data.splice(id,1)
      this.productToBuy.unshift(productX)
      this.actualizarProd()

    },
    
    addOut(id,productX){
      this.myPrice = parseFloat(this.myPrice) - parseFloat(productX.sale_price) 
      this.productToBuy.splice(id,1)
      this.data.unshift(productX)
      this.actualizarProd()
    },
    plusAdd(id, productX) {
      productX.qtd = parseFloat(productX.qtd) + 1
      this.myPrice = parseFloat(this.myPrice) + parseFloat(productX.sale_price) 
    },
    plusRem(id, productX) {
      if(parseFloat(productX.qtd)>1) {
      productX.qtd = parseFloat(productX.qtd) - 1
      this.myPrice = parseFloat(this.myPrice) - parseFloat(productX.sale_price) 
      }
    },
    serchProduct(){
      if (this.filter === '') {
        this.data1 = this.data
        }
      else
          this.data1 = this.data.filter(v => v.name.toLowerCase().includes(this.filter.toLowerCase()))
      },

    showPrice(){
      this.myPrice = 0
      for(let i in this.selected){

        if(this.selected.hasOwnProperty(i)){

          this.myPrice = parseFloat(this.myPrice)  + parseFloat(this.selected[i].sale_price)
          
        }
      }
        return this.myPrice
      /* this.$q.dialog({
         color: 'info',
        title: 'Preço',
        message: 'Total do Preço: '+this.myPrice
      }).onOk(() => {}) */
      
      
    },

    // **************************POPULATE TABLE CATEGORY
    listOfCategories() {
      this.$store.dispatch('category/listCategories')
      .then(res=>{
        res.data.categories.forEach(data => {
            this.$store.commit('category/setListCategories', data)
            this.listCategories = this.$store.getters['category/getListCategories']
        }) 

        this.listCategories.forEach(c =>{
          this.options.push(c.name)
        })

      })
      .catch(err=>{
          this.$store.commit('category/setErrors', err)
      })
    },

    // ****************************POPULATE TABLE PRODUCTS
    listOfProducts() {
      
        this.$store.dispatch('product/listProducts')
        .then(res=>{
              res.data.products.forEach(data => {
                  this.$store.commit('product/setListProducts', data)
                  this.listProducts = this.$store.getters['product/getListProducts']
              });  
              this.data = []
              for(let i in this.listProducts){

                if(this.listProducts.hasOwnProperty(i)){

                    this.data.push({
                      id: this.listProducts[i].id,
                      name:this.listProducts[i].name,
                      key: this.listProducts[i].key,
                      sale_price: this.listProducts[i].sale_price,
                      categoryId: this.listProducts[i].categoryId,
                      Category: this.listProducts[i].Category.name,
                      unity:this.listProducts[i].unity,
                      quantity:this.listProducts[i].quantity,
                      expiration_date:this.listProducts[i].expiration_date,
                      purchase: this.listProducts[i].purchase,
                      qtd: 1,
                      cart: false

                      })
                  
                }
              }
              this.data1 = this.data
             
            }).catch(err=>{
                this.$store.commit('product/setErrors', err)
            })
            
    }
  }
}
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

