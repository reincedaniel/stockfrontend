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
        <q-tab icon="item" name="itens" label="Locais" />
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
                @click="editLocation()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteLocation()"
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
                <!-- location -->
                <div class="text-h6">Locais</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="primary"
                    v-model="location.description"
                    label="Identificador"
                    autofocus
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="primary"
                    v-model="location.corredor"
                    label="Corredor"
                    dense
                  />

                  <q-input
                    color="primary"
                    v-model="location.pratileira"
                    label="Armário"
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
                    v-model="location.obs"
                    label="Observação"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetLocation()" v-close-popup />
                <q-btn
                  v-if="editButtonLocation==false"
                  @click="addLocation()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonLocation ==true"
                  @click="updatelocation()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE location -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataLocation"
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
      statusOption:'Activo',
      model: null,
      ad:localStorage.getItem('level'), 
      options: [],
      options1: [],
      editButtonLocation: false,
      listLocations: [],
      medium: false,
      locationId: null,
      location: {
        description: null,
        corredor: null,
        pratileira: null,
        obs:null,
        status:null
      },
      filter: "",
      selected: [],
      data: [],
      columns: [
        {
          description: "description",
          required: true,
          label: "Cádigo (Locais)",
          align: "left",
          field: row => row.description,
          format: val => `${val}`,
          sortable: true
        },
        { name: "corredor", align: "left", label: "Corredor", field: "corredor", sortable:true },
        { name: "pratileira", align: "left", label: "Armário", field: "pratileira", sortable:true },
        { name: "status", align: "left", label: "Estado", field: "status", sortable:true },
        { name: "obs",align: "left", label: "OBS.", field: "obs",sortable: true }
      ],
      dataLocation: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("location/resetListLocations");
      this.listOfLocations();
    },

    // *************** ADD location
    addLocation() {
      if(this.statusOption == 'Inativo' && (this.location.obs =='' ||this.location.obs ==null)){}
      else {
        this.location.status = this.statusOption=='Activo'?true:false

        this.$store
          .dispatch("location/addLocations", this.location)
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("location/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel adicionar Local!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Cadastrado Com Sucesso!";
                    this.$store.commit("location/resetListLocations");
                    this.listOfLocations();
                    this.filter = this.location.description
                    this.onResetLocation();
                    this.onResetLocation();
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
            this.$store.commit("location/setErrors", err);
          });
        }
    },

    //****************DELETE location */
    deleteLocation() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar este Local?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("location/deleteLocations", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("location/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Apagar Este Local!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Local Apagado Com Sucesso!";
                    this.$store.commit("location/resetListLocations");
                    this.listOfLocations();
                    this.filter = this.location.description
                    this.onResetLocation();
                    this.onResetLocation();
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
              this.$store.commit("location/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE location */
    updatelocation() {
     if(this.statusOption == 'Inativo' && (this.location.obs =='' ||this.location.obs ==null)) {}
      else {
        this.location.status = this.statusOption=='Activo'?true:false
        if(this.location.status==true)this.location.obs =null

        this.$store
          .dispatch("location/updateLocations", {
            id: this.locationId,
            data: this.location
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("location/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Local!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizada Com Sucesso!";
                    this.$store.commit("location/resetListLocations");
                    this.listOfLocations();
                    this.filter = this.location.description
                    this.onResetLocation();
                    this.onResetLocation();
                    
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
            this.$store.commit("location/setErrors", err);
          });
      }
    },

    //*************RESET FORM location */
    onResetLocation() {
      this.editButtonLocation = false;
      this.locationId = null
      this.location.description = null
      this.medium = false
      this.selected = []
      this.location.obs = null
      this.statusOption = 'Activo'
      this.location.corredor = null;
      this.location.pratileira = null;
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **********************EDIT location (SEND VALUES TO FROM location)
    editLocation() {
      this.editButtonLocation = true;
      this.medium = true;
      this.locationId = this.selected[0].id;
      this.location.description = this.selected[0].description;
      this.location.email = this.selected[0].email;
      this.location.corredor = this.selected[0].corredor;
      this.location.pratileira = this.selected[0].pratileira;
      this.location.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
      this.statusOption= this.selected[0].status
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

          this.dataLocation = [];
          for (let i in this.listLocations) {
            if (this.listLocations.hasOwnProperty(i)) {
              this.dataLocation.push({
                id: this.listLocations[i].id,
                description: this.serializeUs(this.listLocations[i].description),
                  corredor: this.serializeUs(this.listLocations[i].corredor),
                   pratileira: this.serializeUs(this.listLocations[i].pratileira),
                status: this.listLocations[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listLocations[i].obs)
                
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("location/setErrors", err);
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

