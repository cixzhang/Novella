<template>
  <div :class="`
    page-content
    novella-bg
    ${this.thumbs ? 'thumbs novella-box' : ''}`">
    <img v-if="isImage()"
      v-on:load="onLoad()"
      :data-hidden="hidden"
      :src="getSource()" />
    <div v-else v-html="getContents()" class="text"></div>
  </div>
</template>

<script>
  import { page } from './props';
  export default {
    props: {
      page,
      src: String,
      thumbs: Boolean,
      className: String,
    },
    data: () => ({ hidden: true }),
    methods: {
      isImage() { return this.page.type === 'image'; },
      getContents() {
        if (this.thumbs) return this.page.short;
        return this.page.contents;
      },
      getSource() {
        if (this.thumbs) return this.page.thumb;
        return this.page.src;
      },
      onLoad() { this.hidden = false; },
    },
  };
</script>

<style scoped>
  .page-content {
    text-align: center;
  }

  .page-content img {
    max-width: 100%;
    width: auto;
    height: auto;
  }
  .page-content img {
    opacity: 1;
    transition: opacity 0.2s ease;
  }
  .page-content img[data-hidden] {
    opacity: 0;
  }

  .page-content .text {
    text-align: left;
  }

  .page-content.thumbs {
    font-size: 0;
  }

  .page-content.thumbs .text {
    font-size: 16px;
    height: 0;
    width: 100%;
    padding-bottom: 100%;
    padding-left: 8px;
    padding-right: 8px;
    overflow: hidden;
    line-height: 1.5;
  }
</style>
