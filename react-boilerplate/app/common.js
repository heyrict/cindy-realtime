export function getCookie(c_name) {
  var c_start, c_end;
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

const status_class_dict = {
  0: "status_unsolved",
  1: "status_solved",
  2: "status_dazed",
  3: "status_hidden"
};

const status_code_dict = {
  0: "unsolved",
  1: "solved",
  2: "dazed",
  3: "hidden",
  4: "forced hidden"
};

const genre_code_dict = {
  0: gettext("Albatross"),
  1: gettext("Twenty Questions"),
  2: gettext("Little Albat"),
  3: gettext("Others & Formal")
};

export default {
  getCookie,
  status_class_dict,
  status_code_dict,
  genre_code_dict
};
