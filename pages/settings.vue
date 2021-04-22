<template>
    <v-container>
        <v-list
          three-line
          subheader
        >
            <v-subheader>اختر الفرع الرئيسي</v-subheader>
            <v-list-item>
                <v-select
                    :items="stores"
                    label="اختر الفرع"
                    item-text="store_name"
                    item-value="store_code"
                    v-model="storeCode"
                    hide-details
                    solo
                    >
                </v-select>
            </v-list-item>
            
            
        </v-list>
        <v-bottom-navigation
            absolute
            horizontal
        >
            <v-btn color="primary" @click.prevent="save()" block>
              <h3 class="white--text"> حفظ</h3>
            </v-btn>
        </v-bottom-navigation>
    </v-container>
</template>
<script>
// const fs = require('fs');
import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        storeCode:1,
        isLoading: false,
      }
    },
    computed: {
      ...mapGetters({
        opened: 'ui/inventoryModal',
        stores: 'store/stores',
        storesLoading: 'store/loading',
      })

       
    },
    methods: {
        save(){
            console.log('asd')
            
            /// write to file
            var txtFile = "./test.txt";
            var file = new File(txtFile);
            var str = "My string of text";

            file.open("w"); // open file with write access
            file.writeln("First line of text");
            file.writeln("Second line of text " + str);
            file.write(str);
            file.close();
            
        }
    },
    mounted(){
        console.log(process.env.VUE_APP_DEFAULT_STORE)
    }
  }
</script>