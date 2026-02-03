export const toogle = {
    props: {
        modelValue: {
            type: Boolean,
            required: true
        }
    },

    emits: ['update:modelValue'],

    methods: {
        change(e) {
            this.$emit('update:modelValue', e.target.checked);
        }
    },

    template: `
    <label class="switch">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="change"
        >
        <span class="slider round"></span>
    </label>
    `
};
