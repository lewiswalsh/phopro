const recur  = require('recursive-readdir');
const exif   = require('exif').ExifImage;
const fs     = require('fs');
const path   = require('path');
const mkdirp = require('mkdirp');
const args   = require('command-line-args');

const optionDefinitions = [
  { name: 'dir', alias: 'd', type: String },
  { name: 'usedays', alias: 'u', type: Boolean },
  { name: 'output', alias: 'o', type: String, defaultOption: 'out' },
  { name: 'verbose', alias: 'v', type: Boolean }
];
const options = args(optionDefinitions);

function copyFile(f, dateobj){
  const filename = path.basename(f);
  let dir = [options.output, dateobj.year, dateobj.month];
  if(options.usedays){ dir.push(dateobj.day); }
  dir = dir.join(path.sep);
  mkdirp(dir, function (err){
    if(err) { return console.error(err); }
    else {
      fs.copyFileSync(f, dir +'/'+ filename);
      if(options.verbose){ console.log(filename +' done!'); }
    }
  });
}

function processBirthTime(t){
  const halves = t.toISOString().split('T');
  const parts = halves[0].split('-');
  return { year : parts[0], month : parts[1], day : parts[2] };
}

function processCreateDate(t){
  const halves = String(t).split(' ');
  const parts = halves[0].split(':');
  return { year: parts[0], month: parts[1], day: parts[2] };
}

function noCreateDate(f){
  fs.stat(f, (err, stats) => {
    copyFile(f, processBirthTime(stats.birthtime))
  });
}

function createDateExists(f, t){
  copyFile(f, processCreateDate(t))
}

function processFiles(files){
  files.forEach((f) => {
    let ex = new exif({ image : f }, (err, exd) => {
      if(err){ // No EXIF found
        noCreateDate(f);
      } else if (!exd.hasOwnProperty('exif') || !exd.exif.hasOwnProperty('CreateDate')){ // No CreateDate found
        noCreateDate(f);
      } else {
        createDateExists(f, exd.exif.CreateDate);
      }
    });
  });
}

if(!options.dir){
  console.log('Please specify a directory with the -d flag');
} else if(!fs.existsSync(options.dir)){
  console.log('Input folder does not exist');
} else {
  if(!options.output){
    options.output = 'out';
  }
  recur(options.dir).then((files, err) => {
    if(err){ return console.error(err); }
    if(files.length){
      processFiles(files);
    } else {
      console.log('No files found');
    }
  });
}
