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
        <q-tab icon="item" name="itens" label="Clientes" />
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
                @click="editClient()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteClient()"
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
                <!-- Client -->
                <div class="text-h6">Clientes</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="primary"
                    v-model="client.name"
                    label="Nome"
                    autofocus
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
                    v-model="client.obs"
                    label="Observação"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetClient()" v-close-popup />
                <q-btn
                  v-if="editButtonClient ==false"
                  @click="addClient()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonClient ==true"
                  @click="updateClient()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE Client -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataClient"
              color="info"
              :columns="columns"
              :filter="filter"
              selection="single"
              :selected.sync="selected"
              :fullscreen="isFullscreen"
            >
              <template v-slot:top>
                <q-btn color="primary" icon="fullscreen"  @click="isFullscreen=!isFullscreen" />
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
      editButtonClient: false,
      listClients: [],
      medium: false,
      clientId: null,
      client: {
        name: null,
        internal_code: null,
        obs:null,
        status:null
      },
      filter: "",
      selected: [],
      data: [],
      columns: [
        {
          name: "internal_code",
          required: true,
          label: "Cádigo (Clientes)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "name", align: "left", label: "Nome", field: "name", sortable:true }
        ,
        { name: "status", align: "left", label: "Estado", field: "status", sortable:true },
        { name: "obs",align: "left", label: "OBS.", field: "obs",sortable: true }
      ],
      dataClient: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("client/resetListClients");
      this.listOfClients();
    },

    // *************** ADD Client
    addClient() {
    if((this.client.name=='' || this.client.name==null)) {

      } 
      else {
        if(this.statusOption == 'Inativo' && (this.client.obs =='' ||this.client.obs ==null)){}
          else {
            this.client.status = this.statusOption=='Activo'?true:false

            this.$store
              .dispatch("client/addClients", this.client)
              .then(res => {
                let msm = "",
                  clr = "red-4";
                if (res.data.code < 0) {
                  this.$store.commit("client/setErrors", res.data);
                } else {
                  switch (res.data.code) {
                    case 0:
                      msm = "Não foi possivel adicionar Cliente!";
                      break;

                    case 1:
                      {
                        clr = "green-4";
                        msm = "Cadastrado Com Sucesso!";
                        this.$store.commit("client/resetListClients");
                        this.listOfClients();
                        this.filter = this.client.name
                        this.onResetClient();
                      }
                      break;

                    case 11:
                      msm = "O Cliente já existe!";
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
                this.$store.commit("client/setErrors", err);
              });
            }
      }

    },

    //****************DELETE Client */
    deleteClient() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar este Cliente?",
          cancel: "Cancelar",
          ok:"Confirmar",
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("client/deleteClients", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("client/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Deletar este Cliente!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Cliente Deletado Com Sucesso!";
                      this.$store.commit("client/resetListClients");
                      this.listOfClients();
                      this.onResetClient();
                      this.filter = ''
                      this.editButtonClient = false
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
              this.$store.commit("client/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE Client */
    updateClient() {
     if(this.statusOption == 'Inativo' && (this.client.obs =='' ||this.client.obs ==null)) {}
      else {
        this.client.status = this.statusOption=='Activo'?true:false
        if(this.client.status==true)this.client.obs =null

        this.$store
          .dispatch("client/updateClients", {
            id: this.clientId,
            data: this.client
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("client/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Cliente!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizado Com Sucesso!";
                    this.$store.commit("client/resetListClients");
                    this.listOfClients();
                    this.filter = this.client.name
                    this.onResetClient();
                    this.editButtonClient = false;
                    
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
            this.$store.commit("client/setErrors", err);
          });
      }
    },

    //*************RESET FORM Client */
    onResetClient() {
      this.editButtonClient = false;
      this.clientId = null;
      this.client.name = null;
      this.client.internal_code = null
      this.client.obs = null
      this.medium = false;
      this.selected = []
      this.statusOption = 'Activo'
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **********************EDIT Client (SEND VALUES TO FROM Client)
    editClient() {
      this.editButtonClient = true;
      this.medium = true;
      this.clientId = this.selected[0].id;
      this.client.name = this.selected[0].name;
      this.client.internal_code = this.selected[0].internal_code
      this.statusOption= this.selected[0].status
      this.client.obs = this.selected[0].obs
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

