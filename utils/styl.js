import { h, onBeforeUnmount } from "../vue.esm-browser.js";

export const cssLoader = function(url) {
  return new Promise((resolve, reject) => {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.onload = function() {
      resolve();
    };
    link.href = url;

    let headScript = document.querySelector("script");
    headScript.parentNode.insertBefore(link, headScript);
  });
};

const all = {};
const ids = {};

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
    onBeforeUnmount(() => {
      if (props.id) {
        all[props.id] = all[props.id].filter(id => id === me);
        if (all[props.id].length === 1) {
          ids[props.id] = me;
        }
      }
    });
    return () => {
      return !props.id || me === ids[props.id] ? h("style", props.inner) : null;
    };
  }
};
