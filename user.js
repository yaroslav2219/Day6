export const user = {
  data() {
    return {
      parent: null,
      loader: false,
      user: null,
      items: [], // таблиця (як у campaign)
      date: '',
      date2: ''
    }
  },

  mounted() {
    this.parent = this.$root

    if (!this.parent?.user?.id) {
      this.parent.logout()
      return
    }

    this.getUser()
  },

  methods: {
    getUser() {
      this.loader = true

      axios.post(this.parent.url + '/users/getOne', {
        id: this.$route.params.id,
        token: this.parent.user.token
      }).then(res => {
        this.user = res.data.user
        this.items = res.data.items || []
      }).finally(() => {
        this.loader = false
      })
    }
  },

  template: `
  <div class="inside-content" v-if="user">
    <div class="user-header">
      <h1>{{ user.name }}</h1>
      <div>Email: {{ user.email }}</div>
      <div>Phone: {{ user.phone }}</div>
    </div>

    <!-- ТУТ таблиця як у campaign.js, але без статистики -->
    <table class="table" v-if="items.length">
      <thead>
        <tr>
          <th>Link</th>
          <th>Size</th>
          <th>Campaign</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in items" :key="i.id">
          <td>{{ i.link }}</td>
          <td>{{ i.size }}</td>
          <td>{{ i.campaign }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
}
