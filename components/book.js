import { h } from "../vue.esm-browser.js";
import Page from "./page.js";
import Styl from "../utils/styl.js";

const style = ({ columns, pageViewHeight }) => `
@media screen {
  .book {
    display: grid;
    grid-template-columns: ${[...Array(columns).keys()]
      .map(() => "1fr")
      .join(" ")};
    grid-auto-rows: ${pageViewHeight}
  }
}
`;

export default {
  props: {
    pageViewHeight: { type: String, default: "100vh" },
    columns: { type: Number, default: 1 }
  },
  setup(props, { slots }) {
    return () => {
      const test = ([name, _]) => /^[0-9].*$/.test(name);
      const pages = Object.entries(slots)
        .filter(test)
        .map(([name, slot]) => h(Page, { class: "page page-" + name }, slot));
      return [h(Styl, { inner: style(props) }), h("div", { class: "book" }, pages)];
    };
  }
};
