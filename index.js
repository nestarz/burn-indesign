import { createApp, ref, computed, watch } from "./vue.esm-browser.js";
import Book from "./components/book.js";
import Styl from "./utils/styl.js";
import Editable from "./utils/editable.js";
import Markdown from "./utils/markdown.js";

const app = createApp({});

const DEFAULT_BOOK = {
  config: ':columns="1" :margin="0" :height="297" :width="210"',
  html: `<template #1>
  <mark>Burn Adobe</mark>
  <mark>Indedign Edition</mark>
</template>
<template #2>
  <mark>Create your own tool</mark>
</template>
<template #3>
  <mark>Save your peaz</mark>
</template>
<template #4>
  <mark>Fork it</mark>
</template>`,
  css: `.page {
    color: white;
    font-size: .3in;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: serif;
    background: black;
  }
  
  .page-1,
  .page-3 {
    background: white;
  }
  
  mark {
    transform: scale(3.5, 4) rotate(200deg);
    writing-mode: vertical-lr;
    margin: 4mm;
  }`,
  merge: (config, html, css) => `<book class="book" ${config}>
  ${html}
  </book>
  
  <styl inner="${css}"></styl>`
};

const WRAPPERS = {
  html: {
    top: {
      open: Prism.highlight(
        `<book class="book">`,
        Prism.languages["html"]
      ).replace('<span class="token punctuation">></span>', ""),
      close: `<span class="token punctuation">></span>`
    },
    bottom: Prism.highlight(`</book>`, Prism.languages["html"])
  },
  css: {
    top: Prism.highlight(`<style>`, Prism.languages["html"]),
    bottom: Prism.highlight(`</style>`, Prism.languages["html"])
  }
};

const index = {
  components: { Editable },
  setup() {
    const config = ref(localStorage.getItem("config") || DEFAULT_BOOK.config);
    const html = ref(localStorage.getItem("html") || DEFAULT_BOOK.html);
    const css = ref(localStorage.getItem("css") || DEFAULT_BOOK.css);
    const htmlcss = computed(() =>
      DEFAULT_BOOK.merge(config.value, html.value, css.value)
    );

    watch(htmlcss, () => {
      localStorage.setItem("html", html.value);
      localStorage.setItem("css", css.value);
      localStorage.setItem("config", config.value);
    });

    return {
      html,
      css,
      config,
      bookFactory: computed(() => ({
        components: { Book, Styl, Markdown },
        template: htmlcss.value
      })),
      wrappers: WRAPPERS,
      print: window.print,
      base64: computed(() => encodeURIComponent(htmlcss.value))
    };
  }
};

app.mount(index, "#app");
