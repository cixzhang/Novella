var Novella = (function (Vue) {
  'use strict';

  
  console.log("Generated by novella at 10/22/2016, 4:52:09 PM.");
  var data = {"title":"Ducks","pages":[{"index":0,"filename":"1-Mallard.png","location":"pages","mtime":"2016-10-22T21:28:22.000Z"},{"index":1,"filename":"2-Blue Billed.png","location":"pages","mtime":"2016-10-22T21:30:51.000Z"},{"index":2,"filename":"3-Peking.png","location":"pages","mtime":"2016-10-22T21:32:46.000Z"},{"index":3,"filename":"4-Mandarin.png","location":"pages","mtime":"2016-10-22T21:33:51.000Z"}]};

  Vue = 'default' in Vue ? Vue['default'] : Vue;

  var image = [".png",".gif",".jpg"];
  var formats = {
  	image: image
  };

  function isImage(filename) {
    var imageTypes = new Set(formats.image);
    var split = filename.split('.');
    var type = '.' + split[split.length - 1];
    return imageTypes.has(type);
  }

  var page = {
    index: Number,
    filename: String,
    location: String,
    mtime: Date,
  };

  var pages = Array;

  var Page = { template: "<div class=\"page\"><div><img v-if=\"isImage()\" :src=\"getSource()\"></div><span>{{ new Date(page.mtime).toLocaleString() }}</span></div>",
    props: { page },
    methods: {
      isImage() { return isImage(this.page.filename); },
      getSource() {
        return `${this.page.location}/${this.page.filename}`;
      },
    },
  };

  var PageList = { template: "<ul class=\"page-list\"><li v-for=\"n in Math.min(length, 10)\"><a :href=\"getRoute(n)\" :data-index=\"n\"><img v-if=\"isImage(n)\" :src=\"getSource(n)\"> </a><span>{{ n }}</span></li></ul>",
    props: {
      pages,
      route: String,
    },
    computed: {
      length() { return this.pages.length; },
    },
    methods: {
      isImage(n) {
        var page$$1 = this.pages[n-1];
        return isImage(page$$1.filename);
      },
      handleClick(e) {
        this.clickPage(e.currentTarget.dataset.index);
      },
      getSource(n) {
        var page$$1 = this.pages[n-1];
        return `${page$$1.location}/${page$$1.filename}`;
      },
      getRoute(pageNum) {
        if (!this.route) return null;
        return `${this.route}/${pageNum}`;
      },
    },
  };

  var App = { template: "<div class=\"app\"><page-list :pages=\"pages\" :route=\"pageRoute\"></page-list><page :page=\"pages[selectedPage - 1]\"></page></div>",
    props: {
      pages,
      pageRoute: String,
      selectedPage: {
        type: Number,
        default: 1,
      },
    },
    components: {
      Page,
      PageList,
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

  var store = {
    title: data.title,
    pages: data.pages,
    pageRoute: '#/page',
    selectedPage: 1,
  };

  Vue.component('app', App);
  Vue.component('page', Page);
  Vue.component('page-list', PageList);

  Router.config({ mode: 'hash' });
  Router.add(/page\/(\d*)/, (page) => {
    store.selectedPage = Number(page);
  })
  .check(window.location.href)
  .listen();

  var app = new Vue({
    el: '#container',
    data: store,
  });

  return app;

}(Vue));