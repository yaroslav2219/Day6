import { router } from "./router.js";
import { msg } from "./msg.js";
import { popup } from "./popup.js";
import { header } from "./header.js";
import { toogle } from "./toogle.js";
import { img } from "./img.js";

document.addEventListener('DOMContentLoaded', function(){

  const WORKER_URL = 'https://twilight-night-3140.kya-pk22-6-3.workers.dev'; // <-- твій Worker

  const appConfig = {
    data() {
      return {
        url: WORKER_URL,
        user: { id: null, name:"", phone:"", email:"", date:"", auth:"", type:"" },
        title: "",
        formData: {},
      }
    },

    watch: {
      $route() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      // 🔹 Конвертуємо http -> https
      fixUrl(url) {
        if (!url) return '';
        return url.replace(/^http:/, 'https:');
      },

      // 🔹 Ініціалізація користувача
      initUser() {
        const stored = window.localStorage.getItem('user');
        if(stored){
          this.user = JSON.parse(stored);
          if(!this.user.id && this.user?.auth?.data){
            this.user.id = this.user.auth.data;
            window.localStorage.setItem('user', JSON.stringify(this.user));
          }
        }
      },

      // 🔹 Основна ініціалізація сторінки
      init() {
        this.initUser();

        router.isReady().then(() => {
          if(!this.user?.id){
            this.page('/');
            return;
          }

          const pathSegment = this.$route.path.split('/')[1] || '';

          // Роутинг для admin / user
          if(pathSegment === '' && this.user.type === 'admin'){
            this.page('/campaigns');
          }
          else if(['/campaigns','/campaign','/users','/user'].includes('/'+pathSegment) && this.user.type !== 'admin'){
            this.page('/statistics');
          }
          else if(['/statistics','/payments','/sites'].includes('/'+pathSegment) && this.user.type === 'admin'){
            this.page('/campaigns');
          }
          else {
            this.updateTitle();
          }
        });
      },

      // 🔹 Вихід з системи
      logout() {
        this.user = { id:null, name:"", phone:"", email:"", date:"", auth:"", type:"" };
        window.localStorage.removeItem('user');
        this.page('/');
      },

      scrollTop(){
        setTimeout(() => window.scroll({ top: 0, behavior: 'smooth' }), 50);
      },

      scrollButton(){
        setTimeout(() => window.scroll({ top: 1000, behavior: 'smooth' }), 50);
      },

      // 🔹 Перехід на сторінку
      page(path=""){
        this.$router.replace(path).then(() => {
          this.updateTitle();
        });
      },

      updateTitle() {
        this.title = this.$route.name || '';
        document.title = this.title;
      },

      // 🔹 Конвертуємо об'єкт у FormData для axios
      toFormData(obj){
        const fd = new FormData();
        for(const x in obj){
          if(typeof obj[x] === 'object' && x !== 'img' && x !== 'copy'){
            for(const y in obj[x]){
              if(typeof obj[x][y] === 'object'){
                for(const z in obj[x][y]){
                  fd.append(`${x}[${y}][${z}]`, obj[x][y][z]);
                }
              } else {
                fd.append(`${x}[${y}]`, obj[x][y]);
              }
            }
          } else if(x !== 'copy'){
            fd.append(x, obj[x]);
          }
        }
        return fd;
      }
    }
  };

  const app = Vue.createApp(appConfig)
    .component('img', img)
    .component('toogle', toogle)
    .component('Header', header)
    .component('popup', popup)
    .component('msg', msg);

  app.use(router).mount('#content');
});
