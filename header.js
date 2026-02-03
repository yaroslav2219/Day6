export const header = {
    data: function () {
        return {
            user: {},
            parent:"",
            active:0,
            menu:0
        }
    },
    watch:{
    },
    mounted() {
        this.parent = this.$parent.$parent.$parent;
    },
    methods:{
        toogleActive(){
            if(this.active==1){
                this.active = 0;
            }else{
                this.active = 1;
            }
        }
    },
    template: `
    <header class="header">
      <div class="wrapper">
        <div class="flex">

          <!-- LOGO -->
          <div class="w20 logo">
            <img :src="parent?.url + '/favicon.ico'" />
          </div>

          <!-- MENU -->
          <div class="w70">
            <div id="menu">
              <i class="fas fa-bars" @click="menu = true"></i>

              <!-- ADMIN -->
              <ul v-if="parent?.user?.type === 'admin'" :class="{ active: menu }">
                <li class="al" v-if="menu">
                  <i class="fas fa-times" @click="closeMenu"></i>
                </li>

                <li>
                  <router-link
                    to="/campaigns"
                    :class="{ 'router-link-active': $route.path.includes('campaign') }"
                    @click="closeMenu"
                  >
                    Campaigns
                  </router-link>
                </li>

                <li>
                  <router-link
                    to="/users"
                    :class="{ 'router-link-active': $route.path.includes('users') }"
                    @click="closeMenu"
                  >
                    Users
                  </router-link>
                </li>
              </ul>

              <!-- USER -->
              <ul v-else-if="parent?.user" :class="{ active: menu }">
                <li class="al" v-if="menu">
                  <i class="fas fa-times" @click="closeMenu"></i>
                </li>

                <li><router-link to="/statistics">Statistics</router-link></li>
                <li><router-link to="/ads">Ads</router-link></li>
                <li><router-link to="/sites">Sites</router-link></li>
                <li><router-link to="/payments">Payments</router-link></li>
              </ul>
            </div>
          </div>

          <!-- USER MENU -->
          <div class="w10 al" id="user-top" v-if="parent?.user?.user">
            <div id="user-circle" @click="toogleActive">
              {{ parent.user.user[0] }}
            </div>

            <i class="fas fa-caret-down" @click="toogleActive"></i>

            <div id="user-info" :class="{ active: active }">
              <a href="#" @click.prevent="parent.logout()">
                <i class="fas fa-sign-out-alt"></i>
                {{ parent.user.user }} Log out
              </a>
            </div>
          </div>

        </div>
      </div>

      <msg ref="msg" />
    </header>
    `

    };



