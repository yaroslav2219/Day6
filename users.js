console.log('users module loaded');

export const users = {
  data() {
    return {
      parent: null,
      loader: false,
      items: [],

      form: {
        name: '',
        email: '',
        phone: '',
        active: 1
      }
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent?.user?.id) {
      console.warn('NO USER ID');
      this.parent.logout();
      return;
    }

    this.getUsers();
  },

  methods: {

    fixUrl(url) {
      if (!url) return '';
      return url.replace(/^http:/, 'https:');
    },

    async getUsers() {
      this.loader = true;

      try {
        const res = await axios.post(
          `${this.parent.url}/site/getUsers?auth=${this.parent.user.id}`
        );

        this.items = Array.isArray(res.data.items)
          ? res.data.items.map(i => ({
              ...i,
              image: this.fixUrl(i.image),
              link: this.fixUrl(i.link)
            }))
          : [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loader = false;
      }
    },

    goUser(id) {
      this.$router.push({ path: `/user/${id}` });
    },

    async toggleActive(user, value) {
      const old = user.active;
      user.active = value;

      try {
        await axios.post(
          `${this.parent.url}/site/actionUser?auth=${this.parent.user.id}`,
          this.parent.toFormData({ id: user.id, active: value })
        );
      } catch (e) {
        console.error(e);
        user.active = old;
      }
    },

    openNew() {
      this.form = { name: '', email: '', phone: '', active: 1 };
      this.$refs.new.active = true;
    },

    async saveUser() {
      if (!this.form.name || !this.form.email) return;

      try {
        await axios.post(
          `${this.parent.url}/site/actionUser?auth=${this.parent.user.id}`,
          this.parent.toFormData(this.form)
        );

        this.$refs.new.active = false;
        this.$refs.header.$refs.msg.successFun('User created');
        this.getUsers();
      } catch (e) {
        console.error(e);
      }
    }
  },

  template: `
<div class="inside-content">
  <Header ref="header" />

  <div v-if="loader" id="spinner"></div>

  <div class="wrapper">
    <div class="panel">
      <div class="w70"><h1>Users</h1></div>
      <div class="w30 al">
        <a href="#" class="btnS" @click.prevent="openNew">+ New</a>
      </div>
    </div>

    <div class="table" v-if="items.length">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Phone</th>
            <th>Email</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="row-click" @click="goUser(item.id)">
            <td>{{ item.id }}</td>
            <td class="actions" @click.stop>
              <toogle :modelValue="item.active" @update:modelValue="toggleActive(item,$event)" />
            </td>
            <td>{{ item.phone }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No users</div>

    <popup ref="new" title="New user">
      <form @submit.prevent="saveUser">
        <div class="row"><label>Name</label><input type="text" v-model="form.name" required /></div>
        <div class="row"><label>Email</label><input type="email" v-model="form.email" required /></div>
        <div class="row"><label>Phone</label><input type="text" v-model="form.phone" /></div>
        <button class="btn">Save</button>
      </form>
    </popup>
  </div>
</div>
`
};
