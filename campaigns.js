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
      chart: null,
    };
  },

mounted() {
  this.parent = this.$root;

  if (!this.parent?.user?.id) {
    console.warn('NO USER ID', this.parent.user);
    this.parent.logout();
    return;
  }

  this.setDates();
  this.get();
},


  methods: {

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
    const res = await axios.post(
      `${this.parent.url}/site/getCampaigns?auth=${this.parent.user.id}`
    );

    this.items = Array.isArray(res.data.items)
      ? res.data.items
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
        await axios.post(
          `${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`,
          this.parent.toFormData({ ...item })
        );
      } catch {
        item.published = old;
      }
    },

    async action() {
      if (!this.parent.formData?.title) return;

      try {
        await axios.post(
          `${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`,
          this.parent.toFormData(this.parent.formData)
        );

        this.$refs.new.active = false;
        this.$refs.header.$refs.msg.successFun('Saved successfully');
        this.get();
      } catch (e) {
        console.error(e);
      }
    },

    async del(item) {
      if (
        !(await this.$refs.header.$refs.msg.confirmFun(
          'Confirm',
          'Delete campaign?'
        ))
      )
        return;

      try {
        await axios.post(
          `${this.parent.url}/site/actionCampaign?auth=${this.parent.user.id}`,
          this.parent.toFormData({ id: item.id })
        );

        this.$refs.header.$refs.msg.successFun('Deleted');
        this.get();
      } catch (e) {
        console.error(e);
      }
    },

    openChart(item, index) {
      console.log('OPEN CHART ITEM:', item);
      this.iChart = index;
      this.$refs.chart.active = true;

      if (!item.line) {
    item.line = {
      "dreamview-seo": { views: 174660, clicks: 215 },
      "ineedjob": { views: 173197, clicks: 165 },
      "chiper": { views: 0, clicks: 0 }
    };
  }

      this.$nextTick(() => this.drawChart(item));
    },

  drawChart(item) {
  if (!item?.line) return;

  const labels = [];
  const clicks = [];
  const views = [];
  const ctr = [];

  Object.keys(item.line).forEach(date => {
    const d = item.line[date];
    labels.push(date);
    clicks.push(d.clicks || 0);
    views.push(d.views || 0);
    ctr.push(d.views ? ((d.clicks / d.views) * 100).toFixed(2) : 0);
  });

  if (this.chart) this.chart.destroy();

  this.chart = new Chart(this.$refs.chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Views", data: views, backgroundColor: "rgba(54,162,235,0.6)" },
        { label: "Clicks", data: clicks, backgroundColor: "rgba(255,99,132,0.6)" },
        { 
          label: "CTR (%)", 
          data: ctr, 
          type: "line", 
          borderColor: "rgba(255,206,86,1)", 
          backgroundColor: "rgba(255,206,86,0.2)", 
          yAxisID: "y1",
          tension: 0.3
        },
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      stacked: false,
      plugins: { legend: { display: true } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Count" } },
        y1: { 
          beginAtZero: true, 
          position: "right", 
          title: { display: true, text: "CTR (%)" },
          grid: { drawOnChartArea: false } 
        }
      }
    }
  });
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
        <input type="date" v-model="date" @change="get" />
        -
        <input type="date" v-model="date2" @change="get" />
      </div>

      <div class="w20 al">
        <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=true">
          + New
        </a>
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
          <tr v-for="(item,i) in items" :key="item.id">
            <td>{{ item.id }}</td>

            <td>
              <toogle
                :modelValue="item.published"
                @update:modelValue="togglePublished(item,$event)"
              />
            </td>

            <td>
              <router-link :to="'/campaign/'+item.id">
                {{ item.title }}
              </router-link>
            </td>

            <td>{{ item.views }}</td>
            <td>{{ item.clicks || 0 }}</td>
            <td>{{ item.leads || 0 }}</td>
            <td>{{ item.fclicks || 0 }}</td>

            <td class="actions">
              <a href="#" @click.prevent="openChart(item,i)">
                <i class="fas fa-chart-bar"></i>
              </a>
              <a href="#" @click.prevent="del(item)">
                <i class="fas fa-trash-alt"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No items</div>
  </div>

  <popup ref="new" title="Campaign">
    <form @submit.prevent="action">
      <input type="text" v-model="parent.formData.title" required />
      <button class="btn">Save</button>
    </form>
  </popup>

  <popup ref="chart" fullscreen title="Chart">
    <canvas ref="chartCanvas"></canvas>
  </popup>
</div>
`,
};













