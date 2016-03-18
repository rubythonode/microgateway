'use strict';

const cert =  require('./cert')
const edgeconfig = require('microgateway-config');
const prompt = require('cli-prompt');
const path = require('path');
const apigeetool = require('apigeetool');
const _ = require('lodash');
const async = require('async');
const util = require('util');

const targetDir = path.join(__dirname, '..','..', 'config');

const targetPath = path.join( targetDir, 'cache-config.yaml');
const agent = require('../../lib/server')(targetPath);
module.exports.installCert = function(options) {
  if (!options.username) {
    return optionError.bind(this)('username is required');
  }
  if (!options.org) {
    return optionError.bind(this)('org is required');
  }
  if (!options.env) {
    return optionError.bind(this)('env is required');
  }
  const fx = (options) => {
    const config = edgeconfig.load({source: targetPath});
    cert(config).installCertWithPassword(options, (err, res)=> {
      if (err) {
        return console.error(err, 'failed to update cert')
      }
      console.log('installed cert');
    });
  }


  promptForPassword('org admin password: ', options, fx);
};

module.exports.checkCert = function(options) {

  if (!options.username) { return optionError.bind(this)('username is required'); }
  if (!options.org) { return optionError.bind(this)('org is required'); }
  if (!options.env) { return optionError.bind(this)('env is required'); }


  const fx =(options) =>{
    const config = edgeconfig.load({source:targetPath});
    cert(config).checkCertWithPassword(options, (err,res)=>{
      if(err){
        return console.error(err,'failed to update cert')
      }
      console.log('installed cert');
    });
  }
  promptForPassword('org admin password: ', options, fx);


}

module.exports.deleteCert = function(options) {

  if (!options.username) { return optionError.bind(this)('username is required'); }
  if (!options.org) { return optionError.bind(this)('org is required'); }
  if (!options.env) { return optionError.bind(this)('env is required'); }

  promptForPassword('org admin password: ', options, (options)=>{
    const config = edgeconfig.load({source:targetPath});

    cert(config).deleteCertWithPassword(options,function(err,msg){
      err && console.error(err);
      msg && console.log(msg);
    })
  });
};

module.exports.retrievePublicKey = function(options) {

  if (!options.org) { return optionError.bind(this)('org is required'); }
  if (!options.env) { return optionError.bind(this)('env is required'); }

  const config = edgeconfig.load({source:targetPath});
  cert(config).retrievePublicKey(options,(err,certificate)=>{
    if(err){
      return console.error(err,'failed to retrieve public key')
    }
    console.log('succeeded');
    console.log(certificate);
  })
};


module.exports.retrievePublicKeyPrivate = function(options) {

  if (!options.org) { return optionError.bind(this)('org is required'); }
  if (!options.env) { return optionError.bind(this)('env is required'); }

  const config = edgeconfig.load({source:targetPath});
  cert(config).retrievePublicKeyPrivate(options,(err,certificate)=>{
    if(err){
      return console.error(err,'failed to retrieve public key')
    }
    console.log('succeeded');
    console.log(certificate);
  })
}




// prompt for a password if it is not specified
function promptForPassword(message, options, continuation) {
  if (options.password) {
    continuation(options);
  } else {
    prompt.password(message, function(pw) {
      options.password = pw;
      continuation(options);
    });
  }
}
function optionError(message) {
  console.error(message);
  this.help();
}

function printError(err) {
  if (err.response) {
    console.log(err.response.error);
  } else {
    console.log(err);
  }
}