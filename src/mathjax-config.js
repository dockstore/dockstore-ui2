window.MathJax = {
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
    processEscapes: true,
  },
  chtml: {
    fontURL: '/assets/fonts/mathjax',
  },
  options: {
    // values adapted from https://docs.mathjax.org/en/latest/options/safe.html
    safeOptions: {
      allow: {
        URLs: 'none',
        classes: 'none',
        cssIDs: 'none',
        styles: 'none',
      },
      safeProtocols: {
        // this space intentionally blank
      },
      safeStyles: {
        // this space intentionally blank
      },
      classPattern: /^$/,
      idPattern: /^$/,
      dataPattern: /^$/,
    },
  },
};
