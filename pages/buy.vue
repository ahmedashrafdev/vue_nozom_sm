<template>
   <div class="buy">
       <v-tabs v-model="tab"
          align-with-title>
            <v-tab v-for="(item,index) in tabs" :key="index">{{item}}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                 <v-list
                three-line
                subheader
                >
                    <v-subheader>املئ البيانات التالية</v-subheader>
                    <v-form :lazy-validation="true" v-model="valid" @submit.prevent="save()" ref="form">
                        <span v-if="notFoundItem" class="text-danger">عفوا لا يوجد صنف بهذا الكود</span>
                        <v-list-item>
                            <v-text-field
                                ref="code"
                                :rules="rules.code"
                                label="الكود"
                                v-model="form.ItmBarCode"
                                autofocus
                                @keyup.enter="findItem"
                                class="code"
                                :messages="item.ItemName"
                                solo
                                >
                                <v-icon
                                    slot="append"
                                    color="primary"
                                    class="pointer"
                                    @click.prevent="findItem"
                                    >
                                    mdi-plus
                                </v-icon>
                            </v-text-field>
                        </v-list-item>
                        <v-list-item>
                            <v-row>
                                <v-col cols="6">
                                    <span v-if="qtyNotInt" class="text-danger">لا يسمح بالكسور</span>
                                    <v-text-field  v-if="item && !item.ByWeight" @keyup.enter="$refs.qty.focus()" :rules="rules.qtyWhole" v-model="qtyWhole" label="الكمية الكلية" ref="qtyWhole" solo></v-text-field>
                                    <v-text-field  v-else @keyup.enter="save()" :rules="rules.qtyWhole" v-model="qtyWhole" label="الكمية الكلية" ref="qtyWhole" solo></v-text-field>
                                </v-col>
                                <v-col cols="6"  v-if="item && !item.ByWeight">
                                    <span v-if="qtyWholeNotInt" class="text-danger">لا يسمح بالكسور</span>
                                    <v-text-field @keyup.enter="save()" :rules="rules.qty" v-model="qty" label="الكمية الجزءية" ref="qty" solo></v-text-field>
                                </v-col>

                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-simple-table v-if="item.POSPP">
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                    <th class="text-left">
                                        السعر الكلي
                                    </th>
                                    <th class="text-left">
                                        السعر الجزئي
                                    </th>
                                    <th class="text-left">
                                        المحتوي
                                    </th>
                                    <th class="text-left">
                                        بالوزن
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                    >
                                        <td>{{item.POSTP}} ج.م</td>
                                        <td>{{item.POSPP}} ج.م</td>
                                        <td>{{item.MinorPerMajor}} قطع</td>
                                        <td v-if="item.ByWeight">نعم</td>
                                        <td v-else>لا</td>
                                    </tr>
                                </tbody>
                                </template>
                            </v-simple-table>
                        </v-list-item>
                        <v-list-item>
                        <v-btn block @click.prevent="save()" color="primary">تاكيد</v-btn>
                        </v-list-item>
                    </v-form>
                </v-list>
            </v-tab-item>
            <v-tab-item>
                 <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-right">
                               الاسم 
                            </th>
                            
                             <th class="text-right">
                                الكمية الكلية
                            </th>
                            <th class="text-right">
                                الكمية الجزئية
                            </th>
                            <th class="text-right">
                               اجرائات
                            </th>
                            </tr>
                        </thead>
                        <tbody v-if="!itemsLoading && products !== null">
                            <tr
                            v-for="p in products" :key="p.serial"
                            >
                                <td>
                                    <div>{{p.ItemName}}</div>
                                    <div class="bg-primary mt-2">كود : {{p.Item_BarCode}}</div>
                                </td>
                                <!-- <td>{{p.Item_BarCode}}</td> -->
                                <td v-if="p.ByWeight">{{p.Qnt}}</td>
                                <td v-else>{{parseInt(p.Qnt / p.MinorPerMajor)}}</td>
                                <td v-if="p.ByWeight">0</td>
                                <td v-else>{{p.Qnt % p.MinorPerMajor}}</td>
                                <td>
                                    <v-flex>
                                        <delete-modal @deleted="getItems" :form="{Serial : p.Serial}"/>
                                    </v-flex>
                                </td>
                            </tr>
                        </tbody>
                        <tbody class="text-center w-full" v-else-if="products == null">
                            لا يوجد اصناف
                        </tbody>

                        <tbody v-else>
                            Loading
                        </tbody>
                        </template>
                    </v-simple-table>
            </v-tab-item>
        </v-tabs-items>
   </div>
</template>

<script>
// import rules from '@/utils/validationMain.js';
import form from '@/utils/formMain.js';
import { mapGetters } from 'vuex';
import DeleteModal from "@/components/DeleteModal.vue"

export default {
    layout:'pages',
    data () {
      return {
        tab: null,
        qty:null,
        qtyWhole:null,
        valid: false,
        notFoundItem: false,
        qtyNotInt: false,
        qtyWholeNotInt: false,
        items:'',
        item:{},
        DocForm:{ 
            "TrSerial" : parseInt(this.$route.query.transaction),
            "StoreCode" : parseInt(this.$route.query.store) 
        },
        rules : {
            code : [
                    v => !!v || 'من فضلك ادخل الكود',
                    v => !isNaN(parseInt(v)) || 'يجب ان يكون الكود عدد',
                    // v => v.length <= 10 || 'Name must be less than 10 characters',
                ],
            qty : [
                    v => !!v || 'من فضلك ادخل الكمية',
                    v => !isNaN(parseInt(v)) || 'يجب ان تكون الكمية عدد',
                ],
            qtyWhole : [
                v => !!v || '  من فضلك ادخل الكمية الكلية',
                v => !isNaN(parseInt(v)) || 'يجب ان تكون الكمية الكلية عدد',
            ], 
         },
        form :  {
            DNo : "",
            TrS : parseInt(this.$route.query.transaction),
            AccS : parseInt(this.$route.query.supplier),
            ItmS : "",
            Qnt : "",
            StCode : parseInt(this.$route.query.store),
            StCode2 : parseInt(this.$route.query.storeTo),
            InvNo : parseInt(this.$route.query.invoice),
            ItmBarCode : "",
            DevNo : "",
        },
        tabs: [
          'ادخل الصنف', 'عرض الاصناف',
        ],
      }
    },
    computed: {
      ...mapGetters({
          products: 'document/items',
          itemsLoading: 'document/loading',
      })
    },
    components: {
        DeleteModal
    },
    methods : {
        findItem(){
            if(this.form.code !== ''){
                const itemPayload = {"BCode" :this.form.ItmBarCode,"StoreCode" : parseInt(this.$route.query.store)}
                this.$store.dispatch('item/get' , itemPayload)
            .then(res => {
                if(res !== null){
                    this.item = res[0] 
                    this.form.ItmS = res[0].Serial
                    this.$refs.qtyWhole.focus()
                    this.notFoundItem = false

                } else {
                    this.notFoundItem = true
                    this.item = {}
                }

            })
            }
            // this.$refs.qtyWhole.focus();
        },
        addParamsToLocation(params) {
            history.pushState(
                {},
                null,
                this.$route.path +
                '?' +
                Object.keys(params)
                    .map(key => {
                    return (
                        encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                    )
                    })
                    .join('&')
            )
        },
        getItems(){
            let docPayload = {
                        DevNo :this.form.DevNo,
                        TrSerial :this.form.TrS,
                        StoreCode :this.form.StCode,
                        DocNo :this.form.DNo,
                    }
            this.$store.dispatch('document/getItems' , docPayload)
        },
        byWeightValidation(){
            if(this.item.ByWeight == false){
                if(parseFloat(this.qty) % 1 !== 0){
                    this.qtyNotInt = true
                } else {
                    this.qtyNotInt = false
                }
                if(parseFloat(this.qtyWhole) % 1 !== 0){
                    this.qtyWholeNotInt = true
                } else {
                    this.qtyWholeNotInt = false
                }
            } else {
                this.qtyNotInt = false
                this.qtyWholeNotInt = false
            }
        },
        save(){
            this.$refs.form.validate()
            if(this.valid){
                this.byWeightValidation()
                if(this.qty == null){
                    this.qty = 0
                }
                if(this.item.ByWeight){
                    this.form.Qnt = parseFloat(this.qtyWhole)
                } else {
                    this.form.Qnt = parseInt(parseInt(this.qtyWhole) * parseInt(this.item.MinorPerMajor) + parseInt(this.qty))

                }
                this.$store.dispatch('item/store' , this.form)
                .then(() => {
                    if(!this.$route.query.document){
                        let query = this.$route.query
                        query.document = this.form.DNo
                        this.addParamsToLocation(query)
                    }
                    this.item = {}
                    this.form.Qnt = null
                    this.qtyWhole = null 
                    this.qty = null
                    this.form.ItmBarCode = null
                    this.$refs.form.reset()
                    this.$refs.code.focus()
                    this.getItems()
                })
                    // this.qtyNotInt = false
                    // this.qtyWholeNotInt = false

                    // const form =  {
                    //     code : '',
                    //     qty : '',
                    //     qtyWhole : '',
                    // }
                    // this.form = form
                    // this.item = {}
                    
                    // this.$refs.code.focus()
                    // this.$refs.form.resetValidation()
                    // console.log('save')
            }
            
            
        },

    },
    created(){
        this.$store.commit('ui/pageTitle' , 'مشتريات')
       
    },
    mounted(){
         if(!this.$route.query.document){
            this.$store.dispatch('document/getNo' , this.DocForm)
            .then(res => {
                this.form.DNo = res
                let query = this.$route.query
                query.document = res
                this.addParamsToLocation(query)
            })
        } else { 
            this.form.DNo = parseInt(this.$route.query.document)
            this.getItems()
        }
    }
}
</script>