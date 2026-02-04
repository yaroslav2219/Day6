export const campaign = {
  data() {
    return {
      parent: null,
      loader: false,
      items: [],               
      newPopupActive: false,   
      form: {                  
        link: '',
        description: '',
        type: '',
        image: null
      }
    }
  },

  mounted() {
    this.parent = this.$root;

    const user = this.parent && this.parent.user ? this.parent.user : null;
    if (!user || !user.id) {
      if (user && user.auth && user.auth.data) user.id = user.auth.data;
    }
    if (!user || !user.id) {
      console.warn('NO USER ID', user);
      this.parent.logout();
      return;
    }

    this.get(); // завантаження початкових банерів
  },

  methods: {
    // Завантаження банерів (тимчасово статичні)
    get() {
      this.items = [
        {
          id: 1,
          image: 'https://dummyimage.com/300x250/eeeeee/000000&text=300x250',
          type: '300x250',
          link: 'https://dreamview-seo.co-il',
          views: 120,
          clicks: 15,
          leads: 3,
          fclicks: 0
        }
      ];
    },

    openNew() {
      this.form = { link: '', description: '', type: '', image: null };
      this.newPopupActive = true;
    },

    onImageChange(e) {
      this.form.image = e.target.files[0] || null;
    },

    save() {
      if (!this.form.link || !this.form.type || !this.form.image) {
        alert('Заповніть всі обов’язкові поля та завантажте зображення');
        return;
      }

      const newId = this.items.length ? Math.max(...this.items.map(i => i.id)) + 1 : 1;
      const newItem = {
        id: newId,
        link: this.form.link,
        description: this.form.description,
        type: this.form.type,
        views: 0,
        clicks: 0,
        leads: 0,
        fclicks: 0,
        image: URL.createObjectURL(this.form.image) 
      };

      this.items.push(newItem);        
      this.newPopupActive = false;       
      this.form = { link: '', description: '', type: '', image: null }; 
    },

    del(item) {
      if (!confirm('Видалити банер?')) return;
      this.items = this.items.filter(i => i.id !== item.id);
    }
  },

  template: `
  <div class="inside-content">

    <Header />

    <div class="panel flex">
      <h1 class="w50">Campaign</h1>
      <div class="w50 ar">
        <button class="btnS" @click="openNew">
          <i class="fas fa-plus"></i> New
        </button>
      </div>
    </div>

    <div class="table" v-if="items.length">
      <table>
        <thead>
          <tr>
            <th class="id">#</th>
            <th>Image</th>
            <th>Size</th>
            <th>Link</th>
            <th class="id">Views</th>
            <th class="id">Clicks</th>
            <th class="id">Leads</th>
            <th class="id">Fraud</th>
            <th class="actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="id">{{ item.id }}</td>
            <td><img :src="item.image" style="max-height:60px"></td>
            <td>{{ item.type }}</td>
            <td>{{ item.link }}</td>
            <td class="id">{{ item.views }}</td>
            <td class="id">{{ item.clicks }}</td>
            <td class="id">{{ item.leads }}</td>
            <td class="id">{{ item.fclicks }}</td>
            <td class="actions">
              <a href="#" @click.prevent="del(item)">
                <i class="fas fa-trash-alt"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty" v-else>No items</div>

    <!-- Затемнення -->
    <div v-if="newPopupActive" class="popup-back" @click="newPopupActive = false"></div>

    <!-- Попап -->
    <div v-if="newPopupActive" class="popup">
      <div class="head-popup">
        <span class="head-title">New banner</span>
        <a href="#" @click.prevent="newPopupActive = false">&times;</a>
      </div>

      <div class="popup-inner">
        <form @submit.prevent="save" class="inner-form">
          <div class="row">
            <label>Link</label>
            <input type="url" v-model="form.link" required>
          </div>
          <div class="row">
            <label>Description</label>
            <input type="text" v-model="form.description">
          </div>
          <div class="row">
            <label>Size</label>
            <select v-model="form.type" required>
              <option value="">— Select —</option>
              <option value="300x250">300x250</option>
              <option value="728x90">728x90</option>
              <option value="160x600">160x600</option>
            </select>
          </div>
          <div class="row">
            <label>Image</label>
            <input type="file" accept="image/*" @change="onImageChange" required>
          </div>
          <div class="row">
            <button class="btn">Save</button>
          </div>
        </form>
      </div>
    </div>

  </div>
  `
}


