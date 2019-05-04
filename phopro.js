const fs    = require('fs');
const recur = require('recursive-readdir');
const args  = require('command-line-args');
const lib   = require('./lib');

const optionDefinitions = [
  { name: 'dir', alias: 'd', type: String },
  { name: 'usedays', alias: 'u', type: Boolean },
  { name: 'output', alias: 'o', type: String, defaultOption: 'out' },
  { name: 'verbose', alias: 'v', type: Boolean }
];
global._options = args(optionDefinitions);

if(!_options.dir){
  console.log('Please specify a directory with the -d flag');
} else if(!fs.existsSync(_options.dir)){
  console.log('Input folder does not exist');
} else {
  if(!_options.output){ _options.output = 'out'; }
  recur(_options.dir).then((files, err) => {
    if(err){ return console.error(err); }
    if(files.length){
      lib.processFiles(files);
    } else {
      console.log('No files found');
    }
  });
}
