const exif   = require('exif').ExifImage;
const fs     = require('fs');
const path   = require('path');
const mkdirp = require('mkdirp');

module.exports = {

  copyFile : function(f, dateobj){
    const filename = path.basename(f);
    let dir = [_options.output, dateobj.year, dateobj.month];
    if(_options.usedays){ dir.push(dateobj.day); }
    dir = dir.join(path.sep);
    mkdirp(dir, function (err){
      if(err) { return console.error(err); }
      else {
        if(_options.verbose){ console.log(filename +' done!'); }
        return fs.copyFileSync(f, dir +'/'+ filename);
      }
    });
  },

  processBirthTime : function(t){
    const halfs = t.toISOString().split('T');
    const parts = halfs[0].split('-');
    return { year : parts[0], month : parts[1], day : parts[2] };
  },

  processCreateDate : function(t){
    const halves = String(t).split(' ');
    const parts = halves[0].split(':');
    return { year: parts[0], month: parts[1], day: parts[2] };
  },

  noCreateDate : function(f){
    console.log({ f });
    fs.stat(f, (err, stats) => {
      console.log({ stats });
      return this.copyFile(f, this.processBirthTime(stats.birthtime))
    });
  },

  createDateExists : function(f, t){
    return this.copyFile(f, this.processCreateDate(t))
  },

  processFiles : function(files){
    files.forEach((f) => {
      let ex = new exif({ image : f }, (err, exd) => {
        if(err){ // No EXIF found
          return this.noCreateDate(f);
        } else if (!exd.hasOwnProperty('exif') || !exd.exif.hasOwnProperty('CreateDate')){ // No CreateDate found
          return this.noCreateDate(f);
        } else {
          return this.createDateExists(f, exd.exif.CreateDate);
        }
      });
    });
  }

};