// 获取线上所有的 map 数据。
// 打开 http://jvectormap.com/maps/world/africa/ ，然后运行，即可。可能会出现部分无法加载的问题，所以，要在当前页面执行很多次。

var tree = tree || {};

var matchDownloadRegex = /<p>\s*<a href\=\"[^"]*\"\>Download<\/a>\s\(\d+\s*KB\)\s*<\/p>/igm;
var matchARegex = /<a.*?>.*?<\/a>/igm;
var matchMapType = /\'addMap\'\,\s*\'([^']+)\'/igm;
$('#sidebar>ul>li').each(function(index, li) {
  var folder = $('>a', $(this)).text().toLowerCase();
  var elem = tree[folder] = tree[folder] || {};
  $('>ul>li>a', $(this)).each(function() {
    var $a = $(this);
    var text = $a.text();
    var href = this.href;
    var arrElem = elem[text] = elem[text] || {};
    arrElem.name = text;
    arrElem.href = href;
    $.ajax({
      url: href,
      type: 'GET',
      dataType: 'html',
    }).then(function(data) {
      data.match(matchDownloadRegex).forEach(function(elem) {
        elem.match(matchARegex).forEach(function(elem) {
          var href = $(elem).get(0).href;
          var type = href.indexOf('mill') > 0 ? 'mill' : 'merc';
          // console.log(href, type);
          arrElem[type] = href;
          if(!arrElem[type + 'Name']) {
            $.ajax({
              url: href,
              type: 'GET',
              dataType: 'text',
            }).then(function(data) {
              var mapName = matchMapType.exec(data);
              window.data2 = data;
              if(mapName && mapName.length > 1) {
                arrElem[type + 'Name'] = mapName[1];
              } else {
                console.log(mapName, folder, text, href, 'need to retry.');
              }
            }, function() {
              console.error('get map name error', folder, text, href);
            });
          }
        });
      });
    }, function() {
      console.error('get map url error', folder, text, href);
    });
    
  });
});