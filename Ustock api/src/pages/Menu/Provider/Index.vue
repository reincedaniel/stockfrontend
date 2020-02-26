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
        <q-tab icon="item" name="itens" label="Fornecedores" />
        <q-tab icon="fast_food" disable name="estoque" label="" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
          <div class="q-pa-md">
            <div class="row q-gutter-sm">
              <q-input color="primary" autofocus dense debounce="300" v-model="filter" placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-btn size="xs" color="grey-7" @click="filter = ''" icon="format_clear" />
                            <q-btn size="md" v-if="!Object.keys(selected).length" round color="info" @click="refresh()" icon="refresh" />
              <!-- <q-btn size="xs" color="blue-7" to='/proser' icon="web" /> -->
              <q-btn size="md"  v-if="!Object.keys(selected).length" round color="primary" @click="medium = true" icon="add_box" />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="editProvider()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteProvider()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

            </div>
          </div>
          <q-dialog v-model="medium" persistent>
            <q-card class="no-border-radius" style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <!-- Provider -->
                <div class="text-h6">Fornecedores</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="primary"
                    v-model="provider.name"
                    label="Nome"
                    autofocus
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="provider.email"
                    type="email"
                    label="E-mail"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="provider.phone1"
                    label="Telefone(1)"
                    dense
                     :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="provider.phone2"
                    label="Telefone(2)"
                    dense
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
                    v-model="provider.obs"
                    label="Motivo"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="provider.info"
                    label="Observação"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetProvider()" v-close-popup />
                <q-btn
                  v-if="editButtonProvider==false"
                  @click="addProvider()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonProvider ==true"
                  @click="updateProvider()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE Provider -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataProvider"
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
      isFullscreen:false,
      statusOption:'Activo',
      model: null,
      ad:localStorage.getItem('level'), 
      options: [],
      options1: [],
      editButtonProvider: false,
      listProviders: [],
      medium: false,
      providerId: null,
      provider: {
        name: null,
        email: null,
        phone1: null,
        phone2: null,
        obs:null,
        info:null,
        status:null
      },
      filter: "",
      selected: [],
      data: [],
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Cádigo (Fornecedores)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "name", align: "left", label: "Nome", field: "name", sortable:true },
        { name: "email", align: "left", label: "E-mail", field: "email", sortable:true },
        { name: "phone1", align: "left", label: "Telefone(1)", field: "phone1", sortable:true },
        { name: "phone2", align: "left", label: "Telefone(2)", field: "phone2", sortable:true },
        { name: "status", align: "left", label: "Estado", field: "status", sortable:true },
        { name: "obs",align: "left", label: "Motivo", field: "obs",sortable: true },
        { name: "info",align: "left", label: "OBS.", field: "info",sortable: true }
      ],
      dataProvider: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("provider/resetListProviders");
      this.listOfProviders();
    },

    // *************** ADD Provider
    addProvider() {
      if((this.provider.name=='' || this.provider.name==null) || (this.provider.phone1=='' || this.provider.phone1==null)) {

      } 
      else {
        if(this.statusOption == 'Inativo' && (this.provider.obs =='' ||this.provider.obs ==null)){}
        else {
          this.provider.status = this.statusOption=='Activo'?true:false

          this.$store
            .dispatch("provider/addProviders", this.provider)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("provider/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel adicionar Fornecedor!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Cadastrado Com Sucesso!";
                      this.$store.commit("provider/resetListProviders");
                      this.listOfProviders();
                      this.filter = this.provider.name
                      this.onResetProvider();
                      this.onResetProvider();
                    }
                    break;

                  case 11:
                    msm = "A Operação já existe!";
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
              this.$store.commit("provider/setErrors", err);
            });
          }
      }


    },

    //****************DELETE Provider */
    deleteProvider() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar este Fornecedor?",
          cancel: "Cancelar",
          ok:"Confirmar",
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("provider/deleteProviders", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("provider/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Apagar Este Fornecedor!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Fornecedor Apagado Com Sucesso!";
                    this.$store.commit("provider/resetListProviders");
                    this.listOfProviders();
                    this.filter = this.Provider.name
                    this.onResetProvider();
                    this.onResetProvider();
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
              this.$store.commit("provider/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE Provider */
    updateProvider() {
     if(this.statusOption == 'Inativo' && (this.provider.obs =='' ||this.provider.obs ==null)) {}
      else {
        this.provider.status = this.statusOption=='Activo'?true:false
        if(this.provider.status==true)this.provider.obs =null

        this.$store
          .dispatch("provider/updateProviders", {
            id: this.providerId,
            data: this.provider
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("provider/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Fornecedor!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizada Com Sucesso!";
                    this.$store.commit("provider/resetListProviders");
                    this.listOfProviders();
                    this.filter = this.provider.name
                    this.onResetProvider();
                    this.onResetProvider();
                    
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
            this.$store.commit("provider/setErrors", err);
          });
      }
    },

    //*************RESET FORM Provider */
    onResetProvider() {
      this.editButtonProvider = false;
      this.providerId = null
      this.provider.name = null
      this.medium = false
      this.selected = []
      this.provider.obs = null
      this.provider.info = null
      this.statusOption = 'Activo'
      this.provider.email = null;
      this.provider.phone1 = null;
      this.provider.phone2 = null;
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **********************EDIT Provider (SEND VALUES TO FROM Provider)
    editProvider() {
      this.editButtonProvider = true;
      this.medium = true;
      this.providerId = this.selected[0].id;
      this.provider.name = this.selected[0].name;
      this.provider.email = this.selected[0].email;
      this.provider.phone1 = this.selected[0].phone1;
      this.provider.phone2 = this.selected[0].phone2;
      this.provider.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
      this.provider.info = this.selected[0].info=='-------'?'':this.selected[0].info
      this.statusOption= this.selected[0].status
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

          this.dataProvider = [];
          for (let i in this.listProviders) {
            if (this.listProviders.hasOwnProperty(i)) {
              this.dataProvider.push({
                id: this.listProviders[i].id,
                internal_code: this.serializeUs(this.listProviders[i].internal_code),
                name: this.serializeUs(this.listProviders[i].name),
                 email: this.serializeUs(this.listProviders[i].email),
                  phone1: this.serializeUs(this.listProviders[i].phone1),
                   phone2: this.serializeUs(this.listProviders[i].phone2),
                status: this.listProviders[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listProviders[i].obs),
                info:this.serializeUs(this.listProviders[i].info)

                
              });
            }
          }
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
    background-color: white

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

