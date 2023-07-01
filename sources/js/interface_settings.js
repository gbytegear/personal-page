let local_settings = new Object();

if(window.localStorage.getItem("settings") == null) {
  window.localStorage.setItem("settings", JSON.stringify(local_settings));
} else {
  local_settings = JSON.parse(window.localStorage.getItem("settings"));
}

local_settings.setProperty = function(name, value) {
  this[name] = value;
  window.localStorage.setItem("settings", JSON.stringify(this));
}

local_settings.removeProperty = function(name) {
  delete this[name];
  window.localStorage.setItem("settings", JSON.stringify(this));
}

local_settings.apply = function() {
  for(let property in local_settings) {
    switch(property) {
      case "nav_width":
        document.documentElement.style.setProperty("--nav-width", `${local_settings[property]}px`);
      break;
      case "article_padding":
        document.documentElement.style.setProperty("--paddings", `${local_settings[property]}`);
      break;
    }
  }
}

local_settings.apply();

document.querySelector("nav>button#nav_resizer").addEventListener('mousedown', () => {
  let nav_width = 400;
  document.documentElement.addState("disable-anim");
  const mousemove_handle = e => {
    nav_width = e.clientX;
    if(nav_width < 100) nav_width = 100;
    if(nav_width > (document.documentElement.offsetWidth / 3)) nav_width = (document.documentElement.offsetWidth / 3);
    document.documentElement.style.setProperty("--nav-width", `${nav_width}px`);
  };
  document.addEventListener('mousemove', mousemove_handle);
  const mouseup_handle = () => {
    document.removeEventListener('mousemove', mousemove_handle);
    document.removeEventListener('mouseup', mouseup_handle);
    document.documentElement.removeState("disable-anim");
    local_settings.setProperty("nav_width", nav_width);
  }
  document.addEventListener('mouseup', mouseup_handle);
});


document.querySelector("nav>button#nav_resizer").oncontextmenu = () => {
  document.documentElement.style.removeProperty("--nav-width");
  local_settings.removeProperty("nav_width");
  return false;
};


document.querySelector("nav>button#nav_resizer").addEventListener('touchstart', () => {
  let nav_width = 400;
  document.documentElement.addState("disable-anim");
  const mousemove_handle = e => {
    nav_width = e.changedTouches[0].pageX;
    if(nav_width < 100) nav_width = 100;
    if(nav_width > (document.documentElement.offsetWidth / 3)) nav_width = (document.documentElement.offsetWidth / 3);
    document.documentElement.style.setProperty("--nav-width", `${nav_width}px`);
  };
  document.addEventListener('touchmove', mousemove_handle);
  const mouseup_handle = () => {
    document.removeEventListener('touchmove', mousemove_handle);
    document.removeEventListener('touchend', mouseup_handle);
    document.documentElement.removeState("disable-anim");
    local_settings.setProperty("nav_width", nav_width);
  }
  document.addEventListener('touchend', mouseup_handle);
});






document.querySelector("button#article_padding_resizer").addEventListener('mousedown', () => {
  let article_padding = 12.5;
  document.documentElement.addState("disable-anim");
  let article_element = document.querySelector('article');
  const mousemove_handle = e => {
    article_padding = ((e.clientX - article_element.offsetLeft) * 100) / article_element.offsetWidth;
    if(article_padding < 0) article_padding = 0;
    if(article_padding > 16.5) article_padding = 16.5;
    document.documentElement.style.setProperty("--paddings", `${article_padding}`);
    console.log(article_padding);
  };
  document.addEventListener('mousemove', mousemove_handle);
  const mouseup_handle = () => {
    document.removeEventListener('mousemove', mousemove_handle);
    document.removeEventListener('mouseup', mouseup_handle);
    document.documentElement.removeState("disable-anim");
    local_settings.setProperty("article_padding", article_padding);
  }
  document.addEventListener('mouseup', mouseup_handle);
});


document.querySelector("button#article_padding_resizer").oncontextmenu = () => {
  document.documentElement.style.removeProperty("--paddings");
  local_settings.removeProperty("article_padding");
  return false;
};


document.querySelector("button#article_padding_resizer").addEventListener('touchstart', () => {
  let article_padding = 12.5;
  document.documentElement.addState("disable-anim");
  let article_element = document.querySelector('article');
  const mousemove_handle = e => {
    article_padding = ((e.changedTouches[0].pageX - article_element.offsetLeft) * 100) / article_element.offsetWidth;
    if(article_padding < 0) article_padding = 0;
    if(article_padding > 16.5) article_padding = 16.5;
    document.documentElement.style.setProperty("--paddings", `${article_padding}`);
    console.log(article_padding);
  };
  document.addEventListener('touchmove', mousemove_handle);
  const mouseup_handle = () => {
    document.removeEventListener('touchmove', mousemove_handle);
    document.removeEventListener('touchend', mouseup_handle);
    document.documentElement.removeState("disable-anim");
    local_settings.setProperty("article_padding", article_padding);
  }
  document.addEventListener('touchend', mouseup_handle);
});