console.log('user module loaded');

export const user = {
  data() {
    return {
      parent: null,
      loader: false,

      userId: null,
      userName: '',
      userEmail: '',
      userPhone: '',

      items: [] // статистика
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
    // 🔹 Локальні дані користувача
    getUser() {
      if (this.userId === '23') {
        this.userName = 'Yan Basok';
        this.userEmail = 'basok@mail.com';
        this.userPhone = '0963346617';
      } else if (this.userId === '25') {
        this.userName = 'Doron Ben David';
        this.userEmail = 'doron@dreamview.co.il';
        this.userPhone = '0506435555';
      } else {
        this.userName = 'User ' + this.userId;
        this.userEmail = '';
        this.userPhone = '';
      }
    },

    // 🔹 Локальна статистика
    getStatistic() {
      if (this.userId === '23') {
        this.items = [
          {
            id: 1,
            fclicks: 0,
            leads: 5,
            clicks: 20,
            views: 200,
            link: 'https://example.com/1',
            size: '300x250',
            campaign: 'Campaign A',
            image: 'https://via.placeholder.com/60x60',
            active: true
          },
          {
            id: 2,
            fclicks: 1,
            leads: 15,
            clicks: 50,
            views: 500,
            link: 'https://example.com/2',
            size: '728x90',
            campaign: 'Campaign B',
            image: 'https://via.placeholder.com/60x60',
            active: false
          }
        ];
      } else if (this.userId === '25') {
        this.items = [
          {
            id: 1,
            fclicks: 2,
            leads: 8,
            clicks: 30,
            views: 300,
            link: 'https://dreamview.co.il/1',
            size: '300x250',
            campaign: 'Campaign X',
            image: 'https://via.placeholder.com/60x60',
            active: true
          },
          {
            id: 2,
            fclicks: 0,
            leads: 10,
            clicks: 40,
            views: 400,
            link: 'https://dreamview.co.il/2',
            size: '728x90',
            campaign: 'Campaign Y',
            image: 'https://via.placeholder.com/60x60',
            active: true
          }
        ];
      } else {
        this.items = [];
      }
    },

    toggleCampaign(item, value) {
      // просто міняємо локально
      item.active = value;
    }
  },

  template: `
<div class="inside-content">
  <Header />

  <div v-if="loader" id="spinner"></div>

  <div class="wrapper">
    <div class="panel">
      <h1>{{ userName }}</h1>
      <div>Email: {{ userEmail }}</div>
      <div>Phone: {{ userPhone }}</div>
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
            <td>{{ item.fclicks }}</td>
            <td>{{ item.leads }}</td>
            <td>{{ item.clicks }}</td>
            <td>{{ item.views }}</td>

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
