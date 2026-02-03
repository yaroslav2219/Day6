export const popup = {
  props: {
    title: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      active: false
    }
  },

  methods: {
    open() {
      this.active = true
      document.body.style.overflow = 'hidden'
    },

    close() {
      this.active = false
      document.body.style.overflow = ''
    },

    confirm() {
      this.$emit('confirm')
      this.close()
    }
  },

  template: `
    <template v-if="active">
      <!-- overlay -->
      <div class="popup-back" @click="close"></div>

      <!-- popup -->
      <div class="popup">
        <div class="head-popup">
          <div class="head-title">{{ title }}</div>

          <a href="#" class="popup-close" @click.prevent="close">
            <i class="fas fa-times"></i>
          </a>
        </div>

        <div class="popup-inner">
          <slot></slot>
        </div>
      </div>
    </template>
  `
}
