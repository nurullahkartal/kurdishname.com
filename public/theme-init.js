(function() {
  // Intercept and silence all third-party deprecations, fledge, and storage warnings
  // before any other script (like Cloudflare Zaraz main.js or Google AdSense) can print them.
  var originalWarn = console.warn;
  console.warn = function() {
    var msg = Array.prototype.slice.call(arguments).map(function(arg) {
      return arg && arg.toString ? arg.toString() : '';
    }).join(' ');
    if (
      msg.indexOf('deprecated') !== -1 ||
      msg.indexOf('defaultProps') !== -1 ||
      msg.indexOf('componentWillMount') !== -1 ||
      msg.indexOf('componentWillReceiveProps') !== -1 ||
      msg.indexOf('UNSAFE_') !== -1 ||
      msg.indexOf('Fledge') !== -1 ||
      msg.indexOf('SharedStorage') !== -1 ||
      msg.indexOf('StorageType') !== -1 ||
      msg.indexOf('navigator.storage') !== -1
    ) {
      return;
    }
    originalWarn.apply(console, arguments);
  };

  var originalError = console.error;
  console.error = function() {
    var msg = Array.prototype.slice.call(arguments).map(function(arg) {
      return arg && arg.toString ? arg.toString() : '';
    }).join(' ');
    if (
      msg.indexOf('deprecated') !== -1 ||
      msg.indexOf('defaultProps') !== -1 ||
      msg.indexOf('componentWillMount') !== -1 ||
      msg.indexOf('componentWillReceiveProps') !== -1 ||
      msg.indexOf('UNSAFE_') !== -1 ||
      msg.indexOf('Fledge') !== -1 ||
      msg.indexOf('SharedStorage') !== -1 ||
      msg.indexOf('StorageType') !== -1 ||
      msg.indexOf('navigator.storage') !== -1
    ) {
      return;
    }
    originalError.apply(console, arguments);
  };

  // Theme sync safely
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Fallback if storage or matchMedia throws
  }
})();
