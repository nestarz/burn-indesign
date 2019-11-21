import { h } from "../vue.esm-browser.js";
import { Remarkable } from "./remarkable.js";

const remarkable = new Remarkable();

export default {
  props: ["inner"],
  setup(props) {
    return () => h('div', { innerHTML: remarkable.render(props.inner) });
  }
};
