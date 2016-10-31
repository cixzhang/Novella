var Novella = (function (Vue) {
  'use strict';

  
  console.log("Generated by novella at 10/30/2016, 11:07:29 PM.");
  var data = {"title":"Ducks","pages":[{"type":"markdown","contents":"<h2>Ducks</h2>\n\n<p>Bunch of ducks.</p>","index":0,"name":"0-Intro","mtime":"2016-10-30T06:09:56.000Z","src":"pages/0-Intro.md"},{"type":"image","width":450,"height":450,"thumb":"thumbs/1-Mallard.png","index":1,"name":"1-Mallard","mtime":"2016-10-22T21:28:22.000Z","src":"pages/1-Mallard.png"},{"type":"image","width":450,"height":450,"thumb":"thumbs/2-Blue Billed.png","index":2,"name":"2-Blue Billed","mtime":"2016-10-22T21:30:51.000Z","src":"pages/2-Blue Billed.png"},{"type":"image","width":450,"height":450,"thumb":"thumbs/3-Peking.png","index":3,"name":"3-Peking","mtime":"2016-10-22T21:32:46.000Z","src":"pages/3-Peking.png"},{"type":"image","width":450,"height":450,"thumb":"thumbs/4-Mandarin.png","index":4,"name":"4-Mandarin","mtime":"2016-10-22T21:33:51.000Z","src":"pages/4-Mandarin.png"}]};

  Vue = 'default' in Vue ? Vue['default'] : Vue;

  var page = {
    index: Number,
    name: String,
    mtime: Date,
    type: String,
    src: String,

    // Images
    thumb: String,
    width: Number,
    height: Number,

    // Markdown
    contents: String,
  };

  var pages = Array;

  var store$1 = {
    title: String,
    pages,
    pageroute: String,
    pagenum: Number,
    sidebar: Boolean,
    controls: Object,
  };

  var PageContent = { template: "<div :class=\"`page-content ${this.thumbs ? 'thumbs' : ''}`\"><img v-if=\"isImage()\" v-on:load=\"onLoad()\" :data-hidden=\"hidden\" :src=\"getSource()\"><div v-else v-html=\"getContents()\" class=\"text\"></div></div>",
    props: {
      page,
      src: String,
      thumbs: Boolean,
    },
    data: () => ({ hidden: true }),
    methods: {
      isImage() { return this.page.type === 'image'; },
      getContents() {
        if (this.thumbs) return '...';
        return this.page.contents;
      },
      getSource() {
        return this.page.src;
      },
      onLoad() { this.hidden = false; },
    },
  };

  var PageList = { template: "<ul class=\"page-list\"><li v-for=\"n in visiblePages\" :data-highlight=\"isSelected(n)\" :key=\"getKey(n)\" :style=\"{ top: getPosition(n) + 'px' }\"><a :href=\"getRoute(n)\"><page-content :page=\"getPage(n)\" :style=\"contentStyle\" :thumbs=\"true\"></page-content><div class=\"pagenum\">{{ n }}</div></a></li></ul>",
    props: {
      store: store$1,
      positions: Array,
      visiblePages: Array,
      contentStyle: Object,
    },
    computed: {
      length() { return this.store.pages.length; },
    },
    components: { PageContent },
    methods: {
      isSelected(n) {
        return n === this.store.pagenum;
      },
      handleClick(e) {
        this.clickPage(e.currentTarget.dataset.index);
      },
      getPage(n) {
        return this.store.pages[n-1];
      },
      getKey(n) {
        var page$$1 = this.getPage(n);
        return page$$1.index;
      },
      getRoute(n) {
        var route = this.store.pageroute;
        if (!route) return null;
        return `${route}/${n}`;
      },
      getPosition(n) {
        return this.positions[n-1];
      },
    },
  };

  function restrict(value, min, max) {
    var num = Number(value);
    num = Math.min(num, max);
    num = Math.max(num, min);
    return num;
  }



  function scrollToRange(parent, [top, bottom]) {
    var parentRect = parent.getBoundingClientRect();
    if (bottom > parentRect.height + parent.scrollTop) {
      parent.scrollTop = bottom - parentRect.height;
    }

    if (top < parent.scrollTop) {
      parent.scrollTop = top;
    }
  }

  var Sidebar = { template: "<div class=\"sidebar\" v-on:scroll=\"updateVisiblePages()\" :style=\"{ width: width + 'px', padding: padding + 'px' }\"><slot></slot><page-list :store=\"store\" :visible-pages=\"visiblePages\" :positions=\"positions\" :content-style=\"getListContentStyle()\" :style=\"getListStyle()\" ref=\"pagelist\"></page-list></div>",
    props: { store: store$1 },
    computed: {
      positions() {
        var total = 0;
        var positions = this.store.pages.map((page$$1, n) => {
          var top = total;
          total += this.computeHeight(n+1);
          return top;
        });
        positions.push(total);
        return positions;
      },
    },
    data: () => ({
      width: 200,
      maxContentHeight: 200,
      padding: 16,
      visiblePages: [],
    }),
    components: {
      PageList,
    },
    methods: {
      computeHeight(n) {
        var WIDTH = this.width;
        var PAD = this.padding;
        var MAX_CONTENT_HEIGHT = this.maxContentHeight;
        var CONTENT_WIDTH = WIDTH - PAD * 2;

        var page$$1 = this.store.pages[n-1];
        var ratio = page$$1.type === 'image' ? page$$1.height / page$$1.width : 1;

        var imageHeight = Math.min(ratio * CONTENT_WIDTH, MAX_CONTENT_HEIGHT);

        return imageHeight + PAD * 3;
      },
      scrollToPage(n) {
        var index = n-1;
        var scrollTop = this.$el.scrollTop;
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var pagetop = this.positions[index];
        var pagebot = this.positions[index + 1];
        scrollToRange(this.$el, [scrollTop + pagetop + pagelistTop, scrollTop + pagebot + pagelistTop]);
      },
      updateVisiblePages() {
        var pagelist = this.$refs.pagelist;
        var pagelistTop = pagelist.$el.getBoundingClientRect().top;
        var height = this.$el.getBoundingClientRect().height;

        var top = Math.max(-pagelistTop, 0);
        var bottom = Math.min(height - pagelistTop, this.getTotalHeight());

        var visiblePages = [];
        this.store.pages.forEach((page$$1, index) => {
          var position = this.positions[index];
          var next = this.positions[index + 1];
          if (next > top && position < bottom) {
            visiblePages.push(index+1);
          }
        });
        this.visiblePages = visiblePages;
      },
      getTotalHeight() {
        return this.positions[this.positions.length - 1];
      },
      getListStyle() {
        return { height: this.getTotalHeight() + 'px' };
      },
      getListContentStyle() {
        return { 'max-height': this.maxContentHeight + 'px' };
      },
    },
    mounted: function mounted() {
      this.boundUpdateVisiblePages = () => this.updateVisiblePages();
      this.scrollToPage(this.store.pagenum);
      this.updateVisiblePages();
      window.addEventListener('resize', this.boundUpdateVisiblePages);
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('resize', this.boundUpdateVisiblePages);
    },
    watch: {
      store: {
        handler: function store$1() { this.scrollToPage(this.store.pagenum); },
        deep: true,
      },
    },
  };

  var Page = { template: "<div class=\"page\"><div><page-content :page=\"page\" :thumbs=\"false\"></page-content></div><span>{{ new Date(page.mtime).toLocaleString() }}</span></div>",
    props: { page },
    components: { PageContent },
  };

  var Shortcuts = { template: "<div class=\"shortcuts\"><div class=\"shortcut\" v-for=\"shortcut in getShortcuts()\"><span>{{ shortcut }}</span><div class=\"shortcut-key\" v-for=\"key in getKeys(shortcut)\"><span>{{ key }}</span></div></div></div>",
    props: { controls: store$1.controls },
    methods: {
      getShortcuts() {
        var shortcuts = new Set(Object.values(this.controls));
        return Array.from(shortcuts);
      },
      getKeys(event) {
        var controlKeys = Object.keys(this.controls);
        return controlKeys.filter(key => this.controls[key] === event);
      },
    },
  };

  var PageControl = { template: "<div class=\"page-control\"><a class=\"prev\" :href=\"getRoute(store.pagenum - 1)\" :disabled=\"!canPrev()\"><span>prev</span> </a><a class=\"next\" :href=\"getRoute(store.pagenum + 1)\" :disabled=\"!canNext()\"><span>next</span></a><shortcuts :controls=\"store.controls\"></shortcuts></div>",
    props: { store: store$1 },
    components: {
      Shortcuts,
    },
    methods: {
      canPrev() { return this.store.pagenum > 1; },
      canNext() { return this.store.pagenum < this.store.pages.length; },
      getRoute(n) {
        var route = this.store.pageroute;
        if (!route) return null;
        return `${route}/${n}`;
      },
    },
  };

  var Gallery = { template: "<div class=\"gallery\"><button class=\"sidebar-toggle\" v-on:click=\"toggleSidebar()\">{{ store.showsidebar ? '« hide pages' : '» show pages' }}</button><header><span>{{ store.title }}</span> <span>{{ getPage(store.pagenum).name }}</span></header><article><page :page=\"getPage(store.pagenum)\"></page></article><page-control :store=\"store\"></page-control></div>",
    props: { store: store$1 },
    components: {
      Page,
      PageControl,
    },
    methods: {
      getPage(n) {
        return this.store.pages[n - 1];
      },
      toggleSidebar() {
        var event = new CustomEvent('toggle:sidebar');
        document.dispatchEvent(event);
      },
    },
  };

  var App = { template: "<div class=\"app\"><transition name=\"slide\" v-on:after-enter=\"$refs.sidebar.scrollToPage(store.pagenum)\"><sidebar v-if=\"store.showsidebar\" :store=\"store\" ref=\"sidebar\"></sidebar></transition><gallery :store=\"store\"></gallery></div>",
    props: { store: store$1 },
    components: {
      Gallery,
      Sidebar,
    },
  };

  // from: http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

  var Router = {
      routes: [],
      mode: null,
      root: '/',
      config: function(options) {
          this.mode = options && options.mode && options.mode == 'history'
                      && !!(history.pushState) ? 'history' : 'hash';
          this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
          return this;
      },
      getFragment: function() {
          var fragment = '';
          if(this.mode === 'history') {
              fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
              fragment = fragment.replace(/\?(.*)$/, '');
              fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
          } else {
              var match = window.location.href.match(/#(.*)$/);
              fragment = match ? match[1] : '';
          }
          return this.clearSlashes(fragment);
      },
      clearSlashes: function(path) {
          return path.toString().replace(/\/$/, '').replace(/^\//, '');
      },
      add: function(re, handler) {
          if(typeof re == 'function') {
              handler = re;
              re = '';
          }
          this.routes.push({ re: re, handler: handler});
          return this;
      },
      remove: function(param) {
          for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
              if(r.handler === param || r.re.toString() === param.toString()) {
                  this.routes.splice(i, 1);
                  return this;
              }
          }
          return this;
      },
      flush: function() {
          this.routes = [];
          this.mode = null;
          this.root = '/';
          return this;
      },
      check: function(f) {
          var fragment = f || this.getFragment();
          for(var i=0; i<this.routes.length; i++) {
              var match = fragment.match(this.routes[i].re);
              if(match) {
                  match.shift();
                  this.routes[i].handler.apply({}, match);
                  return this;
              }
          }
          return this;
      },
      listen: function() {
          var self = this;
          var current = self.getFragment();
          var fn = function() {
              if(current !== self.getFragment()) {
                  current = self.getFragment();
                  self.check(current);
              }
          };
          clearInterval(this.interval);
          this.interval = setInterval(fn, 50);
          return this;
      },
      navigate: function(path) {
          path = path ? path : '';
          if(this.mode === 'history') {
              history.pushState(null, null, this.root + this.clearSlashes(path));
          } else {
              window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
          }
          return this;
      },
  };

  /* globals data */

  var total = data.pages.length;
  var local = window.localStorage;

  var restrictPage = (n) => restrict(n, 1, total);

  var controls = {
    'q': 'page:prev',
    'w': 'page:next',
    '[': 'page:prev',
    ']': 'page:next',
  };

  var store = {
    title: data.title,
    pages: data.pages,
    pageroute: '#/page',
    pagenum: restrictPage(local.getItem('pagenum')),
    showsidebar: true,
    controls,
  };

  Router.config({ mode: 'hash' });
  Router.add(/page\/([\d\w]*)/, (pagenum) => {
    if (pagenum === 'last') pagenum = total;
    pagenum = restrictPage(pagenum);
    store.pagenum = pagenum;
    local.setItem('pagenum', pagenum);
  })
  .check(window.location.href)
  .listen();

  document.addEventListener('keypress', (e) => {
    if (e.key in controls) {
      var event = new CustomEvent(controls[e.key]);
      document.dispatchEvent(event);
    }
  });

  document.addEventListener('page:prev', () => {
    var pagenum = restrictPage(store.pagenum - 1);
    Router.navigate(`${store.pageroute}/${pagenum}`);
  });

  document.addEventListener('page:next', () => {
    var pagenum = restrictPage(store.pagenum + 1);
    Router.navigate(`${store.pageroute}/${pagenum}`);
  });

  document.addEventListener('toggle:sidebar', () => {
    store.showsidebar = !store.showsidebar;
  });

  Vue.component('app', App);
  var app = new Vue({
    el: '#container',
    data: { store },
  });

  return app;

}(Vue));
