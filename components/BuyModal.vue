<template>
  <v-row justify="center">
    <v-dialog
      v-model="opened"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
         مستند جديد
        </v-btn>
      </template>
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="opened = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click.prevent="save()"
            >
              حفظ
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
        >
            <!-- <v-subheader>املئ البيانات التالية</v-subheader> -->
            <v-list-item>
                <v-select
                    :items="stores"
                    :loading="storesLoading"
                    label="اختر الفرع"
                    item-text="store_name"
                    item-value="store_code"
                    v-model="store"
                    hide-details
                    solo
                    >
                </v-select>
            </v-list-item>
            <div v-if="!transactionForm">
              <v-list-item>
                  <v-text-field label="ادخل كود الحساب" :loading="accountsLoading" @keyup.enter="find()" v-model="form.Code" solo></v-text-field>
              </v-list-item>
                  <h1 class="text-center">او</h1>
              <v-list-item>
                  
                  <v-autocomplete
                      v-model="form.Code"
                      :items="accounts"
                      :loading="accountsLoading"
                      :search-input.sync="search"
                      @change="changed"
                      color="white"
                      item-text="AccountName"
                      item-value="AccountCode"
                      label="اختر الحساب"
                      placeholder="ابدا بكتابة اسم الحساب"
                      return-object
                      solo
                  ></v-autocomplete>
              </v-list-item>
              <v-list-item>
                  <v-text-field label="ادخل رقم الفاتورة" @keyup.enter="save()" ref="invoice" :loading="accountsLoading" v-model="InvoiceNo" solo></v-text-field>
              </v-list-item>
            </div>
            <v-list-item v-else>
                <v-select
                    :items="stores"
                    :loading="storesLoading"
                    label=" اختر الفرع الاخر"
                    item-text="store_name"
                    item-value="store_code"
                    v-model="storeTo"
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
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapGetters , mapMutations } from 'vuex'
  export default {
    data () {
      return {
            store: parseInt(localStorage.getItem('store')),
            storeTo:0,
            InvoiceNo : null,
            accSerial: null,
            opened : false,
            transactionForm : false,
            form :{
              Code : null,
              Name : null,
              Type : parseInt(this.$route.query.type),
            },
            descriptionLimit: 60,
            entries: [],
            isLoading: false,
            model: null,
            search: null,
      }
    },
    computed: {
        fields () {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          return {
            key,
            value: this.model[key] || 'n/a',
          }
        })
      },
      items () {
        return this.entries.map(entry => {
          const Description = entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description

          return Object.assign({}, entry, { Description })
        })
      },
      ...mapGetters({
        // opened: 'ui/buyModal',
        stores: 'store/stores',
        storesLoading: 'store/loading',
        accounts: 'account/accounts',
        accountsLoading: 'account/loading',
      })

       
    },
    methods: {
      changed(val){
        this.form.Code = val.AccountCode
        this.accSerial = val.Serial
      },
      save(){
        this.$router.push({name:'buy' , query: {store : this.store , supplier : this.accSerial , invoice : this.InvoiceNo ,  transaction : this.$route.query.transaction ,type : this.$route.query.type , storeTo : this.storeTo }})
      },
      find(){
        let payload = {
          Name : null,
          Code : parseInt(this.form.Code),
          type : this.form.Type
        }
        this.getAccount(payload).then(res => {
          if(res !== null){
            this.$refs.invoice.focus()
            this.form.Code = parseInt(this.form.Code)
            this.accSerial = res[0].Serial
          }
        })
        
      },
      ...mapMutations({
        toggle: 'ui/buyModal' // map `this.add()` to `this.$store.commit('increment')`
      }),
      getAccount(payload){
        
        return new Promise((resolve) => {
          this.$store.dispatch('account/get' , payload)
          .then(res => {
            resolve(res)
          })

        })
        
      }
    },
    mounted(){
      if(this.$route.query.type == 3){
        this.transactionForm = true
      }
    },

    watch: {
      search () {
        console.log(this.search)
        // Items have already been loaded
        if (this.items.length > 1) return

        // Items have already been requested
        if (this.accountsLoading) return
        let payload = {
          Name : this.search,
          Code : null,
          type : this.form.Type
        }
        // console.log(payload)
        this.getAccount(payload)
      },
    },


  }
</script>