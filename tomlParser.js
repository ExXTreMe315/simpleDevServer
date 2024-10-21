import * as fs from 'fs'
import tomlConfig from './toml.config.json' assert { type: 'json' }

//define defaults
let resources = tomlConfig.fileConfig.dependencies
let subFolders = []
let subFolderIndex = 0

//Functions
function loadResources(folder) {
    fs.readdir(folder, (err, folderResources) => {
        let i = 0
        for (const resource of folderResources) {
            i++
            if (checkResource(resource, folder)) {
                if (folder === tomlConfig.fileConfig.resourcesPath) {
                    resources.push(resource)
                } else {
                    resources.push(folder.split(tomlConfig.fileConfig.resourcesPath)[1] + resource)
                }
            }
            if (i === folderResources.length) { //trigger only when last resource
                if (subFolderIndex === subFolders.length) {
                    renderToml()
                    return
                }
                loadResources(subFolders[subFolderIndex])
                subFolderIndex++
            }
        }
    })
}

function checkResource(resource, resourcePath) {
    if (tomlConfig.fileConfig.dependencies.includes(resource)) return false //dependencies ar added by default
    if (tomlConfig.fileConfig.lastResource.includes(resource)) return false //some resources like frameworks should start at last
    if (resource === '.gitkeep') return false //.gitkeeps are no resources
    if (resource.startsWith(tomlConfig.fileConfig.subFolderPrefix)) { //add subFolders later
        subFolders.push(resourcePath + resource + '/')
        return false
    }
    return true
}

async function renderToml() {
    await addLine('#This toml was created by Alt:V-TomlParser')
    await addServerParameter()
    await addResources()
}

async function addServerParameter() {
    for (let [key, value] of Object.entries(tomlConfig.tomlConfig)) {
        switch (typeof value) {
            case 'string':
                await addLine(`${key} = "${value}"`)
                break
            case 'object':
                await addLine(`${key} = ${JSON.stringify(value)}`)
                break
            default:
                await addLine(`${key} = ${value}`)
                break
        }
    }
}

async function addResources() {
    resources = resources.concat(tomlConfig.fileConfig.lastResource)
    let resourceString = `[\n${resources.map(item => `"${item}"`).join(', \n')}\n]\n`
    fs.appendFile(tomlConfig.fileConfig.tomlName + '.toml', `resources = ${resourceString}`, (err) => {
        if (err) {
            throw err
        }
    })
}

async function addLine(line) {
    fs.appendFile(tomlConfig.fileConfig.tomlName + '.toml', `${line}\n`, (err) => {
        if (err) {
            throw err
        }
    })
}

//Execute
fs.unlinkSync(tomlConfig.fileConfig.tomlName + '.toml')
loadResources(tomlConfig.fileConfig.resourcesPath)
