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
        <q-tab icon="item" name="itens" label="Equipamentos" />
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
<!--               <q-btn size="xs" color="blue-7" v-if="!Object.keys(selected).length" to="/category" icon="toll" /> -->
              <q-btn size="md" round v-if="!Object.keys(selected).length" color="info" @click="refresh()" icon="refresh" />
              <q-btn size="md" round color="primary" v-if="!Object.keys(selected).length" @click="medium = true" icon="add_box" />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="editMaterial()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteMaterial()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

<!--               <q-btn to="/input" size="md" color="positive" label="In"  icon="redo" />
              <q-btn size="md" color="primary" label="Out" icon="undo" /> -->


            </div>
          </div>
          <q-dialog v-model="medium" persistent>
            <q-card style="width: 800px; max-width: 100vw;">
              <q-card-section>
                <div class="text-h6">Equipamento</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    autofocus
                    color="primary"
                    v-model="material.description"
                    label="Descrição"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="material.serial_number"
                    label="Serial"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="material.manufactured_by"
                    label="Fabricante"
                    :rules="[val => !!val || 'Obrigatório']"
                    dense

                  />                 

                  <q-input
                    color="primary"
                    v-model="material.modelo"
                    label="Modelo"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

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
                    v-model="material.obs"
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
                  @click="addMaterial()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButton ==true"
                  @click="updateMaterial()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE Materials -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="data"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="single"
              :selected.sync="selected"
              :fullscreen="isFullscreen"
            >
                <template v-slot:top>
                  <q-btn class="q-mr-md" color="primary" icon="fullscreen"  @click="isFullscreen=!isFullscreen" />
           <!--        <q-btn label="Exportar - Excel" color="primary" @click="onexport" icon="print" /> -->
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
export default {
  data() {
    return {
      tab: "itens",
      model: null,
      isFullscreen:false,
      options: [],
      options1: [],
      statusOption:'Activo',
      ad: localStorage.getItem("level"),
      editButton: false,
      catergoryOption: '',
      typeOption:'A',
      listCategories: [],
      listMaterials: [],
      catGet: [],
      type:['A','B', 'C'],
      medium: false,
      dis: true,
      materialId: null,
      materialXXXX: {
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
      material: {
        internal_code: null,
        description: null,
        modelo: null,
        obs: null,
        manufactured_by: null,
        serial_number: null,
        status: null,
        userId:null,
      },
      filter: "",
      selected: [],
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Código (Equipamento)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "description", align: "left", label: "Equipamento", field: "description",sortable: true },
        { name: "manufactured_by", align: "left", label: "Fabricante", field: "manufactured_by",sortable: true },
        { name: "modelo", align: "left", label: "Modelo", field: "modelo",sortable: true },
        { name: "serial_number", align: "left", label: "Serial", field: "serial_number" },
/*         { name: "color", align: "left", label: "Cor", field: "color",sortable: true },
        { name: "year_made", align: "left", label: "Ano", field: "year_made",sortable: true},
        { name: "Category",align: "left",  label: "Categoria", field: "Category",sortable: true },
        { name: "purchase",align: "left",  label: "Preço(KZ)", field: "purchase",sortable: true },
        { name: "discount",align: "left",  label: "Desconto(KZ)", field: "discount",sortable: true },
        { name: "iva",align: "left",  label: "IVA", field: "iva",sortable: true },
        { name: "total",align: "left",  label: "Total(KZ)", field: "total",sortable: true },  */                       
/*         { name: "type_value",align: "left",  label: "Tipo", field: "type_value",sortable: true }, */
        { name: "status", align: "left", label: "Estado", field: "status",sortable: true },
        { name: "obs",align: "left", label: "OBS.", field: "obs",sortable: true },
        { name: "user",align: "left", label: "Usuário", field: "user",sortable: true }

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
      this.$store.commit("material/resetListMaterials");
        this.$store.commit("material/resetListMaterials");
      this.listOfMaterials();
    },

    // ****************ADD RPODUCTS
    addMaterial() {
      if((this.material.description=='' || this.material.description==null)  || (this.material.manufactured_by==''||this.material.manufactured_by==null)) {

      } else {
        if(this.statusOption == 'Inativo' && (this.material.obs =='' ||this.material.obs ==null)) {}
        else {
          this.material.userId = localStorage.getItem("id")
          this.material.status = this.statusOption=='Activo'?true:false
          if(this.material.status==true)this.material.obs =null

          this.$store
            .dispatch("material/addMaterials", this.material)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("material/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel adicionar Produto!";
                    break;

                  case 1:
                    {
                        clr = "green-4";
                        msm = "Equipamento Com Sucesso!";
                        this.editButton = false;
                        this.filter = this.material.description
                        this.onReset();
                        this.refresh();
                        
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

      }

    
    
    },
    //****************DELETE Materials */
    deleteMaterial() {
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
            .dispatch("material/deleteMaterials", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("material/setErrors", res.data);
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
                      this.refresh();
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
    //*****************UPDATE material */
    updateMaterial() {
      if(this.statusOption == 'Inativo' && (this.material.obs =='' ||this.material.obs ==null)) {}
      else {
/*         if(this.catergoryOption)
            this.catGet = this.listCategories.filter(c => {return c.name == this.catergoryOption})

        if(this.catGet.length>0)    
            this.material.categoryId = this.catGet[0].id */
        
        // this.materials.total = this.materials.purchase - this.materials.discount
/*         this.material.iva ==null ||this.material.iva ==''?this.material.iva="0":this.material.iva
        this.material.purchase ==null ||this.material.purchase ==''?this.material.purchase="0":this.material.purchase
        this.material.discount ==null ||this.material.discount ==''?this.material.discount="0":this.material.discount
        this.material.total ==null ||this.material.total ==''?this.material.total="0":this.material.total   */

        this.material.userId = localStorage.getItem("id")
/*         this.material.type_value = this.typeOption
        this.material.year_made =='' ? this.material.year_made = "0":this.material.year_made =this.material.year_made */
        this.material.status = this.statusOption=='Activo'?true:false
        if(this.material.status==true)this.material.obs =null

        this.$store
          .dispatch("material/updateMaterials", {
            id: this.materialId,
            data: this.material
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("material/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Produto!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizado Com Sucesso!";
                    this.editButton = false;
                    this.filter = this.material.description
                    this.onReset();
                    this.onReset();
                    this.refresh();
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
    // *******************EDIT material (SEND VALUES TO FORM)
    editMaterial() {
      this.editButton = true;
      this.medium = true;
      this.materialId = this.selected[0].id;
      this.material.internal_code = this.selected[0].internal_code;
      this.material.description = this.selected[0].description;
      this.material.serial_number = this.selected[0].serial_number;
      //this.material.year_made = this.selected[0].year_made;
      this.material.manufactured_by = this.selected[0].manufactured_by;
      this.material.modelo = this.selected[0].modelo;
/*       this.material.color = this.selected[0].color; */
      this.material.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
   /*    this.catergoryOption = this.selected[0].Category=='Nenhuma'?'':this.selected[0].Category; */
      this.typeOption = this.selected[0].type_value

/*       this.material.purchase = this.selected[0].purchase;
      this.material.iva = this.selected[0].iva;
      this.material.discount = this.selected[0].discount;
      this.material.total = this.selected[0].total;     */              
      
    },

    // ********************RESET FORM Materials
    onReset() {
      this.medium = false;

      this.material.purchase = null;
      this.material.iva = null;
      this.material.discount = null;
      this.material.total = null;       
      
      this.materialId = null
      this.material.description = null
      this.material.serial_number = null
      this.material.year_made = null
      this.material.manufactured_by = null
      this.material.modelo = null
      this.material.color = null
      this.material.obs = null
      this.catergoryOption = '';
      this.typeOption = 'A'
      this.statusOption = 'Activo'
      this.editButton = false
      this.selected =[]
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
          this.options= []
          this.listCategories.forEach(c => {
            this.options.push(c.name);
          });
        })
        .catch(err => {
          this.$store.commit("category/setErrors", err);
        });
    },

    // ****************************POPULATE TABLE Materials
    listOfMaterials() {
      this.$store
        .dispatch("material/listMaterials")
        .then(res => {
          res.data.materials.forEach(data => {
            this.$store.commit("material/setListMaterials", data);
            this.listMaterials = this.$store.getters["material/getListMaterials"];
          });
          this.data = [];
          for (let i in this.listMaterials) {
            if (this.listMaterials.hasOwnProperty(i)) {
              this.data.push({
                id: this.listMaterials[i].id,
                internal_code: this.serializeUs(this.listMaterials[i].internal_code),
                description: this.listMaterials[i].description,
                marca: this.serializeUs(this.listMaterials[i].marca),
                modelo: this.serializeUs(this.listMaterials[i].modelo),
/*                 color: this.serializeUs(this.listMaterials[i].color), */
                obs: this.serializeUs(this.listMaterials[i].obs),
/*                 type_value: this.serializeUs(this.listMaterials[i].type_value), */
                manufactured_by: this.serializeUs(this.listMaterials[i].manufactured_by),
                serial_number: this.serializeUs(this.listMaterials[i].serial_number),
/*                 categoryId: this.listMaterials[i].categoryId,
                Category:this.listMaterials[i].Category==null?'Nenhuma':this.listMaterials[i].Category.name,
                year_made: this.serializeUs(this.listMaterials[i].year_made), */
                status: this.listMaterials[i].status==true?'Activo':'Inativo',
                user: this.serializeUs(this.listMaterials[i].User.name),
              /*   purchase : this.serializeUs(this.listMaterials[i].purchase),
                iva : this.serializeUs(this.listMaterials[i].iva),
                discount : this.serializeUs(this.listMaterials[i].discount),
                total : this.serializeUs(this.listMaterials[i].total)  */
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("material/setErrors", err);
        });
    },

    // *****************************FILTER FOR material´s SELECT
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

