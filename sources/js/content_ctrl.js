if(!!Array.prototype.equals) {
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
      return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
      return false;

    for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
          return false;       
      }           
      else if (this[i] != array[i]) { 
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;   
      }           
    }       
    return true;
  }
}


class ContentController {
  constructor() {
    this.loader_settings = null;
    this.owner = window.location.host.slice(0, window.location.host.indexOf('.'));
    this.current_page = null;

    this.nav_element = document.querySelector('body > nav');
    this.content_element = document.querySelector('body > article');
    this.title_element = document.querySelector('head > title');
    this.header_title_element = document.querySelector('body > header  h1.title');
    this.breadcrumbs_element = document.querySelector('header > div.line.breadcrumbs-container');

    this.haschange_handle = () => {
      if(window.location.hash) {
        let new_page_path = decodeURI(window.location.hash).replace("#","").split(".");
        if(new_page_path.equals(this.current_page)) return;
        this.loadPage(new_page_path);
      } else this.loadPage(window.content_ctrl.loader_settings.settings.default_page);
    };

    window.addEventListener("hashchange", this.haschange_handle);

    this.mdit = window.markdownit('default', {
      html: true,
      highlight: function(str, lang) {
        try {return (lang && hljs.getLanguage(lang)) ? hljs.highlight(str, { language: lang, ignoreIllegals: true }).value : ''} catch (__) {}
        return "";
      }
    });

    this.loadSettings();
  }

  loadSettings() {
    this.loadByXhr("GET", "./pages/settings.json", "json", (status, response) => {
      if(status != 200) {
        this.nav_element.innerHTML = '<div style="color: red; position: relative; top: calc(50% - .5em); left: 0; text-align: center;">Can\'t load "pages/tree.json", error code' + this.xhr.status + '</div>';
        return;
      }
      this.loader_settings = response;
      this.renderNavigation();
    });
  }

  loadByXhr(method, url, response_type, callback, body = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = response_type;
    xhr.onload = () => callback(xhr.status, xhr.response);
    xhr.send(body);
  }

  loadPage(page_path, clear_breadcrumbs = true) {
    this.current_page = page_path;
    let string_page_path = page_path.toString().replaceAll(',', '.');
    this.title_element.innerText = this.owner + "::" + string_page_path;
    this.header_title_element.innerText = page_path.at(-1);
    window.location.hash = "#" + string_page_path;
    
    let page_settings = this.loader_settings.navigation[page_path[0]];
    let is_page_settings_finded = true;
    if(clear_breadcrumbs)
      this.breadcrumbs_element.innerHTML = '';
    let sub_path = new Array;
    page_path.forEach((page_name, i) => {

      if(clear_breadcrumbs) {
        sub_path.push(page_name);
        let bc_path = new Array(...sub_path);
        let bc_button = document.createElement('button');
        bc_button.innerText = page_name;
        bc_button.addEventListener('click', () => { this.loadPage(bc_path, false); });
        this.breadcrumbs_element.appendChild(bc_button);
      }

      if(!i) return;
      else if(!page_settings) is_page_settings_finded = false;
      else if(!page_settings.childs) is_page_settings_finded = false;
      else {
        page_settings = page_settings.childs[page_name];
      }
    });

    if(!is_page_settings_finded || !page_settings) {
      let error_string = 'Page with path "' + string_page_path + '" didn\'t finded!\nCheck "pages/settings.json"';
      console.error(error_string);
      this.content_element.innerHTML = `<div style="color: red; position: relative; top: calc(50% - .5em); left: 0; text-align: center;">${error_string}</div>`;
      return;
    }


    this.loadByXhr("GET", page_settings.url, "string", (status, response) => {
      if(status != 200) {
        this.content_element.innerHTML = '<div style="color: red; position: relative; top: calc(50% - .5em); left: 0; text-align: center;">Can\'t load "' + page_settings.url + '", error code' + this.xhr.status + '</div>'
      }
      switch(page_settings.type) {
        case "md":
          this.content_element.innerHTML = this.mdit.render(response);
          this.content_element.scroll({top: 0, left: 0});
        break;
        case "html":
          this.content_element.innerHTML = response;
          this.content_element.scroll({top: 0, left: 0});
        break;
      }
    });
  } 


  renderNavigation() {
    if(window.location.hash) {
      this.loadPage(decodeURI(window.location.hash).replace("#","").split("."));
    } else this.loadPage(this.loader_settings.settings.default_page);
    
    let renderElement = (parent_element, element_settings, page_path) => {
      let div_element = document.createElement('div');
      
      if(!!element_settings.childs) 
        if(!!Object.keys(element_settings.childs).length) {
          let childs_element = document.createElement('div');
          let open_button = document.createElement('button');
          open_button.innerText = "+";
          const open_event_handle = () => {
            open_button.innerText = childs_element.toggleState('open') ? "-" : "+";
          };
          open_button.addEventListener('click', open_event_handle);
          div_element.appendChild(open_button);

          let open_page_button = document.createElement('button');
          open_page_button.innerText = page_path.at(-1);
          const open_page_event_handle = () => { this.loadPage(page_path); }
          open_page_button.addEventListener('click', open_page_event_handle);
          div_element.appendChild(open_page_button);

          childs_element.classList.add('child-pages');
          for(let name in element_settings.childs) {
            let child_path = new Array(...page_path);
            child_path.push(name);
            renderElement(childs_element, element_settings.childs[name], child_path);
          }
          div_element.appendChild(childs_element);

          parent_element.appendChild(div_element);
          return;
        }
    
      let open_page_button = document.createElement('button');
      open_page_button.innerText = page_path.at(-1);
      const open_page_event_handle = () => { this.loadPage(page_path); }
      open_page_button.addEventListener('click', open_page_event_handle);
      div_element.appendChild(open_page_button);
      
      parent_element.appendChild(div_element);
    }
    
    for(let name in this.loader_settings.navigation)
      renderElement(this.nav_element, this.loader_settings.navigation[name], [name]);
  }



};

window.content_ctrl = new ContentController();


class ContentLoader extends HTMLElement {
  constructor() { super(); }
  connectedCallback() {
    if(!this.innerText) this.remove();
    content_ctrl.loadByXhr("GET", this.innerText, "text", (status, response) => {
      if(status != 200) {
        console.error("Can't load\"" + this.innerText + "\"!");
        this.remove();
      }
      let wrapper = document.createElement("div");
      wrapper.innerHTML = response;
      let this_parent = this.parentElement;
      let last_added = null;
      for(let i = wrapper.childNodes.length - 1; i > -1; --i) {
        if(!last_added) {
          last_added = wrapper.childNodes[i];
          this.replaceWith(wrapper.childNodes[i]);
        } else {
          this_parent.insertBefore(wrapper.childNodes[i], last_added);
          last_added = wrapper.childNodes[i];
        }
      }
    });
  }
};

customElements.define('content-loader', ContentLoader);