import { createApp, ref, computed, watch } from "./vue.esm-browser.js";
import Book from "./components/book.js";
import Styl from "./utils/styl.js";
import Editable from "./utils/editable.js";

const app = createApp({});

const index = {
  components: { Editable },
  setup() {
    const config = ref(localStorage.getItem('config') || ':columns="1" :margin="0" :height="297" :width="210"');
    const html = ref(localStorage.getItem('html') ||  `<template #1>
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
</template>`);
    const css = ref(localStorage.getItem('css') || `.page {
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
}`);
    const htmlcss = computed(() => {
      return `<book class="book" ${config.value}>
${html.value}
</book>

<styl inner="${css.value}"></styl>`;
    });
    watch(htmlcss, () => {
      localStorage.setItem("html", html.value);
      localStorage.setItem("css", css.value);
      localStorage.setItem("config", config.value);
    });
    return {
      print: () => window.print(),
      base64: computed(() => encodeURIComponent(htmlcss.value)),
      html,
      css,
      config,
      wrappers: computed(() => ({
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
      })),
      bookFactory: computed(() => ({
        components: { Book, Styl },
        template: htmlcss.value
      }))
    };
  }
};
app.mount(index, "#app");
