export default {
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
