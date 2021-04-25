<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <!-- <h1>{{ $t("cashtray_report") }}</h1>
          <p class="desc">{{ $t("cashtray_desc") }}</p> -->
        </div>
        <v-card>
          
          <v-data-table
            :headers="datatable.headers"
            :items="datatable.docs"
            :search="datatable.search"
            :loading="loading"
            hide-default-footer
            disable-pagination
            dense
          >
            <template v-slot:top>
                <v-toolbar
                    flat
                >
                    <v-toolbar-title>المستندات المفتوحة</v-toolbar-title>
                    
                    <v-divider
                    class="mx-4"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <!-- <buy-modal v-if="$route.query.type !== -1"/> -->
                    <v-btn  @click.prevent="goToFirst()" >مستند جديد</v-btn>
                   
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import BuyModal from "@/components/BuyModal.vue"
import { mapGetters } from "vuex"

// import { GET_CASHTRAY } from "@/store/cashtray.module";
export default {
    components:{
        BuyModal
    },
   
  computed: {
    ...mapGetters("datatable", [
      "loading", // -> this.someGetter
      "datatable", // -> this.someOtherGetter
    ]),
  },
  methods: {
    getOpenDocs() {
        const payload = {
          DevNo :  parseInt(localStorage.getItem('device')),
          TrSerial : parseInt(this.$route.query.transaction)
        }
        this.$store.dispatch("datatable/getOpenDocs", payload);
    },
    test(){
      console.log('test')
    },
    goToFirst(){
      if(this.$route.query.type !== -1){
        this.$store.commit('ui/modal' , true)
        return
      } 
      this.$router.push({name:'buy' , query: {store :  localStorage.getItem('store') , supplier : 0 , invoice : 0  , transaction : this.$route.query.transaction}})
    },
    editItem(item){
        // console.log(item.AccontSerial)
        this.$router.push({name:'buy' , query: {store : item.StoreCode , supplier : item.AccontSerial , invoice : item.Invoice , document : item.DocNo , transaction : this.$route.query.transaction}})
    }
  },

  mounted() {
    this.getOpenDocs();
  },
};
</script>
