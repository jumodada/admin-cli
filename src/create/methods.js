const logSymbols = require('log-symbols')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const {download, updateJsonFile} = require('../util')
const validate = require('validate-npm-package-name')
const fs = require('fs')
const inquirer = require('inquirer')
const copyFiles = require('copyfiles')
const shell = require('shelljs')
const libraryURL = 'direct:https://github.com/PanJiaChen/vue-element-admin.git'
let projectName = ''
const source = path.resolve(__dirname, '../template/**/*')
let config = {
    all: true,
    up: source.split('/').length - 2
}

const promptListByProjectName = [
    {
        type: 'input',
        name: 'name',
        message: 'please enter project name',
    }
]
const promptListByPackage = [
    {
        type: 'input',
        name: 'description',
        message: 'Please enter the project description: '
    }, {
        type: 'input',
        name: 'author',
        message: 'Please enter the author name: '
    }
]

const validator = (name, resolve,createFn) => {
    const result = validate(name)
    if (!result.validForNewPackages) {
        console.error(chalk.red(`不正确的项目命名格式: "${name}"`))
        result.errors && result.errors.forEach(err => {
            console.error(chalk.red.dim('Error: ' + err))
        })
        result.warnings && result.warnings.forEach(warn => {
            console.error(chalk.red.dim('Warning: ' + warn))
        })
        return createFn()
    }
    if (fs.existsSync(name)) {
        console.log(logSymbols.error, chalk.red('There is a folder with the same name, please change the file name'))
        return createFn()
    }
    projectName = name
    resolve()
}
const validateProjectName = (name, createFn) => new Promise(resolve => {
    if (name) {
        validator(name,resolve,createFn)
    } else {
        inquirer.prompt(promptListByProjectName)
            .then(answer => {
                validator(answer.name,resolve,createFn)
            })
    }
})

const runInquirer = () => inquirer.prompt(promptListByPackage)

// const downloadLibrary = (answer) => {
//     let loading = ora('脚手架下载中...')
//     loading.start('脚手架下载中...')
//     return download(projectName, libraryURL).then(() => {
//         loading.succeed('脚手架下载完成')
//         const fileName = `${projectName}/package.json`
//         return {fileName, answer}
//     }, () => {
//         loading.fail('脚手架下载失败')
//         resetName()
//     })
// }


const copyTemplate = (answer) => new Promise(resolve => {
    const fileName = `${projectName}/package.json`
    copyFiles([source, projectName], config,
        e => {
            if (e) process.exit(1)
            let settingPath = path.resolve(projectName, 'src/settings.js')
            let content = fs.readFileSync(settingPath, 'utf8')
            fs.writeFileSync(settingPath, content)
            resolve({fileName, answer})
        })
})

const editLibrary = ({fileName, answer}) => {
    answer.name = projectName
    updateJsonFile(fileName, answer).then(() => {
        console.log(logSymbols.success, chalk.green('📦  Installing additional dependencies...'))
    }).finally(() => resetName())
}

const installDep = () => {
    const lqProcess = ora(`🎉  Successfully created project ${chalk.yellow(projectName)}`)
    lqProcess.start()
    //'npm i --registry=http://192.168.1.103:8081/repository/npm-elementadmin-group/'
    let cmd = 'cd ' + projectName + ' && ' + 'npm i'
    console.log(cmd)
    if (shell.exec(cmd).code !== 0) {
        lqProcess.fail()
        console.error(chalk.red('❌ create failed'))
        process.exit(1)
    }
    lqProcess.succeed()
}

const resetName = () => projectName = ''

module.exports = {
    validateProjectName,
    runInquirer,
    editLibrary,
    copyTemplate,
    installDep
}
