<template>
  <v-row justify="center">
    <v-dialog
      v-model="opened"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="toggle(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click.prevent="$router.push({name:'buy'})"
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
            <v-subheader>املئ البيانات التالية</v-subheader>
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
            <v-list-item>
                <v-text-field label="ادخل كود العميل" :loading="accountsLoading" @keyup.enter="find()" v-model="form.Code" solo></v-text-field>
            </v-list-item>
                <h1 class="text-center">او</h1>
            <v-list-item>
                 
                <v-autocomplete
                    v-model="form.Name"
                    :items="accounts"
                    :loading="accountsLoading"
                    :search-input.sync="search"
                    color="white"
                    item-text="AccountName"
                    item-value="AccountCode"
                    label="اختر العميل"
                    placeholder="ابدا بكتابة اسم العميل"
                    return-object
                    solo
                ></v-autocomplete>
            </v-list-item>
            
        </v-list>
        <v-bottom-navigation
            absolute
            horizontal
        >
            <v-btn color="primary" @click.prevent="$router.push({name:'buy'})" block>
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
            store:1,
            form :{
              Code : null,
              Name : null,
              Type : 2,
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
        opened: 'ui/sellReturnModal',
        stores: 'store/stores',
        storesLoading: 'store/loading',
        accounts: 'account/accounts',
        accountsLoading: 'account/loading',
      })

       
    },
    methods: {
      find(){
        this.form.Code = parseInt(this.form.Code)
        console.log(this.form.Code)
        this.getAccount()
      },
      ...mapMutations({
          toggle: 'ui/sellReturnModal' // map `this.add()` to `this.$store.commit('increment')`
      }),
      getAccount(){
        this.$store.dispatch('account/get' , this.form)
      }
    },

    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.accountsLoading) return

        this.getAccount()
      },
    },


  }
</script>