define(
  [
    "jquery",
    "markdown-it",
    "markdown-it-emoji",
    "moment",
    "sanitize-html",
    "moment-countdown"
  ],
  function($, MarkdownIt, mdEmoji, moment, sanitizeHtml) {
    md = MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    })
      .enable(["table", "strikethrough"])
      .use(mdEmoji);
    function setCookie(c_name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        c_name +
        "=" +
        escape(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    }

    function getURLParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

      if (sParam === undefined) {
        var returns = Object();
        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split("=");
          returns[sParameterName[0]] =
            sParameterName[1] === undefined ? true : sParameterName[1];
        }
        return returns;
      } else {
        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split("=");
          if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
          }
        }
      }
    }

    function getCookie(c_name) {
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end));
        }
      }
      return "";
    }

    function hash(string) {
      var i, chr;
      var hash = 0;
      if (string.length === 0) return hash;
      for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }

    status_class_dict = {
      0: "status_unsolved",
      1: "status_solved",
      2: "status_dazed",
      3: "status_hidden"
    };

    status_code_dict = {
      0: "unsolved",
      1: "solved",
      2: "dazed",
      3: "hidden",
      4: "forced hidden"
    };

    status_color_dict = {
      0: "#cb4b16",
      1: "#859900",
      2: "#259185",
      3: "gray"
    };

    genre_code_dict = {
      0: gettext("Albatross"),
      1: gettext("20th-Door"),
      2: gettext("Little Albat"),
      3: gettext("Others & Formal")
    };

    function _norm_openchat(string) {
      return string.replace(
        /\"chat:\/\/([0-9a-zA-Z\-]+)\"/g,
        "\"javascript:sidebar.OpenChat('$1');\""
      );
    }

    function _norm_countdown(string) {
      return string.replace(
        /\/countdown\(([^)]+)\)\//g,
        "<span class='btn disabled countdownobj' until='$1'>CountDownObject</span>"
      );
    }

    function _norm_tabs(string) {
      _createID = (text, nmspc) =>
        "tab-" + (nmspc ? nmspc + "-" : "") + hash(text);

      function _build_tabs_navtabs(tab_titles, tab_contents, namespace) {
        var returns = `
<ul class="nav nav-tabs"${namespace ? " id='tabs-" + namespace + "'" : ""}>
          `;

        for (i in tab_titles) {
          returns += `
<li${i == 0 ? " class='active'" : ""}>
  <a data-toggle="tab" data-target="#${_createID(tab_contents[i], namespace)}"
    href="javascript:void(0);">
    ${tab_titles[i]}
  </a>
</li>
            `;
        }

        returns += "</ul>";
        return returns;
      }

      function _build_tabs_contents(tab_titles, tab_contents, namespace) {
        var returns = "<div class='tab-content'>";

        for (i in tab_titles) {
          returns += `
<div id="${_createID(tab_contents[i], namespace)}"
  ${i == 0 ? "class='tab-pane active'" : "class='tab-pane'"}>
  ${tab_contents[i]}
</div>
            `;
        }

        returns += "</div>";
        return returns;
      }

      function _build_tabs() {
        var tab_titles = Array(),
          tab_contents = Array();

        var namespace = arguments[1],
          text = arguments[2],
          returns = text,
          regex = /<!--tab *([^>]*?)-->([\s\S]*?)<!--endtab-->/g;

        while ((res = regex.exec(text))) {
          tab_titles.push(res[1] ? res[1] : "tab");
          tab_contents.push(res[2]);
        }

        return (
          _build_tabs_navtabs(tab_titles, tab_contents, namespace) +
          _build_tabs_contents(tab_titles, tab_contents, namespace)
        );
      }

      tabs = string.replace(
        /<!--tabs ?([^>]*?)-->([\s\S]*?)<!--endtabs-->/g,
        _build_tabs
      );

      return tabs;
    }

    function StartCountdown(selector) {
      window.setInterval(function() {
        $(selector || ".countdownobj").each(function() {
          until = moment($(this).attr("until"));
          $(this).html(
            moment().diff(until) < 0
              ? moment()
                  .countdown(until)
                  .toString()
              : `<font color='red'>${gettext("Time Out")}</font>`
          );
        });
      }, 1000);
    }

    function LinkNorm(string) {
      string = _norm_openchat(string);
      string = _norm_countdown(string);
      return string;
    }

    function PreNorm(string) {
      string = _norm_tabs(string);
      return string;
    }

    function line2md(string) {
      string = PreNorm(string)
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^([*+-]) /g, "\\$1 ")
        .replace(/^(\d+)\. /g, "$1\\. ")
        .replace(/\n/g, "<br />");

      return LinkNorm(md.render(string).replace(/<\/?p>/g, ""));
    }

    function text2md(string) {
      return LinkNorm(
        sanitizeHtml(md.render(PreNorm(string)), {
          allowedTags: false,
          allowedAttributes: false,
          allowedSchemes: [
            "http",
            "https",
            "ftp",
            "mailto",
            "chat",
            "javascript"
          ]
        })
      );
    }

    function bindEnterToSubmit(inputSelector, submitSelector) {
      $(inputSelector).on("keypress", function(e) {
        if (e.which == 13) {
          $(submitSelector).click();
        }
      });
    }

    function LinkNormAll(selector) {
      if ($(selector).length > 0) {
        $(selector).each(function(index) {
          $(this).html(LinkNorm($(this).html()));
        });
      }
    }

    return {
      hash: hash,
      getURLParameter: getURLParameter,
      getCookie: getCookie,
      setCookie: setCookie,
      line2md: line2md,
      text2md: text2md,
      bindEnterToSubmit: bindEnterToSubmit,
      LinkNorm: LinkNorm,
      LinkNormAll: LinkNormAll,
      StartCountdown: StartCountdown,
      genre_code_dict: genre_code_dict,
      status_code_dict: status_code_dict,
      status_color_dict: status_color_dict,
      status_class_dict: status_class_dict
    };
  }
);
