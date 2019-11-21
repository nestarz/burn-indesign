import { computed, ref, h, onMounted, mergeProps } from "../vue.esm-browser.js";
import "./prism.js";
import { cssLoader } from "./styl.js";
import Styl from "./styl.js";
cssLoader("./utils/editable.css");

const style = `
.vue-editable > div {
  position: relative;
  display: flex;
  flex-direction: column;
}

.vue-editable > div > pre:first-child {
  position: absolute;
  pointer-events: none;
  inset: 0;
  margin: 0;
  background: none;
  padding: inherit;
  border: 0;
}

.vue-editable > div > pre:last-child {
  opacity: 1;
  margin: 0;
  height: 100%;
  width: 100%;
  background: none;
  outline: none;
  padding: 0;
  border: 0;
}
`;

export default {
  props: {
    lang: { type: String, default: "js" },
    content: { type: String, default: "your code..." }
  },
  inheritAttrs: false,
  setup(props, { emit, attrs }) {
    const element = ref();
    const content = ref(props.content);
    const highlighted = computed(() =>
      Prism.highlight(props.content, Prism.languages[props.lang])
    );
    onMounted(() => {
      element.value.addEventListener("paste", e => {
        e.preventDefault();
        e.stopPropagation();
        const plaintext = e.clipboardData.getData("text/plain");
        document.execCommand("inserttext", false, plaintext);
      });
      element.value.addEventListener("keydown", e => {
        if (e.keyCode == 9) {
          e.preventDefault();
          document.execCommand("insertHTML", false, "&nbsp;&nbsp;");
        }
      });
    });

    return () => [
      h(Styl, { inner: style, id: "vue-editable" }),
      h(
        "div",
        mergeProps(
          { ref: element, class: "vue-editable" },
          { class: attrs.class }
        ),
        h("div", { "onUpdate:content": attrs["onUpdate:content"] }, [
          h("pre", { innerHTML: highlighted.value }),
          h(
            "pre",
            {
              ref: "element",
              contenteditable: true,
              onInput: event => emit("update:content", event.target.innerText)
            },
            content.value
          )
        ])
      )
    ];
  }
};
