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
            @click.prevent="toggle(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click.prevent="$router.push({name:'Inventory'})"
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
                    label="اختر الفرع"
                    item-text="store_name"
                    item-value="store_id"
                    v-model="store"
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
            <v-btn color="primary" @click.prevent="$router.push({name:'Inventory'})" block>
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
        supplier:null,
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
        opened: 'ui/inventoryModal',
        stores: 'store/stores',
        storesLoading: 'store/loading',
      })

       
    },
    methods: {
        ...mapMutations({
            toggle: 'ui/inventoryModal' // map `this.add()` to `this.$store.commit('increment')`
        })
    },

    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        fetch('https://api.publicapis.org/entries')
          .then(res => res.json())
          .then(res => {
            const { count, entries } = res
            this.count = count
            this.entries = entries
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    },


  }
</script>