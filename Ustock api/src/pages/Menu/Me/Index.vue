<template>
  <q-page class="flex bg-white">
    <div class="full-width">
      <q-tabs
        v-model="tab"
        dense
        align="justify"
        active-color="warning"
        indicator-color="warning"
        narrow-indicator
        class="text-grey"
      >
        <q-tab icon="item" name="itens" label="Minha Conta" />
        <q-tab icon="fast_food" disable name="estoque" label="" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="itens">
          <div class="q-pa-md">
            <div class="row q-gutter-sm">
              <div class="full-width">
                <q-list bordered>
                  <q-item clickable v-ripple>
                    <q-item-section avatar>
                      <q-avatar>
                        <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
                        <q-icon color="primary" name="account_circle" size="xl"></q-icon>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>Código<strong>{{user.internal_code}}</strong></q-item-section>
                    <q-item-section>Nome<strong>{{user.name}}</strong></q-item-section> 
                    <q-item-section>Usuário<strong>{{user.username}}</strong></q-item-section>
                    <q-item-section>E-mail<strong>{{user.email}}</strong></q-item-section>
                    <q-item-section>Nível<strong>{{user.level==1?'Administrador':user.level==3?'Utilizador':'Coordenador'}}</strong></q-item-section>
                    <q-item-section>Estado<strong>{{user.status==true?'Activo':'Inativo'}}</strong></q-item-section>
                   <!-- <q-item-section>Obs.<strong>{{serializeUs(user.obs)}}</strong></q-item-section> -->

                  </q-item>  
                </q-list>   
              </div>         
<!--               <q-input color="primary" autofocus dense debounce="300" v-model="filter" placeholder="Pesquisar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn size="xs" color="grey-7" @click="filter = ''" icon="format_clear" />
              <q-btn size="md" v-if="!Object.keys(selected).length" round color="info" @click="refresh()" icon="refresh" /> 
              <q-btn size="md"  v-if="!Object.keys(selected).length" round color="accent" @click="medium = true" icon="add_box" />-->
              <q-btn
                @click="medium =true"
                size="md"
                label="Alterar os Meus Dados"
                color="warning"
                icon="create"
              />

              <q-btn size="md" color="primary" @click="mediumPassWord = true" label="Mudar a Palavra-Passe"  icon="refresh" />
            </div>
          </div>
          <q-dialog v-model="medium" persistent>
            <q-card class="no-border-radius" style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <!-- User -->
                <div class="text-h6">Minha Conta</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                  <q-input
                    color="accent"
                    v-model="user.name"
                    label="Nome"
                    autofocus
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    disable
                    color="accent"
                    v-model="user.username"
                    label="Nome de Usuário"
                    dense
                    :rules="[val => !!val || 'Obrigatório']"
                  />

                  <q-input
                    color="accent"
                    v-model="user.email"
                    label="E-mail"
                    type="email"
                    dense
                  />

                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetUser()" v-close-popup />

                <q-btn
                  @click="updateUser()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="mediumPassWord" persistent>
            <q-card class="no-border-radius" style="width: 700px; max-width: 80vw;">
              <q-card-section>
                <!-- User -->
                <div class="text-h6">Mudar a Palavra-Passe</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="row q-mb-sm q-gutter-xl">

                <q-input
                  v-model="dtPassWord.passwordOld"
                  bg-color="white"
                  :type="isPwd ? 'password' : 'text'"
                  label="Palavra-Passe Antiga"
                  hint=""
                  lazy-rules
                  :rules="[val => val && val.length > 5 || 'No Mínimo 6 caracteres']"
                >
                  <template v-slot:append>
                    <q-icon
                    
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>  


                <q-input
                  v-model="dtPassWord.passwordNew"
                  bg-color="white"
                  :type="isPwd ? 'password' : 'text'"
                  label="Palavra-Passe Nova"
                  hint=""
                  lazy-rules
                  :rules="[val => val && val.length > 5 || 'No Mínimo 6 caracteres']"
                >
                  <template v-slot:append>
                    <q-icon
                  
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>


                <q-input
                  v-model="confirmarPassword"
                  bg-color="white"
                  :type="isPwd ? 'password' : 'text'"
                  label="Confimar"
                  hint="Confimar Palavra-Passe Nova"
                  lazy-rules
                  :rules="[val => val && val == dtPassWord.passwordNew || 'Palavra-Passe Diferente']"
                >
                  <template v-slot:append>
                    <q-icon
                     
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>


                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn color="warning" label="Cancelar" @click="onResetUserPassWord()" v-close-popup />

                <q-btn
                  @click="resetPassWordUser()"
                  color="secondary"
                  label="Actualizar"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

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
      isPwd: true,
      idLogged:localStorage.getItem('id'),
      model: null,
      ad:localStorage.getItem('level'), 
      listUsers: [],
      medium: false,
      mediumPassWord:false,
      userId: null,
      dt: {
        name:null,
        username: null,
        email: null
      },
      dtPassWord: {
        passwordOld:null,
        passwordNew: null
      },
      confirmarPassword:null,
      user: {
        name: null,
        internal_code: null,
        username:null,
        email: null,
        level: null,
        obs:null,
        status:null
      },
      dataUser: []
    };
  },
  created() {
    this.refresh();
  },
  mounted(){
    this.listOfUsers()
    this.onResetUserPassWord()
  },
  methods: {
       //****************Reset PassWord User */
    resetPassWordUser() {

      if(this.confirmarPassword !== this.dtPassWord.passwordNew) {}
      else {

        this.$store
          .dispatch("profile/updateProfilePassWord", {
            id: this.user.id,
            data: this.dtPassWord
          })
          .then(res => { 
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("profile/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar a Palavra-Passe!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Palavra-Passe Actualizada Com Sucesso!";
                    this.$store.commit("profile/resetListProfile");
                    this.listOfUsers();
                    this.onResetUser();
                    this.onResetUserPassWord()
                    
                  }
                  break;
                case 111:
                  msm = "Palavra-Passe Antiga Inválida!";
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
            this.$store.commit("profile/setErrors", err);
          });        
      }
/*       this.$q
        .dialog({
          color: "accent",
          title: "Restaurar Palavra-Passe",
          message: `Deseja Restaurar a Palavra-Passe de ${this.selected[0].name} Usuário?`,
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
        }); */
    },

    // ********************* Refresh alll store
    refresh() {
      this.$store.commit("profile/resetListProfile");
      this.listOfUsers();
    },

    //*****************UPDATE User */
    updateUser() {
     if(this.user.name == '' || this.user.name==null || this.user.username =='' ||this.user.username ==null) {}
      else {
        this.dt.name = this.user.name
        this.dt.username = this.user.username
        this.dt.email = this.user.email

        this.$store
          .dispatch("profile/updateProfile", {
            id: this.user.id,
            data: this.dt
          })
          .then(res => {
            let msm = "",
              clr = "red-4";
            if (res.data.code < 0) {
              this.$store.commit("profile/setErrors", res.data);
            } else {
              switch (res.data.code) {
                case 0:
                  msm = "Não foi possivel actualizar os dados do Usuário!";
                  break;

                case 1:
                  {
                    clr = "green-4";
                    msm = "Actualizado Com Sucesso!";
                    this.$store.commit("profile/resetListProfile");
                    this.listOfUsers();
                    this.onResetUser();
                    
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
            this.$store.commit("profile/setErrors", err);
          });
      }
    },

    //*************RESET FORM User */
    onResetUser() {
      this.medium = false;
      this.listOfUsers()
    },
        //*************RESET FORM User */
    onResetUserPassWord() {
      this.mediumPassWord = false;
      this.dtPassWord.passwordNew = null
      this.dtPassWord.passwordOld = null
      this.confirmarPassword = null
      this.listOfUsers()
    },

    //Serialize
    serializeUs(value) {
      if(value=='' || value ==null)return '-------'
      else return value
    },

    // **************************POPULATE TABLE User
    listOfUsers() {
      this.$store
        .dispatch("profile/listProfile",this.idLogged)
        .then(res => {
            this.user.id = res.data.users.id
            this.user.name =res.data.users.name
            this.user.username = res.data.users.username
            this.user.obs = res.data.users.obs 
            this.user.status = res.data.users.status
            this.user.internal_code = res.data.users.internal_code
            this.user.email = res.data.users.email
            this.user.level = res.data.users.level
        })
        .catch(err => {
          this.$store.commit("profile/setErrors", err);
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

