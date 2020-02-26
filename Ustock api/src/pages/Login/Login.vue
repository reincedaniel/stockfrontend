<template>
  <q-page class="docs-input row justify-center">
    <!-- content -->
    <div class="col-xl-4 col-lg-4 col-md-3 col-sm-6 col-xs-12 q-pa-md">
      <div class="flex flex-center" />


      <div class="text-center q-pb-xs" style="color:grey">
        <p class="text-h6">
          <!-- <q-icon name="lock" />
          <strong>Controle de</strong>Acesso -->
          ...
        </p>
      </div>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input

          bg-color="white"
          v-model="user.username"
          label="Ex: enzo98 *"
          hint="Usuário"
          :error="isTest"
          required
          lazy-rules
          :rules="[ val => val && val.length > 3 || 'Usuário Inválido']"
        />
        <!-- , val => val && lockUser ==val || 'Usuário inválido' -->
<!-- :rules="[ val => val && tt ==val || 'Senha inválida']" -->
        <q-input
          v-model="user.password"
          bg-color="white"
          :type="isPwd ? 'password' : 'text'"
          label="Ex: k5LTvs *"
          hint="Palavra-passe"
          lazy-rules
          :rules="[val => val && val.length > 3 || 'Palavra-Passe Inválida']"
        >
        <!-- val => val && val>5 || 'Senha inválida', -->
          <template v-slot:append>
            <q-icon
              :error="isTest"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="row">
            <q-btn
          padding
          label="Entrar"
          type="submit"
          @Click="onSubmit"
          color="primary"
          class="full-width"
        /> 
        </div>
        
      </q-form>
      <!--  <div class="q-mt-xl">
        <q-btn color="light-blue" @Click="onSubmit" class="full-width" icon="input" size="md"> Entrar</q-btn>
      </div>-->
    </div>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'


export default {
  data() {
    return {
      user: {
          username: '',
          password: ''
      },

      userLogged:{},
      isTest: false,
      isPwd: true
    };
  },
  created(){
    this.$store.dispatch('login/clearToken')
  },
  mounted() {
  },
  methods: {

    onSubmit() {
      this.logar()
    },
    logar() {
      this.$store.dispatch('login/login', this.user)
      .then(res=>{
          let msm ='', clr = 'red-4'
          if(res.data.code <1 ){
     
                this.$store.commit('login/setErrors', res.data)

            } 
            else {
                switch (res.data.code) {
                    case 110: {
                      clr = 'red-4' 
                      msm ='Usuário Inválido!'
                    }
                    break;

                    case 1111: {
                      clr = 'orange-9'
                      msm ='Conta de Usuário INATIVO!' 
                    }
                    break;                    

                    case 111: {
                      clr = 'red-4' 
                      msm ='Palavra-Passe Inválida!' 
                    }
                    break;

                    case 12: {
                        clr = 'green-4'
                        msm ='Acesso Permitido!' 
                        this.$store.commit('login/setUserLogged', res.data)
                        this.userLogged = this.$store.getters['login/getUserLogged']
                        this.$store.dispatch('login/addToken', {token:res.data.token, id:res.data.users.id, username: res.data.users.username, level: res.data.users.level, name: res.data.users.name})
                        this.$router.push('/.')

                        }
                    break;

                    default:  {
                      clr = 'blue-9'
                        msn = 'Contacte o Suporte da UCall: +244 936785605!'
                        break;
                    }
                }
                this.$q.notify({
                color: clr,
                position: "top",
                textColor: "white",
                icon: "fas fa-check-circle",
                message: msm
                });
            }
      })
      .catch(err=>{
          this.$store.commit('login/setErrors', err)
      })
    }
  }
};
</script>

<style>
</style>
