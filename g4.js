!(function() {
  "use strict";
  var e = !1;
  if ("undefined" != typeof process && !process.browser) {
    e = !0;
    var t = require("request".trim());
  }
  var s = !1,
    i = !1;
  try {
    var n = new XMLHttpRequest();
    "undefined" != typeof n.withCredentials
      ? (s = !0)
      : "XDomainRequest" in window && ((s = !0), (i = !0));
  } catch (e) {}
  var o = Array.prototype.indexOf,
    a = function(e, t) {
      var s = 0,
        i = e.length;
      if (o && e.indexOf === o) return e.indexOf(t);
      for (; s < i; s++) if (e[s] === t) return s;
      return -1;
    },
    h = function(t) {
      return this && this instanceof h
        ? ("string" == typeof t && (t = { key: t }),
          (this.callback = t.callback),
          (this.wanted = t.wanted || []),
          (this.key = t.key),
          (this.simpleSheet = !!t.simpleSheet),
          (this.parseNumbers = !!t.parseNumbers),
          (this.wait = !!t.wait),
          (this.reverse = !!t.reverse),
          (this.postProcess = t.postProcess),
          (this.debug = !!t.debug),
          (this.query = t.query || ""),
          (this.orderby = t.orderby),
          (this.endpoint = t.endpoint || "https://spreadsheets.google.com"),
          (this.singleton = !!t.singleton),
          (this.simpleUrl = !(!t.simpleUrl && !t.simple_url)),
          (this.callbackContext = t.callbackContext),
          (this.prettyColumnNames =
            "undefined" == typeof t.prettyColumnNames
              ? !t.proxy
              : t.prettyColumnNames),
          "undefined" != typeof t.proxy &&
            ((this.endpoint = t.proxy.replace(/\/$/, "")),
            (this.simpleUrl = !0),
            (this.singleton = !0),
            (s = !1)),
          (this.parameterize = t.parameterize || !1),
          this.singleton &&
            ("undefined" != typeof h.singleton &&
              this.log("WARNING! Tabletop singleton already defined"),
            (h.singleton = this)),
          /key=/.test(this.key) &&
            (this.log(
              "You passed an old Google Docs url as the key! Attempting to parse."
            ),
            (this.key = this.key.match("key=(.*?)(&|#|$)")[1])),
          /pubhtml/.test(this.key) &&
            (this.log(
              "You passed a new Google Spreadsheets url as the key! Attempting to parse."
            ),
            (this.key = this.key.match("d\\/(.*?)\\/pubhtml")[1])),
          /spreadsheets\/d/.test(this.key) &&
            (this.log(
              "You passed the most recent version of Google Spreadsheets url as the key! Attempting to parse."
            ),
            (this.key = this.key.match("d\\/(.*?)/")[1])),
          this.key
            ? (this.log("Initializing with key " + this.key),
              (this.models = {}),
              (this.modelNames = []),
              (this.model_names = this.modelNames),
              (this.baseJsonPath =
                "/feeds/worksheets/" + this.key + "/public/basic?alt="),
              e || s
                ? (this.baseJsonPath += "json")
                : (this.baseJsonPath += "json-in-script"),
              void (this.wait || this.fetch()))
            : void this.log("You need to pass Tabletop a key!"))
        : new h(t);
    };
  (h.callbacks = {}),
    (h.init = function(e) {
      return new h(e);
    }),
    (h.sheets = function() {
      this.log(
        "Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)"
      );
    }),
    (h.prototype = {
      fetch: function(e) {
        "undefined" != typeof e && (this.callback = e),
          this.requestData(this.baseJsonPath, this.loadSheets);
      },
      requestData: function(t, n) {
        if ((this.log("Requesting", t), e)) this.serverSideFetch(t, n);
        else {
          var o = this.endpoint.split("//").shift() || "http";
          !s || (i && o !== location.protocol)
            ? this.injectScript(t, n)
            : this.xhrFetch(t, n);
        }
      },
      xhrFetch: function(e, t) {
        var s = i ? new XDomainRequest() : new XMLHttpRequest();
        s.open("GET", this.endpoint + e);
        var n = this;
        (s.onload = function() {
          var e;
          try {
            e = JSON.parse(s.responseText);
          } catch (e) {
            console.error(e);
          }
          t.call(n, e);
        }),
          s.send();
      },
      injectScript: function(e, t) {
        var s,
          i = document.createElement("script");
        if (this.singleton)
          t === this.loadSheets
            ? (s = "Tabletop.singleton.loadSheets")
            : t === this.loadSheet && (s = "Tabletop.singleton.loadSheet");
        else {
          var n = this;
          (s = "tt" + +new Date() + Math.floor(1e5 * Math.random())),
            (h.callbacks[s] = function() {
              var e = Array.prototype.slice.call(arguments, 0);
              t.apply(n, e), i.parentNode.removeChild(i), delete h.callbacks[s];
            }),
            (s = "Tabletop.callbacks." + s);
        }
        var o = e + "&callback=" + s;
        this.simpleUrl
          ? e.indexOf("/list/") !== -1
            ? (i.src = this.endpoint + "/" + this.key + "-" + e.split("/")[4])
            : (i.src = this.endpoint + "/" + this.key)
          : (i.src = this.endpoint + o),
          this.parameterize &&
            (i.src = this.parameterize + encodeURIComponent(i.src)),
          this.log("Injecting", i.src),
          document.getElementsByTagName("script")[0].parentNode.appendChild(i);
      },
      serverSideFetch: function(e, s) {
        var i = this;
        this.log("Fetching", this.endpoint + e),
          t({ url: this.endpoint + e, json: !0 }, function(e, t, n) {
            return e ? console.error(e) : void s.call(i, n);
          });
      },
      isWanted: function(e) {
        return 0 === this.wanted.length || a(this.wanted, e) !== -1;
      },
      data: function() {
        if (0 !== this.modelNames.length)
          return this.simpleSheet
            ? (this.modelNames.length > 1 &&
                this.debug &&
                this.log(
                  "WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong."
                ),
              this.models[this.modelNames[0]].all())
            : this.models;
      },
      addWanted: function(e) {
        a(this.wanted, e) === -1 && this.wanted.push(e);
      },
      loadSheets: function(t) {
        var i,
          n,
          o = [];
        for (
          this.googleSheetName = t.feed.title.$t,
            this.foundSheetNames = [],
            i = 0,
            n = t.feed.entry.length;
          i < n;
          i++
        )
          if (
            (this.foundSheetNames.push(t.feed.entry[i].title.$t),
            this.isWanted(t.feed.entry[i].content.$t))
          ) {
            var a = t.feed.entry[i].link.length - 1,
              h = t.feed.entry[i].link[a].href.split("/").pop(),
              l = "/feeds/list/" + this.key + "/" + h + "/public/values?alt=";
            (l += e || s ? "json" : "json-in-script"),
              this.query && (l += "&tq=" + this.query),
              this.orderby &&
                (l += "&orderby=column:" + this.orderby.toLowerCase()),
              this.reverse && (l += "&reverse=true"),
              o.push(l);
          }
        for (this.sheetsToLoad = o.length, i = 0, n = o.length; i < n; i++)
          this.requestData(o[i], this.loadSheet);
      },
      sheets: function(e) {
        return "undefined" == typeof e
          ? this.models
          : "undefined" == typeof this.models[e]
          ? void 0
          : this.models[e];
      },
      sheetReady: function(e) {
        (this.models[e.name] = e),
          a(this.modelNames, e.name) === -1 && this.modelNames.push(e.name),
          this.sheetsToLoad--,
          0 === this.sheetsToLoad && this.doCallback();
      },
      loadSheet: function(e) {
        var t = this;
        new h.Model({
          data: e,
          parseNumbers: this.parseNumbers,
          postProcess: this.postProcess,
          tabletop: this,
          prettyColumnNames: this.prettyColumnNames,
          onReady: function() {
            t.sheetReady(this);
          }
        });
      },
      doCallback: function() {
        0 === this.sheetsToLoad &&
          this.callback.apply(this.callbackContext || this, [
            this.data(),
            this
          ]);
      },
      log: function() {
        this.debug &&
          "undefined" != typeof console &&
          "undefined" != typeof console.log &&
          Function.prototype.apply.apply(console.log, [console, arguments]);
      }
    }),
    (h.Model = function(e) {
      var t, s, i, n;
      if (
        ((this.columnNames = []),
        (this.column_names = this.columnNames),
        (this.name = e.data.feed.title.$t),
        (this.tabletop = e.tabletop),
        (this.elements = []),
        (this.onReady = e.onReady),
        (this.raw = e.data),
        "undefined" == typeof e.data.feed.entry)
      )
        return (
          e.tabletop.log(
            "Missing data for " +
              this.name +
              ", make sure you didn't forget column headers"
          ),
          (this.originalColumns = []),
          (this.elements = []),
          void this.onReady.call(this)
        );
      for (var o in e.data.feed.entry[0])
        /^gsx/.test(o) && this.columnNames.push(o.replace("gsx$", ""));
      for (
        this.originalColumns = this.columnNames,
          this.original_columns = this.originalColumns,
          t = 0,
          i = e.data.feed.entry.length;
        t < i;
        t++
      ) {
        var a = e.data.feed.entry[t],
          h = {};
        for (s = 0, n = this.columnNames.length; s < n; s++) {
          var l = a["gsx$" + this.columnNames[s]];
          "undefined" != typeof l
            ? e.parseNumbers && "" !== l.$t && !isNaN(l.$t)
              ? (h[this.columnNames[s]] = +l.$t)
              : (h[this.columnNames[s]] = l.$t)
            : (h[this.columnNames[s]] = "");
        }
        void 0 === h.rowNumber && (h.rowNumber = t + 1),
          e.postProcess && e.postProcess(h),
          this.elements.push(h);
      }
      e.prettyColumnNames ? this.fetchPrettyColumns() : this.onReady.call(this);
    }),
    (h.Model.prototype = {
      all: function() {
        return this.elements;
      },
      fetchPrettyColumns: function() {
        if (!this.raw.feed.link[3]) return this.ready();
        var e = this.raw.feed.link[3].href
            .replace("/feeds/list/", "/feeds/cells/")
            .replace("https://spreadsheets.google.com", ""),
          t = this;
        this.tabletop.requestData(e, function(e) {
          t.loadPrettyColumns(e);
        });
      },
      ready: function() {
        this.onReady.call(this);
      },
      loadPrettyColumns: function(e) {
        for (var t = {}, s = this.columnNames, i = 0, n = s.length; i < n; i++)
          "undefined" != typeof e.feed.entry[i].content.$t
            ? (t[s[i]] = e.feed.entry[i].content.$t)
            : (t[s[i]] = s[i]);
        (this.prettyColumns = t),
          (this.pretty_columns = this.prettyColumns),
          this.prettifyElements(),
          this.ready();
      },
      prettifyElements: function() {
        var e,
          t,
          s,
          i,
          n = [],
          o = [];
        for (t = 0, i = this.columnNames.length; t < i; t++)
          o.push(this.prettyColumns[this.columnNames[t]]);
        for (e = 0, s = this.elements.length; e < s; e++) {
          var a = {};
          for (t = 0, i = this.columnNames.length; t < i; t++) {
            var h = this.prettyColumns[this.columnNames[t]];
            a[h] = this.elements[e][this.columnNames[t]];
          }
          n.push(a);
        }
        (this.elements = n), (this.columnNames = o);
      },
      toArray: function() {
        var e,
          t,
          s,
          i,
          n = [];
        for (e = 0, s = this.elements.length; e < s; e++) {
          var o = [];
          for (t = 0, i = this.columnNames.length; t < i; t++)
            o.push(this.elements[e][this.columnNames[t]]);
          n.push(o);
        }
        return n;
      }
    }),
    "undefined" != typeof module && module.exports
      ? (module.exports = h)
      : "function" == typeof define && define.amd
      ? define(function() {
          return h;
        })
      : (window.Tabletop = h);
})();
//# sourceMappingURL=tabletop.min.js.map
