<template>
   <div class="buy">
       
           <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-right">
                                رقم المستند
                                </th>
                                <th class="text-right">
                                    رقم الفرع 
                                </th>
                                <th class="text-right">
                                    اسم الحساب
                                </th>
                                <th class="text-right">
                                   الاجرائات
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="!loading && docs.length > 0">
                            <tr
                            v-for="d in docs" :key="d.DocNo"
                            >
                                <td>{{d.DocNo}}</td>
                                <td>{{d.StoreCode}}</td>
                                <td>{{d.AccountName}}</td>
                                <td>
                                    <v-flex>
                                       <v-btn
                                        color="primary mb-2"
                                        @click.prevent="edit"
                                        >
                                        تعديل
                                        </v-btn>
                                    </v-flex>
                                </td>
                            </tr>
                        </tbody>
                        <tbody class="text-center w-full" v-else-if=" docs.length ==  0">
                            لا يوجد اصناف
                        </tbody>

                        <tbody v-else>
                            Loading
                        </tbody>
                        </template>
                    </v-simple-table>
       
        <buy-modal />
   </div>
</template>

<script>
// import rules from '@/utils/validationMain.js';
import { mapGetters } from 'vuex';

export default {
    layout:'pages',
    data () {
      return {
        docs : []
      }
    },
    computed: {
      ...mapGetters({
          loading: 'document/loading',
      })
    },
    methods:{
        edit(item){
            let query = {
                store:Item.StoreCode,
                supplier: Item.AccountCode,
                invoice: item.InvNo,
                document: item.DocNo
            }
            this.$router.push({name : 'buy' ,  query})
 
        },
        getDocs(){
            this.$store.dispatch('document/get' , {TrSerial : 19})
            .then(res => {
                this.docs = res
            })
        }
    }
}
</script>