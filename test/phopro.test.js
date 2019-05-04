const expect = require('chai').expect;
const phopro = require('../lib');
// const fs = require('fs');
const exif = require('exif');

const now = new Date('04 May 2019 12:09 UTC');
const testfile = './test/test.jpg';

describe('Phopro', () => {

  it("Process file birth time", (done) => {
    let res = phopro.processBirthTime(now);
    expect(typeof res).to.equal('object');
    expect(res).to.have.property('year');
    expect(res.year).to.equal('2019');
    expect(res).to.have.property('month');
    expect(res.month).to.equal('05');
    expect(res).to.have.property('day');
    expect(res.day).to.equal('04');
    done();
  });

  it("Process file create time", (done) => {
    exif({ image : testfile }, (err, exd) => {
      if(err){ console.error(err); }
      let res = phopro.processCreateDate(exd.exif.CreateDate);
      expect(typeof res).to.equal('object');
      expect(res).to.have.property('year');
      expect(res.year).to.equal('2006');
      expect(res).to.have.property('month');
      expect(res.month).to.equal('09');
      expect(res).to.have.property('day');
      expect(res.day).to.equal('09');
      done();
    });
  });


});