<template>
  <q-layout view="lHh Lpr fff" class="bg-white">
    <q-header elevated class="bg-primary text-white" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
<!--         <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        /> -->

        <q-toolbar-title shrink class="row items-center absolute-center no-wrap">
          <!-- <img v-if="$q.screen.gt.sm" src="https://cdn.quasar.dev/img/layout-gallery/logo-google.svg">
          <span class="q-ml-sm">Photos</span> -->
           <q-icon size="md" name="streetview"></q-icon><span class="text-bold"> U-Stock</span>
        </q-toolbar-title>

        <q-space />

        <q-space />

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <!-- <img class="q-pl-md" src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg">
            <span class="q-ml-sm">Photos</span> -->
             <q-icon name="streetview"></q-icon><span class="text-bold"> U-Stock</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-separator class="q-my-md" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'GooglePhotosLayout',

  data () {
    return {
      leftDrawerOpen: false,
      links2: [
        { icon: 'help', text: 'Ajuda' },
        { icon: 'info', text: 'Sobre' }
      ]
    }
  }
}
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

</style>