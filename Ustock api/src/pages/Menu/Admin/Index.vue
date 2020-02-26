<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="accent"
        indicator-color="accent"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Admin Tools" />
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
              <q-btn size="md"  v-if="!Object.keys(selected).length" round color="accent" @click="medium = true" icon="add_box" />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="editUser()"
                size="md"
                round
                color="warning"
                icon="create"
              />
              <q-btn
                v-if="Object.keys(selected).length && ad==1"
                @click="deleteUser()"
                size="md"
                round
                color="negative"
                icon="delete_forever"
              />

              <q-btn size="md" color="positive" @click="resetPassWordUser()" label="Restaurar Palavra-Passe" v-if="Object.keys(selected).length"  icon="refresh" />
            </div>
          </div>
          <q-dialog v-model="medium" persistent>
            <q-card class="no-border-radius" style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <!-- User -->
                <div class="text-h6">Usuário</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="accent"
                    v-model="user.name"
                    label="Nome Completo"
                    autofocus
                    dense
                    :rules="[val => val && val.length >5 && val.length < 22  || 'No Mínimo 5 Caracteres, no Máximo 22 Caracteres']"
                  />

                  <q-input
                    color="accent"
                    v-model="user.username"
                    label="Nome de Usuário"
                    dense
                    :rules="[val => val && val.length >5 && val.length < 12  || 'No Mínimo 5 Caracteres, no Máximo 12 Caracteres']"
                  />

                  <q-input
                    color="accent"
                    v-model="user.email"
                    label="E-mail"
                    type="email"
                    dense
                  />

                  <q-select
                    label="Nível"
                    v-model="nivelOption"
                    :options="['Administrador','Coordenador','Utilizador']"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                  /> 

                  <q-select
                    label="Estado"
                    v-model="statusOption"
                    :options="['Activo','Inativo']"
                    :rules="[val => !!val || 'Obrigatório']"
                    width="150px"
                  />  

                <q-input
                  v-if="statusOption =='Inativo'"
                  autofocus=""
                    color="accent"
                    v-model="user.obs"
                    label="Observação"
                    :rules="[val => val && val.length > 1 || 'Obrigatório']"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetUser()" v-close-popup />
                <q-btn
                  v-if="editButtonUser ==false"
                  @click="addUser()"
                  color="primary"
                  label="Cadastrar"
                />
                <q-btn
                  v-if="editButtonUser ==true"
                  @click="updateUser()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <div class="q-pa-md">
            <!-- TABLE User -->
            <q-table
              class="no-border-radius my-sticky-column-table"
              :data="dataUser"
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
      nivelOption: 'Utilizador',
      model: null,
      ad:localStorage.getItem('level'), 
      options: [],
      options1: [],
      editButtonUser: false,
      listUsers: [],
      medium: false,
      userId: null,
      editPass: {
        idUserAdmin:localStorage.getItem('id'),
        idUserNormal: null
      },
      user: {
        name: null,
        internal_code: null,
        username:null,
        email: null,
        level: null,
        userId:localStorage.getItem('id'), 
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
          label: "Cádigo (Usuários)",
          align: "left",
          field: row => row.internal_code,
          format: val => `${val}`,
          sortable: true
        },
        { name: "name", align: "left", label: "Nome", field: "name", sortable:true },
        { name: "username", align: "left", label: "Nome de Usuário", field: "username", sortable:true },
        { name: "email", align: "left", label: "E-mail", field: "email", sortable:true },    
        { name: "level", align: "left", label: "Nível", field: "level", sortable:true },    
        { name: "status", align: "left", label: "Estado", field: "status", sortable:true },
        { name: "obs",align: "left", label: "OBS.", field: "obs",sortable: true }
      ],
      dataUser: []
    };
  },
  created() {
    this.refresh();
  },
  methods: {
       //****************Reset PassWord User */
    resetPassWordUser() {
      this.$q
        .dialog({
          color: "accent",
          title: "Restaurar Palavra-Passe",
          message: `Deseja Restaurar a Palavra-Passe de "${this.selected[0].name}" Usuário?`,
          cancel: "Cancelar",
          ok:"Confirmar",
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.editPass.idUserNormal = this.selected[0].id 

          this.$store
            .dispatch("user/updateUsersPassWords", this.editPass)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("user/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Restaurar a Palavra-Passe deste Usuário!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Palavra-Passe Restaurada Com Sucesso!";
                      this.$store.commit("user/resetListUsers");
                      this.listOfUsers();
                      this.onResetUser();
                      this.filter = ''
                      this.editButtonUser = false
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
              this.$store.commit("user/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("user/resetListUsers");
      this.listOfUsers();
    },

    // *************** ADD User
    addUser() {
      if(this.statusOption == 'Inativo' && (this.user.obs =='' ||this.user.obs ==null)){}
      else {
        this.user.status = this.statusOption=='Activo'?true:false
        this.user.level = this.nivelOption=='Utilizador'?3:this.nivelOption=='Coordenador'?2:1
        this.$store
          .dispatch("user/addUsers", this.user)
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("user/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel adicionar Usuário!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Cadastrado Com Sucesso!";
                    this.$store.commit("user/resetListUsers");
                    this.listOfUsers();
                    this.filter = this.user.name
                    this.onResetUser();
                  }
                  break;

                case 11:
                  msm = "O Usuário já existe!";
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
            this.$store.commit("user/setErrors", err);
          });
        }
    },

    //****************DELETE User */
    deleteUser() {
      this.$q
        .dialog({
          color: "red",
          title: "Apagar",
          message: "Deseja Apagar este Usuário?",
          cancel: "Cancelar",
          ok:"Confirmar",          
          persistent: true
        })
        .onOk(() => {
          // xxxxx
          this.$store
            .dispatch("user/deleteUsers", this.selected[0].id)
            .then(res => {
              let msm = "",
                clr = "red-4";
              if (res.data.code < 0) {
                this.$store.commit("user/setErrors", res.data);
              } else {
                switch (res.data.code) {
                  case 0:
                    msm = "Não foi possivel Deletar este Usuário!";
                    break;

                  case 1:
                    {
                      clr = "green-4";
                      msm = "Usuário Deletado Com Sucesso!";
                      this.$store.commit("user/resetListUsers");
                      this.listOfUsers();
                      this.onResetUser();
                      this.filter = ''
                      this.editButtonUser = false
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
              this.$store.commit("user/setErrors", err);
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        });
    },

    //*****************UPDATE User */
    updateUser() {
     if(this.statusOption == 'Inativo' && (this.user.obs =='' ||this.user.obs ==null)) {}
      else {
        this.user.status = this.statusOption=='Activo'?true:false
        this.user.level = this.nivelOption=='Utilizador'?3:this.nivelOption=='Coordenador'?2:1
        if(this.user.status==true)this.user.obs =null

        this.$store
          .dispatch("user/updateUsers", {
            id: this.userId,
            data: this.user
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("user/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar o Usuário!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizado Com Sucesso!";
                    this.$store.commit("user/resetListUsers");
                    this.listOfUsers();
                    this.filter = this.user.name
                    this.onResetUser();
                    this.editButtonUser = false;
                    
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
            this.$store.commit("user/setErrors", err);
          });
      }
    },

    //*************RESET FORM User */
    onResetUser() {
      this.editButtonUser = false;
      this.userId = null;
      this.user.name = null;
      this.user.username = null;
      this.user.email = null;
      this.nivelOption = 'Utilizador';
      this.user.internal_code = null
      this.medium = false;
      this.selected = []
      this.statusOption = 'Activo'
      this.user.obs = null
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **********************EDIT User (SEND VALUES TO FROM User)
    editUser() {
      this.editButtonUser = true;
      this.medium = true;
      this.userId = this.selected[0].id;
      this.user.name = this.selected[0].name;
      this.user.obs = this.selected[0].obs=='-------'?'':this.selected[0].obs
      this.user.username = this.selected[0].username
      this.user.email = this.selected[0].email
      this.user.internal_code = this.selected[0].internal_code
      this.statusOption= this.selected[0].status
      this.nivelOption = this.selected[0].level
    },

    // **************************POPULATE TABLE User
    listOfUsers() {
      this.$store
        .dispatch("user/listUsers")
        .then(res => {
          res.data.users.forEach(data => {
            this.$store.commit("user/setListUsers", data);
            this.listUsers = this.$store.getters[
              "user/getListUsers"
            ];
          });

          this.dataUser = [];
          for (let i in this.listUsers) {
            if (this.listUsers.hasOwnProperty(i)) {
              this.dataUser.push({
                id: this.listUsers[i].id,
                internal_code: this.serializeUs(this.listUsers[i].internal_code),
                name: this.serializeUs(this.listUsers[i].name),
                username: this.serializeUs(this.listUsers[i].username),
                level: this.listUsers[i].level=='3'?'Utilizador':this.listUsers[i].level=='2'?'Coordenador':'Administrador',
                email: this.serializeUs(this.listUsers[i].email),
                status: this.listUsers[i].status==true?'Activo':'Inativo',
                obs:this.serializeUs(this.listUsers[i].obs)
                
              });
            }
          }
        })
        .catch(err => {
          this.$store.commit("user/setErrors", err);
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

