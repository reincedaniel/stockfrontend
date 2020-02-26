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
        <q-tab icon="item" name="itens" label="Operações" />
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
                @click="editOperation()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteOperation()"
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
                <!-- operation -->
                <div class="text-h6">Operações</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="primary"
                    v-model="operation.name"
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
                    v-model="operation.obs"
                    label="Observação"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetOperation()" v-close-popup />
                <q-btn
                  v-if="editButtonOperation==false"
                  @click="addOperation()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonOperation ==true"
                  @click="updateOperation()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE operation -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataOperation"
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
      editButtonOperation: false,
      listOperations: [],
      medium: false,
      operationId: null,
      operation: {
        name: null,
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
          label: "Cádigo (Operações)",
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
      dataOperation: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("operation/resetListOperations");
      this.listOfOperations();
    },

    // *************** ADD operation
    addOperation() {
      if((this.operation.name=='' || this.operation.name==null)) {

      } 
      else {
        if(this.statusOption == 'Inativo' && (this.operation.obs =='' ||this.operation.obs ==null)){}
          else {
            this.operation.status = this.statusOption=='Activo'?true:false

            this.$store
              .dispatch("operation/addOperations", this.operation)
              .then(res => {
                let msm = "",
                  clr = "red-4";
                if (res.data.code < 0) {
                  this.$store.commit("operation/setErrors", res.data);
                } else {
                  switch (res.data.code) {
                    case 0:
                      msm = "Não foi possivel adicionar Operação!";
                      break;

                    case 1:
                      {
                        clr = "green-4";
                        msm = "Cadastrado Com Sucesso!";
                        this.$store.commit("operation/resetListOperations");
                        this.listOfOperations();
                        this.filter = this.operation.name
                        this.onResetOperation();
                        this.onResetOperation();
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
                this.$store.commit("operation/setErrors", err);
              });
            }
      }

    },

    //****************DELETE operation */
    deleteOperation() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar esta Operação?",
          cancel: "Cancelar",
          ok:"Confirmar",
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("operation/deleteOperations", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("operation/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Apagar Esta Operação!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Operação Apagada Com Sucesso!";
                    this.$store.commit("operation/resetListOperations");
                    this.listOfOperations();
                    this.filter = this.operation.name
                    this.onResetOperation();
                    this.onResetOperation();
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
              this.$store.commit("operation/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE operation */
    updateOperation() {
     if(this.statusOption == 'Inativo' && (this.operation.obs =='' ||this.operation.obs ==null)) {}
      else {
        this.operation.status = this.statusOption=='Activo'?true:false
        if(this.operation.status==true)this.operation.obs =null

        this.$store
          .dispatch("operation/updateOperations", {
            id: this.operationId,
            data: this.operation
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("operation/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar a Operação!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizada Com Sucesso!";
                    this.$store.commit("operation/resetListOperations");
                    this.listOfOperations();
                    this.filter = this.operation.name
                    this.onResetOperation();
                    this.onResetOperation();
                    
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
            this.$store.commit("operation/setErrors", err);
          });
      }
    },

    //*************RESET FORM operation */
    onResetOperation() {
      this.editButtonOperation = false;
      this.operationId = null
      this.operation.name = null
      this.medium = false
      this.selected = []
      this.operation.obs = null
      this.statusOption = 'Activo'
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **********************EDIT operation (SEND VALUES TO FROM operation)
    editOperation() {
      this.editButtonOperation = true;
      this.medium = true;
      this.operationId = this.selected[0].id;
      this.operation.name = this.selected[0].name;
      this.operation.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
      this.statusOption= this.selected[0].status
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

          this.dataOperation = [];
          for (let i in this.listOperations) {
            if (this.listOperations.hasOwnProperty(i)) {
              this.dataOperation.push({
                id: this.listOperations[i].id,
                internal_code: this.serializeUs(this.listOperations[i].internal_code),
                name: this.serializeUs(this.listOperations[i].name),
                status: this.listOperations[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listOperations[i].obs)
                
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("operation/setErrors", err);
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

