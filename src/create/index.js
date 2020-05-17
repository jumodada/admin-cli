'use strict';

const {validateProjectName,runInquirer,editLibrary,copyTemplate,installDep} = require('./methods')

const create = (name) => new Promise(resolve => {
    validateProjectName(name,create)  // 文件名重叠和格式检查
        .then(() => runInquirer()) //运行命令行
        .then(answer => copyTemplate(answer)) //拷贝脚手架
        .then((res) => editLibrary(res)) //更新脚手架配置
        .then(() => installDep()) //安装依赖

})


module.exports = create;
