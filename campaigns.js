console.log('campaigns module loaded');

export const campaigns = {
  data() {
    return {
      parent: null,
      items: [],
      loader: false,
      date: '',
      date2: '',
      iChart: -1,
      chart: null
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent?.user?.id) {
      console.warn('NO USER ID');
      this.parent.logout();
      return;
    }

    this.setDates();
    this.get();
  },

  methods: {

    fixUrl(url) {
      if (!url) return '';
      return url.replace(/^http:/, 'https:');
    },

    setDates() {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      this.date = first.toISOString().slice(0, 10);
      this.date2 = last.toISOString().slice(0, 10);
    },

    async get() {
      this.loader = true;

      try {
        const res = await axios.post(`${this.parent.url}/site/getCampaigns?auth=${this.parent.user.id}`);
        this.items = Array.isArray(res.data.items)
          ? res.data.items.map(i => ({ ...i, image: this.fixUrl(i.image), link: this.fixUrl(i.link) }))
          : [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loader = false;
      }
    },

    async togglePublished(item, value) {
      const old = item.published;
      item.published = value;

      try {
        await axios.post(`${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`, this.parent.toFormData({ ...item }));
      } catch {
        item.published = old;
      }
    },

    async del(item) {
      if (!(await this.$refs.header.$refs.msg.confirmFun('Confirm', 'Delete campaign?'))) return;

      try {
        await axios.post(`${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`, this.parent.toFormData({ id: item.id }));
        this.$refs.header.$refs.msg.successFun('Deleted');
        this.get();
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
    <div class="flex panel">
      <div class="w20"><h1>Campaigns</h1></div>
      <div class="w60 ac">
        <input type="date" v-model="date" @change="get" /> -
        <input type="date" v-model="date2" @change="get" />
      </div>
      <div class="w20 al">
        <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=true">+ New</a>
      </div>
    </div>

    <div class="table" v-if="items.length">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Title</th>
            <th>Views</th>
            <th>Clicks</th>
            <th>Leads</th>
            <th>Fraud</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <toogle :modelValue="item.published" @update:modelValue="togglePublished(item,$event)" />
            </td>
            <td><router-link :to="'/campaign/'+item.id">{{ item.title }}</router-link></td>
            <td>{{ item.views }}</td>
            <td>{{ item.clicks || 0 }}</td>
            <td>{{ item.leads || 0 }}</td>
            <td>{{ item.fclicks || 0 }}</td>
            <td class="actions"><a href="#" @click.prevent="del(item)"><i class="fas fa-trash-alt"></i></a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No items</div>
  </div>
</div>
`
};
