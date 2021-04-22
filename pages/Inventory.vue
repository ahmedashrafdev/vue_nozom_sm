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
                        <v-list-item>
                            <v-text-field
                                ref="code"
                                :rules="rules.code"
                                label="الكود"
                                v-model="form.code"
                                autofocus
                                @keyup.enter="findItem"
                                class="code"
                                :messages="item.name"
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
                                    <v-text-field @keyup.enter="$refs.qty.focus()" :rules="rules.qtyWhole" v-model="form.qtyWhole" label="الكمية الكلية" ref="qtyWhole" solo></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field @keyup.enter="save()" :rules="rules.qty" v-model="form.qty" label="الكمية الجزءية" ref="qty" solo></v-text-field>
                                </v-col>

                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-simple-table v-if="item.pospp">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                    >
                                        <td>{{item.pospp}} ج.م</td>
                                        <td>{{item.pospp}} ج.م</td>
                                        <td>{{item.minorPerMajor}} قطع</td>
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
                            <th class="text-left">
                               الاسم 
                            </th>
                            <th class="text-left">
                                باركود 
                            </th>
                            <th class="text-left">
                                الكمية الجزئية
                            </th>
                             <th class="text-left">
                                الكمية الكلية
                            </th>
                            <th class="text-left">
                               اجرائات
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="i in 100" :key="i"
                            >
                                <td>{لحم مفروم بقرى}</td>
                                <td>15987897523321</td>
                                <td>5</td>
                                <td>1</td>
                                <td>
                                    <v-flex>
                                        <v-btn color="primary my-2">تعديل</v-btn>
                                        <v-btn color="danger mb-2">حذف</v-btn>
                                    </v-flex>
                                </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
            </v-tab-item>
        </v-tabs-items>
   </div>
</template>

<script>
import rules from '@/utils/validationMain.js';
import form from '@/utils/formMain.js';
export default {
    layout:'pages',
    data () {
      return {
        tab: null,
        valid: false,
        items:'',
        item:{},
        rules, 
        form ,
        tabs: [
          'ادخل الصنف', 'عرض الاصناف',
        ],
      }
    },
    methods : {
        findItem(){
            if(this.form.code !== ''){
                this.item = {
                    name : 'اوريو',
                    code : 15987897523321,
                    pospp : 150.00,
                    postp : 160.00,
                    minorPerMajor: 6,
                }
                console.log(this.$refs.qtyWhole)
                this.$refs.qtyWhole.focus()
            }
            // this.$refs.qtyWhole.focus();
        },
        save(){
            this.$refs.form.validate()
            if(this.valid){
                const form =  {
                    code : '',
                    qty : '',
                    qtyWhole : '',
                }
                this.form = form
                this.item = {}
                
                this.$refs.code.focus()
                this.$refs.form.resetValidation()
                console.log('save')
            }
            
        }

    },
    created(){
        this.$store.commit('ui/pageTitle' , 'ادوات الجرد')
    }
}
</script>