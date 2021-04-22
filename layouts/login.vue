<template>
  <v-app>
    <v-main>
        <nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  mounted(){
    !localStorage.getItem('device') 
    ? localStorage.setItem('device' ,1)
    : ''
  }
}
</script>