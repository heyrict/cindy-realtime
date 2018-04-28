/*
 *
 * common.js
 *
 * legacy function definitions from Cindy.
 *
 *
 */

/*eslint-disable*/

import MarkdownIt from 'markdown-it';
import mdEmoji from 'markdown-it-emoji';
import sanitizeHtml from 'sanitize-html';
import moment, * as moments from 'moment';
import { push } from 'react-router-redux';
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants';

const md = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .enable(['table', 'strikethrough'])
  .use(mdEmoji);

function hash(string) {
  var chr;
  var hash = 0;
  if (string.length === 0) return hash;
  for (var i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function _norm_openchat(string) {
  return string.replace(
    /^chat:\/\/(.+)$/g,
    "javascript:window.OpenChat('$1');"
  );
}

function _norm_countdown(string) {
  return string.replace(
    /\/countdown\(([^)]+)\)\//g,
    "<span class='btn disabled countdownobj' until='$1'>CountDownObject</span>"
  );
}

const changeTabularTab = (id) => {
  const tabContents = document.getElementById(id).parentElement;
  const navtabContents = document.getElementById(`nav${id}`).parentElement;
  Array.forEach(tabContents.children, (child) => {
    if (child.id === id) {
      child.setAttribute('class', 'tab-pane active');
    } else {
      child.setAttribute('class', 'tab-pane');
    }
  });
  Array.forEach(navtabContents.children, (child) => {
    if (child.id === `nav${id}`) {
      child.setAttribute('class', 'active');
    } else {
      child.removeAttribute('class');
    }
  });
};

window.changeTabularTab = changeTabularTab;

function _norm_tabs(string) {
  var _createID = (text, nmspc) =>
    'tab-' + (nmspc ? nmspc + '-' : '') + hash(text);

  function _build_tabs_navtabs(tab_titles, tab_contents, namespace) {
    var returns = `
<ul class="nav nav-tabs"${namespace ? " id='tabs-" + namespace + "'" : ''}>`;

    for (var i in tab_titles) {
      const newId = _createID(tab_contents[i], namespace);
      returns += `
<li${i == 0 ? " class='active'" : ''} id="nav${newId}">
  <a data-toggle="tab" data-target="#${newId}"
    href="javascript:changeTabularTab('${newId}');">
    ${tab_titles[i]}
  </a>
</li>`;
    }

    returns += '</ul>';
    return returns;
  }

  function _build_tabs_contents(tab_titles, tab_contents, namespace) {
    var returns = "<div class='tab-content'>";

    for (var i in tab_titles) {
      returns += `
<div id="${_createID(tab_contents[i], namespace)}"
  ${i == 0 ? "class='tab-pane active'" : "class='tab-pane'"}>
  ${tab_contents[i]}
</div>`;
    }

    returns += '</div>';
    return returns;
  }

  function _build_tabs() {
    var res,
      tab_titles = Array(),
      tab_contents = Array();

    var namespace = arguments[1],
      text = arguments[2],
      returns = text,
      regex = /<!--tab *([^>]*?)-->([\s\S]*?)<!--endtab-->/g;

    while ((res = regex.exec(text))) {
      tab_titles.push(res[1] ? res[1] : 'tab');
      tab_contents.push(res[2]);
    }

    return (
      _build_tabs_navtabs(tab_titles, tab_contents, namespace) +
      _build_tabs_contents(tab_titles, tab_contents, namespace)
    );
  }

  return string.replace(
    /<!--tabs ?([^>]*?)-->([\s\S]*?)<!--endtabs-->/g,
    _build_tabs
  );
}

function StartCountdown(selector) {
  return window.setInterval(function() {
    Array.forEach(
      document.getElementsByClassName(selector || '.countdownobj'),
      (countdownobj) => {
        var until = moment(countdownobj.getAttribute('until')),
          now = moment();
        var diff = until.diff(now, 'milliseconds'),
          diffdays = until.diff(now, 'days');
        countdownobj.innerHtml =
          diff < 0
            ? `<font color='tomato'>${gettext('Time Out')}</font>`
            : (diffdays ? diffdays + 'd ' : '') +
              moment(diff).format('H[h]:mm[m]:ss[s]');
      }
    );
  }, 1000);
}

function PreNorm(string) {
  string = _norm_tabs(string);
  return string;
}

export function line2md(string) {
  const mdEscape = MarkdownIt({
    html: false,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .enable(['table', 'strikethrough'])
    .use(mdEmoji);
  string = PreNorm(string);

  return sanitizeHtml(
    mdEscape
      .render(string)
      .replace(/<p>/g, '')
      .replace(/<\/p>\s*$/g, '')
      .replace(/<\/p>/g, '<br style="margin-bottom: 10px" />'),
    {
      allowedTags: false,
      allowedAttributes: false,
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'chat', 'javascript'],
      textFilter: _norm_countdown,
      transformTags: {
        '*': (tagName, attribs) => ({
          tagName,
          attribs: attribs.href
            ? {
                ...attribs,
                href: _norm_openchat(attribs.href),
              }
            : attribs,
        }),
      },
    }
  );
}

export function text2md(string, safe = true) {
  if (safe) {
    return sanitizeHtml(md.render(PreNorm(string)), {
      allowedTags: false,
      allowedAttributes: false,
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'chat', 'javascript'],
      textFilter: _norm_countdown,
      transformTags: {
        '*': (tagName, attribs) => ({
          tagName,
          attribs: attribs.href
            ? {
                ...attribs,
                href: _norm_openchat(attribs.href),
              }
            : attribs,
        }),
      },
    });
  } else {
    return sanitizeHtml(md.render(PreNorm(string)), {
      allowedTags: [
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'p',
        'a',
        'ul',
        'ol',
        'nl',
        'li',
        'b',
        'i',
        'strong',
        'em',
        'strike',
        'code',
        'hr',
        'br',
        'div',
        'table',
        'thead',
        'caption',
        'tbody',
        'tr',
        'th',
        'td',
        'pre',
        'font',
      ],
      allowedAttributes: {
        '*': ['style', 'href', 'data-*'],
        font: ['style', 'color', 'size'],
      },
      allowedStyles: {
        '*': {
          // Match HEX and RGB
          color: [
            /^\#(0x)?[0-9a-f]+$/i,
            /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
          ],
          background: [
            /^\#(0x)?[0-9a-f]+$/i,
            /^[a-z]+$/i,
            /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
          ],
          'background-color': [
            /^\#(0x)?[0-9a-f]+$/i,
            /^[a-z]+$/i,
            /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
          ],
          'text-align': [/^left$/, /^right$/, /^center$/],
          // Match any number with px, em, or %
          'font-size': [/^\d+(px|em|\%)?$/],
          width: [/^\d+(px|em|\%)?$/],
          height: [/^\d+(px|em|\%)?$/],
          padding: [/^.*$/],
          margin: [/^.*$/],
          border: [/^.*$/],
          'padding-left': [/^\d+(px|em|\%)?$/],
          'padding-right': [/^\d+(px|em|\%)?$/],
          'padding-top': [/^\d+(px|em|\%)?$/],
          'padding-bottom': [/^\d+(px|em|\%)?$/],
          'margin-left': [/^\d+(px|em|\%)?$/],
          'margin-right': [/^\d+(px|em|\%)?$/],
          'margin-top': [/^\d+(px|em|\%)?$/],
          'margin-bottom': [/^\d+(px|em|\%)?$/],
          'border-left': [/^\d+(px|em|\%)?$/],
          'border-right': [/^\d+(px|em|\%)?$/],
          'border-top': [/^\d+(px|em|\%)?$/],
          'border-bottom': [/^\d+(px|em|\%)?$/],
        },
      },
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'chat'],
      nonTextTags: ['style', 'script'],
      textFilter: _norm_countdown,
      transformTags: {
        '*': (tagName, attribs) => ({
          tagName,
          attribs: attribs.href
            ? {
                ...attribs,
                href: _norm_openchat(attribs.href),
              }
            : attribs,
        }),
      },
    });
  }
}

export function text2desc(string) {
  return sanitizeHtml(md.render(string), {
    allowedTags: [],
    allowedAttributes: [],
  }).substr(0, 250);
}

export function getCookie(c_name) {
  var c_start, c_end;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
}

export function setCookie(c_name, c_value, c_expiry, c_path = '/') {
  let expiry_str = '';
  const path_str = `;path='${c_path}'`;
  if (c_expiry) {
    let expiry_date = new Date();
    expiry_date.setTime(expiry_date.getTime() + c_expiry * 1000);
    expiry_str = `;expires=${expiry_date.toGMTString()}`;
  }
  document.cookie = `${c_name}=${c_value}${expiry_str}${path_str}`;
}

export function getQueryStr(qs) {
  if (!qs) return {};

  qs = qs.substring(1);
  let qsList = qs.split('&');
  let i;
  let qObj = {};
  let p;
  for (i = 0; i < qsList.length; i += 1) {
    p = decodeURI(qsList[i]).split('=');
    qObj[p[0]] = p[1];
  }
  return qObj;
}

export function setQueryStr(qObj) {
  const query = [];
  Object.entries(qObj).forEach(
    (arg) => arg[0] && arg[1] && query.push(arg.join('='))
  );
  return '?' + encodeURI(query.join('&'));
}

export function updateQueryStr(qObj) {
  qObj = { ...getQueryStr(window.location.search), ...qObj };
  return setQueryStr(qObj);
}

export const status_code_dict = {
  0: 'unsolved',
  1: 'solved',
  2: 'dazed',
  3: 'hidden',
  4: 'forced hidden',
};

export const genre_type_dict = {
  0: 'classic',
  1: 'twentyQuestions',
  2: 'littleAlbat',
  3: 'others',
};

export const from_global_id = (id) => {
  try {
    return atob(id).split(':');
  } catch (e) {
    console.log(e, id);
  }
};

export const withLocale = (link) => {
  let locale = window.location.pathname.split('/')[1];
  if (locale !== 'ja' && locale !== 'en') {
    locale = DEFAULT_LOCALE;
  }
  return `/${locale}${link}`;
};

export const pushWithLocale = (link) => {
  return push(withLocale(link));
};

export const to_global_id = (className, rid) => btoa(`${className}:${rid}`);

export default {
  getCookie,
  status_code_dict,
  text2md,
  line2md,
  StartCountdown,
  getQueryStr,
  setQueryStr,
};
