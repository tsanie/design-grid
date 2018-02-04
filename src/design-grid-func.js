const MINI_COLUMN_WIDTH = 0;
const DEFAULT_WIDTH = 100;

/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-vars */
function setColumnStyle(c) {
  const w = `${c.width}px`;
  if (c.columnStyle == null) {
    this.$set(c, 'columnStyle', {
      width: w,
      minWidth: w,
      maxWidth: w,
      textAlign: c.align,
    });
  } else {
    const style = c.columnStyle;
    this.$set(style, 'width', w);
    this.$set(style, 'minWidth', w);
    this.$set(style, 'maxWidth', w);
    this.$set(style, 'textAlign', c.align);
  }
}

export default {
  windowResizing() {
    this._data.__bodyClientHeight = this.$refs.gridbody.clientHeight;
  },

  updateBodyTop() {
    if (this.$refs.header) {
      const h = this.$refs.header.offsetHeight + 1;
      if (h >= 27 && this.$refs.gridbody.offsetTop !== h) {
        this.$refs.gridbody.style.top = `${h}px`;
      }
    }
  },

  widthChanging(index, width) {
    const rows = this.$refs.gridrows;
    const w = `${width}px`;
    if (rows && rows.length > 0) {
      let change;
      for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].children[index + 1];
        if (change === undefined) {
          if (width > 0) {
            if (cell.style.display === 'none') {
              change = '';
            } else {
              change = null;
            }
          } else {
            if (cell.style.display !== 'none') {
              change = 'none';
            } else {
              change = null;
            }
          }
        }
        if (change != null) {
          cell.style.display = change;
        }
        cell.style.width = w;
        cell.style.minWidth = w;
        cell.style.maxWidth = w;
      }
    }
  },

  heightChanging(index, height) {
    const row = this.$refs.gridrows[index];
    const h = `${height}px`;
    if (row && row.children) {
      for (let i = 1; i < row.children.length; i++) {
        const td = row.children[i];
        td.style.height = h;
      }
    }
  },

  resizeColumn(index, width, autoResize) {
    const c = this.columns[index];
    c.width = width;
    setColumnStyle.call(this, c);
  },

  wrapColumns(columns) {
    for (let i = 0; i < columns.length; i++) {
      const c = columns[i];
      if (c.key === undefined) {
        this.$set(c, 'key', null);
      }
      if (c.caption === undefined) {
        this.$set(c, 'caption', '');
      }
      if (c.enabled === undefined) {
        this.$set(c, 'enabled', true);
      }
      if (c.visible === undefined) {
        this.$set(c, 'visible', true);
      }
      if (c.width === undefined || c.width <= 0) {
        this.$set(c, 'width', DEFAULT_WIDTH);
      }
      if (c.minWidth === undefined) {
        this.$set(c, 'minWidth', MINI_COLUMN_WIDTH);
      }
      if (c.align === undefined) {
        this.$set(c, 'align', 'left');
      }
      setColumnStyle.call(this, c);
    }
  },

  getSelectedColumnIndex(e) {
    if (e.target.className !== 'd-grid-row') {
      let target = e.target;
      while (target.parentElement &&
        (` ${target.parentElement.className} `).indexOf(' d-grid-row ') < 0) {
        target = target.parentElement;
      }
      const parent = target.parentElement;
      if (parent == null) {
        return -1;
      }
      let columnIndex = 0;
      for (let i = 1; i < parent.children.length - 1; i++) {
        if (parent.children[i] === target) {
          columnIndex = i;
          break;
        }
      }
      return columnIndex - 1;
    }
    return -1;
  },
  /* eslint-enable no-invalid-this */
  /* eslint-enable no-unused-vars */
};
