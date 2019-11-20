import { watch, ref, h, onUnmounted } from "../vue.esm-browser.js";

const all = {};
const ids = {};

export const cssLoader = function(url) {
  return new Promise((resolve, reject) => {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.onload = function() {
      resolve();
      console.log("style has loaded");
    };
    link.href = url;

    let headScript = document.querySelector("script");
    headScript.parentNode.insertBefore(link, headScript);
  });
};

export default {
  name: "styl",
  props: { inner: String, id: String },
  setup(props) {
    const me = Math.random();
    if (props.id) {
      all[props.id] = [...(all[props.id] || []), me];
      if (all[props.id].length === 1) {
        ids[props.id] = me;
      }
    }
    onUnmounted(() => {
      if (props.id) {
        all[props.id] = all[props.id].filter(id => id === me);
      }
    });
    const span = ref();
    watch(
      () => props,
      () => {
        if (span.value) {
          const styl = document.createElement("style");
          const node = document.createTextNode(props.inner);
          styl.append(node);
          span.value.replaceWith(styl);
        }
      }
    );
    return () => {
      return !props.id || me === ids[props.id]
        ? h("span", { ref: span })
        : null;
    };
  }
};
