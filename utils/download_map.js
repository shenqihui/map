// 下载文件。

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var queueAsync = require('queue-async');
var request = require('request');

// 文件路径处理，注意同步问题。
var mapDownLoadFloder = '../map_vender/';
function createFolder() {
  fs.readdir(mapDownLoadFloder, function(error, data) {
    // console.log(arguments);
    if(error) {
      fs.mkdir(path.join(__dirname, mapDownLoadFloder), function(err){
        if(err) {
          console.log(err);
        }
      });
    } else {
      downloadedFile = data;
      console.log(data);
    }
    mapTreeFunc();
  });
}
createFolder();

var queue = queueAsync();
var mapTree = require('../data/map_tree.json');
var downloadedFile = [];
var downloadMapJs = function(url, areaObj) {
  var localFile = url.replace('http://jvectormap.com/js/', '');
  if(downloadedFile.indexOf(localFile) < 0) {
    // 开始下载
    console.log('downloading', localFile);
    return request(url)
      .pipe(fs.createWriteStream(path.join(__dirname, mapDownLoadFloder, localFile)));
  } else {
    console.log('downloaded', localFile);
    return true;
  }
};

var areaType, area, areaObj, areaTypeObj;
function mapTreeFunc() {
  for(areaType in mapTree) {
    if(mapTree.hasOwnProperty(areaType)) {
      areaTypeObj = mapTree[areaType];
      for(area in areaTypeObj) {
        areaObj = areaTypeObj[area];
        if(areaObj.mill) {
          queue.defer(downloadMapJs, areaObj.mill, areaObj);
        } else {
          console.log('不存在 Mill ：'.red, areaType, area);
        }
        if(areaObj.merc) {
          queue.defer(downloadMapJs, areaObj.merc, areaObj);
        } else {
          console.log('不存在 Merc ：'.red, areaType, area);
        }
      }
    } 
  }
  return true;
}


queue.awaitAll(function(error, results) { console.log("all done!"); });