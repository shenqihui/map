(function() {
  var exampleJsonData = {
    "map":{"BD":4,"BE":6292,"BF":1,"BG":105,"BA":23,"BB":7,"BM":10,"BN":7,"BO":5,"JP":503,"BJ":5,"JM":11,"JO":20,"BR":400,"BS":8,"JE":16,"BY":62,"RU":3393,"RW":2,"RS":52,"RE":83,"A2":1,"RO":701,"GU":7,"GT":5,"GR":189,"GP":84,"BH":4,"GG":5,"GF":24,"GE":6,"GD":1,"GB":7439,"GA":2,"SV":5,"GL":6,"GI":7,"GH":2,"OM":6,"TN":4,"HR":71,"HT":1,"HU":1949,"HK":9314,"HN":3,"AD":15,"PR":29,"PT":368,"PY":31,"PA":34,"PF":27,"PE":18,"PK":3,"PH":164,"PL":2512,"PM":3,"EE":247,"EG":2,"ZA":161,"EC":66,"AL":3,"AO":9,"SB":1,"EU":8,"ZW":1,"KY":4,"ES":3728,"ME":3,"MD":29,"MG":4,"MF":5,"UY":5,"MC":35,"UZ":4,"MM":1,"MO":285,"MN":2,"MH":2,"US":15540,"MU":11,"MT":35,"MV":2,"MQ":31,"MP":1,"AU":3357,"UG":1,"TZ":1,"UA":265,"MX":521,"AT":1530,"FR":21016,"MA":24,"A1":4,"FI":187,"FO":14,"NI":2,"NL":22955,"NO":1344,"NA":4,"NC":3,"NE":1,"NG":2,"NZ":354,"NP":2,"CI":3,"CH":7338,"CO":93,"CN":5470,"CL":74,"CA":2751,"CD":1,"CZ":2982,"CY":94,"CR":24,"CU":1,"SY":1,"KG":1,"KE":15,"SR":8,"KH":19,"KN":2,"SK":621,"KR":9629,"SI":442,"KW":62,"SN":4,"SM":2,"SL":1,"SC":2,"KZ":60,"SA":59,"SG":1977,"SE":4433,"DO":34,"DK":5076,"DE":13965,"DZ":8,"MK":52,"LB":3,"LC":2,"LA":5,"TW":11788,"TT":18,"TR":349,"LK":4,"LI":36,"LV":88,"LT":162,"LU":263,"TJ":1,"TH":513,"TC":1,"AE":171,"VE":42,"IQ":4,"IS":71,"IR":4,"AM":3,"IT":2830,"VN":271,"AN":15,"AP":2,"AR":134,"IM":20,"IL":171,"AW":1,"IN":116,"AX":3,"AZ":6,"IE":260,"ID":201,"MY":1049,"QA":8,"MZ":1}
  };
  function buildMap(jsonData, mapType) {
    // build the world map
    // sort the data to map stat
    var $map = $('[data-chart=map]'),
      config = $map.data(),
      scaleBegin = '#ffffff',
      scaleEnd = '#e16769',
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
        backgroundColor: '#131313',
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

  $('#map-build').on('click', function() {
    var mapDataStr = $('#map-data').val();
    var mapData = {};
    var mapType = $('#map-select').val();
    try{
      mapData = JSON.parse(mapDataStr);
    } catch (e) {
      alert('数据出错了。用展示数据来显示下地图给你看看吧。');
      mapType = 'world_mill';
      mapData = exampleJsonData;
    }

    buildMap(mapData, mapType);
  });

  $('#map-build').trigger('click');
})();