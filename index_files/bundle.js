/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);
const queue = [];

window.$k = function(arg) {
  let htmlElements;
  if(arg instanceof HTMLElement){
    return new DOMNodeCollection([arg]);
  } else if(typeof arg === "function") {
    if(document.readyState === 'complete'){
      arg();
    } else {
      queue.push(arg);
    }
  } else {
    let NodeList = document.querySelectorAll(arg);
    NodeList = Array.from(NodeList);
    return new DOMNodeCollection(NodeList);
  }
};

//extend is a function that merges any number of objects, resulting in all objects
$k.extend = function(obj, ...otherObjs) {
  otherObjs.forEach((arg) => {
    let keys = Object.key(arg);
    keys.forEach( key => {
      obj[key] = arg[key];
    });
  });
};

function trigger (queueArray) {
  queue.forEach(function(callback) {
    callback();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  trigger(queue);
});


addToQueryString = function(obj) {
  let res = "";
  for(let prop in obj){
    if(obj.hasOwnProperty(prop)){
      res += "=" + obj[prop] + "&";
    }
  }
  return res.substring(0, res.length - 1);
};

$k.ajax = function(options = {}) {
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  options = $k.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET"){
    options.url += "?" + addToQueryString(options.data);
  }
  const request = new XMLHttpRequest();
  request.open(options.method, options.url, true);
  request.onload = e => {

    if (request.status >= 200 && request.status < 300) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };
  request.send(JSON.stringify(options.data));
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {

  constructor(htmlElements) {
    this.htmlElements = htmlElements;
    this.htmlElements.forEach( node => node.callbacks = {} );

    this.html = this.html.bind(this);
    this.empty = this.empty.bind(this);
    this.remove = this.remove.bind(this);
    this.attr = this.attr.bind(this);
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    this.find = this.find.bind(this);
    this.children = this.children.bind(this);
    this.parent = this.parent.bind(this);
    this.append = this.append.bind(this);
  }

  html(str) {
    if(str) {
      this.htmlElements.forEach(function(el) {
        el.innerHTML = str;
      });
    } else {
      return this.htmlElements[0].innerHTML;
    }
  }

  empty() {
    this.htmlElements.forEach(function(el) {
      el.innerHTML = "";
    });
  }

  append(arg) {
    if (arg instanceof HTMLElement) {
      this.htmlElements.forEach(function(el) {
        el.innerHTML += arg.outerHTML;
      });
    } else if (typeof arg === "string" ) {
      this.htmlElements.forEach(function(el) {
        el.innerHTML += arg;
      });
    } else if (arg instanceof DOMNodeCollection) {
      this.htmlElements.forEach(function(el) {
        arg.htmlElements.forEach(function(argEl) {
          el.innerHTML += argEl.outerHTML;
        });
      });
    }
  }

  remove(selector) {
    if (typeof selector === "string" ) {
      this.htmlElements.forEach(function(el) {
        if (el.matches(selector)) {
          el.remove();
        }
      });
    } else {
      this.htmlElements.forEach(function(el) {
        el.remove();
      });
    }
  }

  attr(attrName) {
    if (this.htmlElements.length === 0) { return undefined; }
    return this.htmlElements[0].getAttribute(attrName);
  }

  addClass(arg) {
    var cName = this.htmlElements;
    cName.forEach( function(node) {
      if (node.className === "") {
        node.className = arg;
      } else {
        node.className += ` ${arg}`;
      }
    });
  }

  removeClass(arg) {
    var cName = this.htmlElements;
    // cName.forEach( function(node) {
    //   if (node.className === arg) {
    //     node.className = "";
    //   } else {
    //     let arr = node.className.split(" ");
    //     let index = node.className.split(" ").indexOf(arg);
    //     node.className = arr.splice(0, index) + arr.splice(index, arr.length);
    //   }
    // });
    cName.forEach( node => node.classList.remove(arg));
  }

  find(selector) {
    const res = [];
    this.htmlElements.forEach(function(el) {
      const matched = el.querySelectorAll(selector);
      for (let i = 0; i < matched.length; i++) {
        res.push(matched[i]);
      }
    });
    return new DOMNodeCollection(res);
  }

  children() {
    const res = [];
    this.htmlElements.forEach(function(el) {
      let children = el.children;
      for (let i = 0; i < children.length; i++) {
        res.push(children[i]);
      }
    });
    return new DOMNodeCollection(res);
  }

  parent() {
    const res = [];
    this.htmlElements.forEach(function(child) {
      res.push(child.parentNode);
    });
    return new DOMNodeCollection(res);
  }

  on(eventName, callback) {
    this.htmlElements.forEach(function(node) {
      node.addEventListener(eventName, callback);
      if (!node.callbacks[eventName]) {
        node.callbacks[eventName] = [callback];
        debugger;
      } else {
        node.callbacks[eventName].push(callback);
      }
    });
  }

  off(eventName) {
    this.htmlElements.forEach(function(node) {
        node.removeEventListener(eventName, node.callback);
      });
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);