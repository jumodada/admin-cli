'use strict'
const fs = require('fs')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo')

const notExistFold = async name => {
  return new Promise(resolve => {
    if (fs.existsSync(name)) {
      console.log(logSymbols.error, chalk.red('文件夹名已被占用，请更换名字重新创建'));
    } else {
      resolve();
    }
  });
};


const download = (ProjectName, api) => {
  return new Promise((resolve, reject) => {
    downloadGitRepo(api, ProjectName, {clone: true}, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

let updateJsonFile = (fileName, obj) => {

  return new Promise(resolve => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString()
      let json = JSON.parse(data)
      Object.keys(obj).forEach(key => {
        json[key] = obj[key]
      })
      fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8')
      resolve()
    }
  })
}

module.exports = {
  notExistFold,
  download,
  updateJsonFile
}
