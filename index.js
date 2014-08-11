! function(name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function') define(definition);
  else this[name] = definition();
}('cookieMonster', function() {

  var cookies = {
    removeItem: function(sKey, sPath, sDomain) {
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    keys: function() {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };


  function subdomains(domain) {
    var subdomains = [];
    var strs = domain.split(".");
    var length = strs.length;
    var first = true;
    var temp = '';

    for (var i = length - 1; i >= 0; i--) {
      if (first) {
        temp = strs[i];
        first = false;
      } else {
        temp = '.' + temp;
        temp = strs[i] + temp;
      }

      if (i < length - 1) {
        subdomains.push(temp);
        subdomains.push('.' + temp);
      }
    }
    return subdomains;
  }

  function deleteCookie(name) {
    var possibleDomains = subdomains(window.location.host);
    for (var i = 0; i < possibleDomains.length; i++) {
      cookies.removeItem(name, '/', possibleDomains[i]);
      console.log('delete cookie: %s %s', name, possibleDomains[i])
    };
  }

  return {
    initWithWhiteList: function(whiteList) {
      if (!whiteList || whiteList.length == 0) {
        return;
      }
      var validCookies = {};
      for (var i = 0; i < whiteList.length; i++) {
        var cookie = whiteList[i];
        validCookies[cookie.name] = cookie;
      };

      var allCookies = cookies.keys();
      if (!allCookies || allCookies.length == 0) {
        return;
      }
      for (var i = 0; i < allCookies.length; i++) {
        var cookieName = allCookies[i];
        var validCookie = validCookies[cookieName];
        if (validCookie && window.location.host.indexOf(validCookie.domain) > -1) {
          continue;
        }
        deleteCookie(cookieName);
      };
    }
  }

});