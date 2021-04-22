<template>
  <v-app>
    <v-main>
        <nuxt />
        <modal/>
    </v-main>
  </v-app>
</template>
<script>

export default {
  middleware:'auth',
  created(){
    this.$store.dispatch('store/get')
  },
  mounted(){
    !localStorage.getItem('device') 
    ? localStorage.setItem('device' ,1)
    : ''

    !localStorage.getItem('store') 
    ? localStorage.setItem('store' ,1)
    : ''
  }
}
</script>