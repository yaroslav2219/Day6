console.log('user module loaded');

export const user = {
  data() {
    return {
      parent: null,
      loader: false,

      userId: null,
      userName: '',

      items: [] 
    };
  },

  mounted() {
    this.parent = this.$root;

    if (!this.parent?.user?.id) {
      console.warn('NO AUTH USER');
      this.parent.logout();
      return;
    }

    this.userId = this.$route.params.id;

    if (!this.userId) {
      console.warn('NO USER ID IN ROUTE');
      return;
    }

    this.getUser();
    this.getStatistic();
  },

  methods: {

    // 🔹 Конвертуємо посилання в https
    fixUrl(url) {
      if (!url) return '';
      return url.replace(/^http:/, 'https:');
    },

    // 🔹 Завантаження даних користувача
    async getUser() {
      try {
        const res = await axios.post(
          `${this.parent.url}/site/getUser?auth=${this.parent.user.id}`,
          this.parent.toFormData({ id: this.userId })
        );

        this.userName = res.data?.item?.name || 'User';
      } catch (e) {
        console.error(e);
      }
    },

    // 🔹 Завантаження статистики
    async getStatistic() {
      this.loader = true;

      try {
        const res = await axios.post(
          `${this.parent.url}/site/getUserStatistic?auth=${this.parent.user.id}`,
          this.parent.toFormData({ user_id: this.userId })
        );

        this.items = Array.isArray(res.data.items)
          ? res.data.items.map(item => ({
              ...item,
              image: this.fixUrl(item.image),
              link: this.fixUrl(item.link)
            }))
          : [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loader = false;
      }
    },

    // 🔹 Активність кампанії
    async toggleCampaign(item, value) {
      const old = item.active;
      item.active = value;

      try {
        await axios.post(
          `${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`,
          this.parent.toFormData({ id: item.id, active: value })
        );
      } catch (e) {
        console.error(e);
        item.active = old;
      }
    }
  },

  template: `
<div class="inside-content">
  <Header />

  <div v-if="loader" id="spinner"></div>

  <div class="wrapper">

    <div class="panel">
      <h1>{{ userName }}</h1>
    </div>

    <h2 style="margin:20px 0">Statistic</h2>

    <div class="table" v-if="items.length">
      <table>
        <thead>
          <tr>
            <th>Fraud</th>
            <th>Leads</th>
            <th>Clicks</th>
            <th>Views</th>
            <th>Link</th>
            <th>Size</th>
            <th>Campaign</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.fclicks || 0 }}</td>
            <td>{{ item.leads || 0 }}</td>
            <td>{{ item.clicks || 0 }}</td>
            <td>{{ item.views || 0 }}</td>

            <td>
              <a v-if="item.link" :href="item.link" target="_blank">
                {{ item.link }}
              </a>
            </td>

            <td>{{ item.size }}</td>
            <td>{{ item.campaign }}</td>

            <td>
              <img
                v-if="item.image"
                :src="item.image"
                style="height:32px;border-radius:4px"
              />
            </td>

            <td class="actions">
              <toogle
                :modelValue="item.active"
                @update:modelValue="toggleCampaign(item, $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No statistic</div>

  </div>
</div>
`
};
