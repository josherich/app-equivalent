function asyncLoadScript(url, callback) {
  let d = document;
  let t = 'script';
  let o = d.createElement(t);
  let s = d.getElementsByTagName(t)[0];
  o.src = url;
  if (window) { o.addEventListener('load', (e) => { callback && callback(null, e); }, false); }
  s.parentNode.insertBefore(o, s);
}

function createFromString(str) {
  let wrapper = document.createElement('div');
  wrapper.innerHTML = str.trim();
  return wrapper.firstChild;
}

var regionSelect = document.querySelector('#region_select');
var categorySelect = document.querySelector('#category_select');
var platformSelect = document.querySelector('#platform_select');

var listCon = document.querySelector('#list');
var regionFilter = 'US';
var categoryFilter = 'SNS';
var platformFilter = 'ios';

function parseApps(list) {
  var regions = [], categories = [];
  list.map(function(app) {
    if (regions.indexOf(app['region']) == -1) {
      regions.push(app['region']);
    }
    if (categories.indexOf(app['category']) == -1) {
      categories.push(app['category']);
    }
  });
  return {
    regions: regions,
    categories: categories
  }
}

function render() {
  var parsed = parseApps(data['data']);
  console.log('selectors', parsed);

  parsed.regions.map(function(region) {
    var el = document.createElement('div');
    el.id = region;
    el.classList.add('region-filter');
    el.textContent = region;
    regionSelect.appendChild(el);
  });
  regionSelect.addEventListener('click', onChange);

  parsed.categories.map(function(category) {
    var el = document.createElement('div');
    el.id = category;
    el.classList.add('category-filter');
    el.textContent = category;
    categorySelect.appendChild(el);
  });
  categorySelect.addEventListener('click', onChange);

  platformSelect.addEventListener('click', onChange);

  onChange({});
}

function onChange(e) {
  if (e.target){
    var children = e.target.parentNode.children;
    for (var i = 0, l = children.length; i < l; i++) {
      children[i].classList.remove('selected');
    }
  }

  var filter = e.target && e.target.className;
  if (filter) {
    if (filter.indexOf('category-filter') > -1) {
      categoryFilter = e.target.id;
    } else if (filter.indexOf('region-filter') > -1) {
      regionFilter = e.target.id;
    } else if (filter.indexOf('platform-filter') > -1) {
      platformFilter = e.target.id;
    }
  }

  document.querySelector('#' + regionFilter).classList.add('selected');
  document.querySelector('#' + categoryFilter).classList.add('selected');
  document.querySelector('#' + platformFilter).classList.add('selected');

  var list = filterApps();
  console.log('changed', list)
  showAppList(list);
}

function filterApps() {
  var region = regionFilter;
  var category = categoryFilter;
  console.log(region, category);
  var list = data['data'];
  return list.filter(function(app) {
    return app['region'] === region && app['category'] === category;
  });
}

function showAppList(list) {
  listCon.innerHTML = '';
  list.map(function(app) {
    var el = createFromString('<a href="' + app[platformFilter + '_url'] + '"><img src="' + app['icon'] + '"/><div class="app-title">'+ app['name'] + '</div></a>');
    el.id = app['name'];
    el.className = 'list-item';
    listCon.appendChild(el);
  });
}

asyncLoadScript('/assets/js/data.js', render);