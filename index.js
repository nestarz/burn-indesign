import { createApp, ref, computed } from "./vue.esm-browser.js";
import Book from "./components/book.js";
import Styl from "./components/styl.js";
import Editable from "./components/editable.js";

const app = createApp({});

const index = {
  components: { Editable },
  setup() {
    const bookHtml = ref(`
<book class="book" :columns="2">
  <template #1>
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
  </template>
</book>

<styl :inner="\`
.book {
  height: 100vh;
  grid-gap: 1rem;
}
.page {
  background: hsl(1, 100%, 50%);
  color: white;
  font-size: 1in;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: serif;
}

mark {
  transform: scale(2, 1.5) rotate(180deg);
  writing-mode: vertical-lr;
}
\`"></styl>
    `);
    return {
      bookHtml,
      bookFactory: computed(() => ({
        components: { Book, Styl },
        template: bookHtml.value,
      }))
    };
  }
};
app.mount(index, "#app");
