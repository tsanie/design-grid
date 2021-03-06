export default {
  DEFAULT_LINE_HEIGHT: 26,

  assign(target, obj) {
    if (obj == null) {
      return target;
    }
    if (typeof Object.assign === 'function') {
      return Object.assign(target, obj);
    }
    target = Object(target);
    if (obj != null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          target[key] = obj[key];
        }
      }
    }
    return target;
  },

  set(obj, key, value) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = value;
    } else {
      Object.defineProperty(obj, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false,
      });
    }
  },

  /**
   * get the cell string value
   * @param {string} filtername
   * @param {*} item
   * @param {*} column
   * @param {number} index
   * @return {string}
   */
  value(filtername, item, column, index) {
    if (item == null) {
      return '';
    }
    const filter = column[filtername || 'filter'];
    let v;
    if (typeof filter === 'function') {
      v = filter.call(this, item, index);
    } else {
      v = item && item[typeof filter === 'string' ? filter : column.key];
    }
    if (v == null) {
      return '';
    }
    return String(v);
  },
  /**
   * get the cell style
   * @param {string} filtername
   * @param {*} item
   * @param {*} column
   * @param {number} index
   * @return {*}
   */
  style(filtername, item, column, index) {
    if (item == null) {
      return null;
    }
    const filter = column[filtername || 'style'];
    switch (typeof filter) {
      case 'function': return filter.call(this, item, index);
      case 'string': return item && item[filter];
      default: return filter;
    }
  },

  math: {
    /**
     * truncate the given number
     * @param {number} val
     * @return {number}
     */
    trunc(val) {
      const v = Number(val);
      if (isNaN(v)) {
        return val;
      }
      return (v > 0 ? Math.floor : Math.ceil)(v);
    },
  },
  ui: {
    /**
     * get the clientX compatibility
     * @param {*} e
     * @return {number}
     */
    getClientX(e) {
      if (e == null) {
        return null;
      }
      if (e.originalEvent != null) {
        e = e.originalEvent;
      }
      const cx = (e.touches && e.touches[0] && e.touches[0].clientX);
      if (cx === undefined) {
        return e.clientX;
      }
      return cx;
    },
    getClientY(e) {
      if (e == null) {
        return null;
      }
      if (e.originalEvent != null) {
        e = e.originalEvent;
      }
      const cy = (e.touches && e.touches[0] && e.touches[0].clientY);
      if (cy === undefined) {
        return e.clientY;
      }
      return cy;
    },
    /**
     * get the sum of the offsetLeft
     * @param {*} el
     * @return {number}
     */
    getOffsetLeft(el) {
      let left = 0;
      while (el) {
        left += el.offsetLeft;
        el = el.offsetParent;
      }
      return left;
    },
  },
  func: {
    /**
     * debounce to trigger the function
     * @param {function} method
     * @param {number} delay
     * @param {*} context
     * @param {*} args
     */
    debounce(method, delay = 100, context = window, ...args) {
      if (typeof method !== 'function') {
        return;
      }
      clearTimeout(method.tiid);
      method.tiid = setTimeout(() => method.apply(context, args), delay);
    },
    /**
     * throttle to trigger the function
     * @param {function} method
     * @param {number} delay
     * @param {*} context
     * @param {*} args
     */
    throttle(method, delay = 100, context = window, ...args) {
      if (typeof method !== 'function') {
        return;
      }
      clearTimeout(method.tiid);
      const current = new Date();
      if (method.tdate == null || current - method.tdate > delay) {
        method.apply(context, args);
        method.tdate = current;
      } else {
        method.tiid = setTimeout(() => method.apply(context, args), delay);
      }
    },
  },
};
