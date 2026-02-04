export const users = {
  data() {
    return {
      parent: null,
      loader: false,
      items: []
    }
  },

  mounted() {
    this.parent = this.$root

    if (!this.parent?.user?.id) {
      this.parent.logout()
      return
    }

    this.getUsers()
  },

  methods: {
    getUsers() {
      this.loader = true

      axios.post(this.parent.url + '/users/get', {
        token: this.parent.user.token
      }).then(res => {
        this.items = res.data || []
      }).finally(() => {
        this.loader = false
      })
    },

    openUser(user) {
      this.$router.push('/user/' + user.id)
    }
  },

  template: `
  <div class="inside-content">
    <div class="top-bar">
      <h1>Users</h1>
      <button class="btn btn-green" @click="$router.push('/user/new')">
        + New
      </button>
    </div>

    <table class="table" v-if="items.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in items"
            :key="u.id"
            class="row-click"
            @click="openUser(u)">
          <td>{{ u.id }}</td>
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.phone }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="!items.length && !loader">
      No users
    </div>
  </div>
  `
}
