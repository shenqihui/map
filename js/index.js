
var example = {
  World: {
    "map":{"BD":4,"BE":6292,"BF":1,"BG":105,"BA":23,"BB":7,"BM":10,"BN":7,"BO":5,"JP":503,"BJ":5,"JM":11,"JO":20,"BR":400,"BS":8,"JE":16,"BY":62,"RU":3393,"RW":2,"RS":52,"RE":83,"A2":1,"RO":701,"GU":7,"GT":5,"GR":189,"GP":84,"BH":4,"GG":5,"GF":24,"GE":6,"GD":1,"GB":7439,"GA":2,"SV":5,"GL":6,"GI":7,"GH":2,"OM":6,"TN":4,"HR":71,"HT":1,"HU":1949,"HK":9314,"HN":3,"AD":15,"PR":29,"PT":368,"PY":31,"PA":34,"PF":27,"PE":18,"PK":3,"PH":164,"PL":2512,"PM":3,"EE":247,"EG":2,"ZA":161,"EC":66,"AL":3,"AO":9,"SB":1,"EU":8,"ZW":1,"KY":4,"ES":3728,"ME":3,"MD":29,"MG":4,"MF":5,"UY":5,"MC":35,"UZ":4,"MM":1,"MO":285,"MN":2,"MH":2,"US":15540,"MU":11,"MT":35,"MV":2,"MQ":31,"MP":1,"AU":3357,"UG":1,"TZ":1,"UA":265,"MX":521,"AT":1530,"FR":21016,"MA":24,"A1":4,"FI":187,"FO":14,"NI":2,"NL":22955,"NO":1344,"NA":4,"NC":3,"NE":1,"NG":2,"NZ":354,"NP":2,"CI":3,"CH":7338,"CO":93,"CN":5470,"CL":74,"CA":2751,"CD":1,"CZ":2982,"CY":94,"CR":24,"CU":1,"SY":1,"KG":1,"KE":15,"SR":8,"KH":19,"KN":2,"SK":621,"KR":9629,"SI":442,"KW":62,"SN":4,"SM":2,"SL":1,"SC":2,"KZ":60,"SA":59,"SG":1977,"SE":4433,"DO":34,"DK":5076,"DE":13965,"DZ":8,"MK":52,"LB":3,"LC":2,"LA":5,"TW":11788,"TT":18,"TR":349,"LK":4,"LI":36,"LV":88,"LT":162,"LU":263,"TJ":1,"TH":513,"TC":1,"AE":171,"VE":42,"IQ":4,"IS":71,"IR":4,"AM":3,"IT":2830,"VN":271,"AN":15,"AP":2,"AR":134,"IM":20,"IL":171,"AW":1,"IN":116,"AX":3,"AZ":6,"IE":260,"ID":201,"MY":1049,"QA":8,"MZ":1}
  },
  China: {"map": {"CN-34": 586, "CN-53": 1255, "CN-50": 2090, "CN-51": 1505, "CN-31": 1176, "CN-54": 95, "CN-33": 3929, "CN-14": 1688, "CN-15": 1451, "CN-12": 396, "CN-13": 2575, "CN-11": 3921, "CN-52": 958, "CN-35": 4167, "CN-36": 927, "CN-37": 3818, "CN-44": 8536, "CN-41": 1184, "CN-43": 2367, "CN-42": 702, "CN-45": 1142, "CN-32": 3958, "CN-46": 110, "CN-65": 258, "CN-64": 96, "CN-63": 305, "CN-62": 355, "CN-61": 1552, "CN-23": 1095, "CN-22": 1834, "CN-21": 3821 }}
};
function buildMap(jsonData, mapType, option) {
  // build the world map
  // sort the data to map stat
  var $map = $('[data-chart=map]'),
    config = $map.data(),
    scaleBegin = option.scaleBegin || '#ffffff',
    scaleEnd = option.scaleEnd || '#e16769',
    scale = [scaleBegin, scaleEnd],
    mapData = jsonData.map,
    rangeArr = [];
  for(var i in mapData){
    if(mapData.hasOwnProperty(i)){
      rangeArr.push(mapData[i]);
    }
  }
  // 处理特殊数据。
  // CN-35 福建省的数据
  if(mapData['CN-35']) {
    mapData['CN-'] = mapData['CN-35'];
  }
  // 处理特殊数据 end 。
  $map.empty();
  if ($map.length > 0) {
    $map.vectorMap({
      map: mapType || 'world_mill',
      backgroundColor: option.backgroundColor || '#131313',
      onRegionTipShow: function (e, el, code) {
        return el.html(el.html() + ' (' + (jsonData.map[code] || 0) + ')');
      },
      series: {
        regions: [{
          values: mapData,
          scale: scale,
          normalizeFunction: 'polynomial'
        }],
        markers: [{
          attribute: 'fill',
          scale: scale,
          normalizeFunction: 'polynomial',
          values: rangeArr,
          legend: {
            vertical: true
          }
        }]
      },
    });
  }
}

function buildMapFormat(mapDataStr, mapType, option) {
  var mapData = {};
  try{
    mapData = JSON.parse(mapDataStr);
  } catch (e) {
    alert('数据出错了。用展示数据来显示下地图给你看看吧。');
    mapType = 'world_mill';
    mapData = example.World;
  }

  buildMap(mapData, mapType, option);
}



var app = angular.module('app', ['angularLoad']);
app.controller('map', function($scope, $http, angularLoad) {

  // 例子数据
  $scope.example = example;


  $scope.map = {};
  $scope.map.width = $('#map-container').width();
  if($scope.map.width > 600) {
    $scope.map.width = 600;
  }
  $scope.map.height = parseInt($scope.map.width * 9 / 16, 10);
  $scope.map.scaleBegin = '#ffffff';
  $scope.map.scaleEnd = '#e16769';
  $scope.map.backgroundColor = '#131313';
  $scope.map.color = '#ffffff';
  $scope.map.getColor = function () {
    $scope.map.color = tinycolor($scope.map.backgroundColor).getBrightness() > 50 ? '#000000':'#ffffff';
    // console.log('getBrightness', tinycolor($scope.map.backgroundColor).getBrightness());
    $scope.$emit('BuildMapEvent', {});
    return $scope.map.color;
  };

  $scope.$on('BuildMapEvent', function(event, option) {
    option = option || {}
    option.scaleBegin = $scope.map.scaleBegin;
    option.scaleEnd = $scope.map.scaleEnd;
    option.backgroundColor = $scope.map.backgroundColor;
    option.mapData = $scope.mapData;
    option.area = $scope.mapTree[$scope.areaType][$scope.area][$scope.mapType + 'Name'];
    buildMapFormat(option.mapData, option.area, option);
  });

  $scope.$on('MapJsLoadEvent', function(event, option) {
    var areaObj = $scope.mapTree[option.areaType][option.area];
    var href = areaObj[option.mapType].replace('http://jvectormap.com/js/', 'map_vender/');
    var cb = function() {
      if(option && option.success && option.success.call) {
        option.success.call(this);
      }
    };
    if(!areaObj[option.mapType + 'Load']) {
      angularLoad.loadScript(href).then(function() {
        areaObj[option.mapType + 'Load'] = true;
        cb();
      }).catch(function() {
        alert(href + ' 加载失败');
      });
    } else {
      cb();
    }
  });

  // $scope.$on('GetAreaJsEvent', function(event, option) {
  //   $scope.$emit('MapJsLoadEvent', option);
  // });

  $scope.emitBuildMap = function() {
    $scope.$emit('BuildMapEvent', {});
  };

  $scope.getAreaJs = function() {
    $scope.$emit('MapJsLoadEvent', {
      mapType: $scope.mapType,
      areaType: $scope.areaType,
      area: $scope.area
    });
  };

  $scope.useExampleData = function(areaType, area, mapData) {
    $scope.areaType = areaType;
    $scope.area = area;
    $scope.mapData = JSON.stringify(mapData);
    $scope.$emit('MapJsLoadEvent', {
      mapType: $scope.mapType,
      areaType: $scope.areaType,
      area: $scope.area,
      success: function() {
        $scope.emitBuildMap();
      }
    });
  };

  $http.get('data/colors.json').success(function(data) {
    $scope.mapExampleColors = data;
  });
  $scope.useExampleColor = function(colors) {
    var colorArr = colors.split(',');
    $scope.map.scaleBegin = colorArr[0];
    $scope.map.scaleEnd = colorArr[1];
    $scope.map.backgroundColor = colorArr[2];
    $scope.map.color = colorArr[3];
    $scope.emitBuildMap();
  };

  $http.get('data/map_tree.json').success(function(data) {
    $scope.mapTree = data;
    window.mapTree = $scope.mapTree;

    // 初始化渲染下图片。
    $scope.mapType = 'mill';
    $scope.areaType = 'world';
    $scope.area = 'World';
    $scope.mapTree[$scope.areaType][$scope.area][$scope.mapType + 'Load'] = true;

    $scope.$emit('MapJsLoadEvent', {
      mapType: $scope.mapType,
      areaType: $scope.areaType,
      area: $scope.area
    });
    $scope.emitBuildMap();
  });
  $scope.mapData = JSON.stringify(example.World);

  window.testMapFile = function() {
    for(var type in $scope.mapTree) {
      if($scope.mapTree.hasOwnProperty(type)) {
        for(var area in $scope.mapTree[type]) {
          $.getScript($scope.mapTree[type][area].mill.replace('http://jvectormap.com/js/', 'map_vender/'));
          $.getScript($scope.mapTree[type][area].merc.replace('http://jvectormap.com/js/', 'map_vender/'));
        }
      }
    }
  };
});