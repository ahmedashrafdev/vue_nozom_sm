<template>
    <v-app id="inspire">
        

        <v-app-bar app color="primary">

        <v-toolbar-title>
          {{pageTitle}}
        </v-toolbar-title>
        </v-app-bar>

        <v-main>
            <nuxt style="min-height:10000px"/>
        </v-main>

    <v-bottom-navigation app :value="value" >
        <v-btn block color="primary">
        <span style="color:#fff; font-size:20px">حفظ</span>
        <v-icon>mdi-save</v-icon>
        </v-btn>
    </v-bottom-navigation>
    </v-app>
    
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    data: () => ({ drawer: null ,  value: 1 }),
    computed:{
       ...mapGetters({
        pageTitle: 'ui/pageTitle'
      })
    },
    mounted(){
      !localStorage.getItem('device') 
      ? localStorage.setItem('device' ,1)
      : ''
    }
  }
</script>