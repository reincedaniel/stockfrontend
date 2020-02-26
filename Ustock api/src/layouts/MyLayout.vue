<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-3">
    <q-header elevated class="bg-primary text-white" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <!-- <img src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">
          <span class="q-ml-sm">Photos</span> -->
          <q-icon size="md" name="streetview"></q-icon><span class="text-bold"> U-Stock</span>
        </q-toolbar-title>

        <q-space />

        <q-space />      
      
      

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" round dense flat color="text-grey-7" >
            <q-tooltip>Maximizar/Minimizar</q-tooltip>
          </q-btn>

          <q-btn to="/" round dense flat color="text-grey-7" icon="apps">
            <q-tooltip>Dashboard</q-tooltip>
          </q-btn>

          <q-btn to="/entrada" round dense flat color="text-grey-7" icon="arrow_downward">
            <q-tooltip>Entradas</q-tooltip>
          </q-btn>

          <q-btn to="/saida" round dense flat color="text-grey-7" icon="arrow_upward">
            <q-tooltip>Saidas</q-tooltip>
          </q-btn>
<!--           <q-btn round dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating>
              0
            </q-badge>
            <q-tooltip>Notificações</q-tooltip>
          </q-btn> -->
          <q-btn to="/me" round flat>
            <q-icon name="account_circle"></q-icon>
            <q-tooltip>Conta</q-tooltip>
          </q-btn>
          <label round dense flat color="text-grey-7" icon="apps">
         <span class="text-bold">{{userLog.username}}</span> | {{a==1?"Administrador":a==2?"Coordenador":"Utilizador"}}
          </label>

        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit  bg-primary">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-white">
            <!-- <img class="q-pl-md" src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg">
            <span class="q-ml-sm">Photos</span> -->
            <q-icon name="toll"></q-icon><span class="text-bold"> U-Stock</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list v-if="!$q.screen.gt.sm" padding>
          <q-item exact v-ripple  v-for="link in links1" @click="leftDrawerOpen = false" :to="link.to" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon color="white" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list padding>

          <q-separator class="q-my-md" />

          <q-item  exact v-ripple v-for="link in links2" :key="link.text" :to="link.to" v-show="a<3" @click="leftDrawerOpen = false" clickable class="text-bold text-grey-2">
            <q-item-section avatar>
              <q-icon color="white" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item exact v-ripple v-for="link in links3" @click="leftDrawerOpen = false" :to="link.to" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon color="white" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>


          <q-separator class="q-my-md" />
          <div class="text-center fixed-bottom q-pb-md">
            <q-btn
            @click="logout()"
              size="15px"
              round
              class="text-blue-5"
              color="white"
              icon="power_settings_new"
            >
             <q-tooltip > <span class="text-caption">Terminar a sessão</span></q-tooltip>
            </q-btn>
          </div>


        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column bg-primary">

          <q-btn v-for="link in links1" :key="link.text" :to="link.to" exact round flat color="grey-1" stack no-caps size="26px" class="GPL__side-btn">
            <q-icon size="22px" :name="link.icon" />
            <div class="GPL__side-btn__label">{{link.text}}</div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'GooglePhotosLayout',

  data () {
    return {
      userLog:{},
      leftDrawerOpen: false,
      search: '',
      a: localStorage.getItem('level'),
      storage: 0.26,
      links1: [
/*      { icon: 'apps', text: 'Dashboard', to: '/' },    */
        { icon: 'widgets', text: 'Artigos', to: '/proser' },
        { icon: 'web', text: 'Equipamentos', to: '/material' },
        { icon: 'supervisor_account', text: 'Clientes', to: '/clients' },
        { icon: 'local_car_wash', text: 'Fornecedores', to: '/providers' },
        { icon: 'featured_video', text: 'Operações', to: '/operations' },
        { icon: 'arrow_downward', text: 'Transferência', to: '/output' },
/*         { icon: 'toll', text: 'Categorias', to: '/category' },
        { icon: 'location_on', text: 'Locais', to: '/locations' },
        { icon: 'redo', text: 'Entrada', to: '/tasks' },
        { icon: 'undo', text: 'Transferência', to: '/tasks' } */
        
      ],
      links2: [
        { icon: 'lock', text: 'Admin Tools', to: '/admin' }/* ,
        { icon: 'flag', text: 'Tarefa Geral', to: '/tasks' },
        { icon: 'settings', text: 'Configurações', to: '/settings' } */
      ],
      links3: [
        { icon: 'redo', text: 'Entradas', to: '/entrada' },
        { icon: 'undo', text: 'Saidas', to: '/saida' },
        { icon: 'account_box', text: 'Minha Conta', to: '/me' }
      ]
    }
  },
  mounted() {
    this.isLogged ()
  },created(){
    this.isLogged ()
  },
  methods: {
    isLogged () {
      this.$store.dispatch('login/isValidToken')
      .then(res => {
        if(res==false)
          this.$router.push('/auth')
      })
      .catch()
        this.userLog = {id: localStorage.getItem('id'), username:localStorage.getItem('name')}
      
    },
    logout() {
      this.leftDrawerOpen = false
      this.$q.dialog({
         color: 'info',
        title: 'Terminar a Sessão',
        message: 'Deseja Terminara Sessão?',
        cancel: "Cancelar",
        ok:"Confirmar",
        persistent: true
      }).onOk(() => {this.$router.push('/auth')})
      .onCancel(()=>{

      })
    }

  }
}
</script>

<style lang="scss">
  .q-drawer {
    .q-router-link--exact-active {
     .q-item__label{color: white !important;} 
    }
  }

</style>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: white
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>