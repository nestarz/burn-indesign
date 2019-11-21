import { ref, onMounted, h, onUnmounted } from "../vue.esm-browser.js";
import Styl from "../utils/styl.js";

const style = ({ landscape, height, width, margin }) => `
@media screen {
  .vue-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vue-page > .wrapper > .content {
    transform-origin: left top;
  }
  
  .vue-page > .wrapper {
    overflow: hidden;
    border: 1px solid grey;
    padding: ${margin}mm;
  }
}

@page {
  size: ${landscape ? width : height}mm ${landscape ? height : width}mm;
  margin: ${margin}mm;
}

@media print {
  .vue-page > .wrapper > .content {
    transform: none !important;
    overflow: hidden;
  }
  .vue-page > .wrapper {
    width: auto !important;
    height: auto !important;
  }
}

.vue-page > .wrapper > .content {
  width: ${landscape ? height : width}mm;
  height: ${landscape ? width : height}mm;
}
`;

export default {
  props: {
    margin: { type: Number, default: 0 },
    width: { type: Number, default: 210 },
    height: { type: Number, default: 297 },
    landscape: { type: Boolean, default: false }
  },
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const grandwrapper = ref();
    const wrapper = ref();
    const page = ref();
    const resize = () => {
      const {
        width: w,
        height: h
      } = grandwrapper.value.getBoundingClientRect();
      page.value.style.transform = `scale(${Math.min(w, h) / 1200})`;
      const { width, height } = page.value.getBoundingClientRect();
      wrapper.value.style.width = width + "px";
      wrapper.value.style.height = height + "px";
    };
    onMounted(() => {
      window.addEventListener("resize", resize);
      resize();
      setTimeout(resize, 1);
    });
    onUnmounted(() => window.removeEventListener("resize", resize));
    return () => [
      h(Styl, { inner: style(props), id: "page" }),
      h(
        "div",
        { ref: grandwrapper, class: "vue-page" },
        h("div", { ref: wrapper, class: "wrapper" }, [
          h(
            "div",
            { ref: page, class: "content " + attrs.class || "" },
            slots.default && slots.default()
          )
        ])
      )
    ];
  }
};
