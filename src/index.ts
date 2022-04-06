import prompts from "prompts"
import minimist from 'minimist'
import { red, green, reset, blue } from 'kolorist'
import fs from 'fs'
import path from 'path'

const cwd = process.cwd()

const TEMPLATES = [
    {
        title: "vue",
        value: "vue",
        color: green,
    },
    {
        title: "rollup",
        value: "rollup",
        color: red
    },
    {
        title: "react",
        value: "react",
        color: blue
    }
]

function copy(src: string, dest: string) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function isValidPackageName(projectName: string) {
    return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
        projectName
    )
}

function toValidPackageName(projectName: string) {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z0-9-~]+/g, '-')
}

function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}


function isEmpty(path: string) {
    return fs.readdirSync(path).length === 0
}

function emptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
        return
    }
    for (const file of fs.readdirSync(dir)) {
        const abs = path.resolve(dir, file)
        // baseline is Node 12 so can't use rmSync :(
        if (fs.lstatSync(abs).isDirectory()) {
            emptyDir(abs)
            fs.rmdirSync(abs)
        } else {
            fs.unlinkSync(abs)
        }
    }
}


async function init() {
    const argv = minimist(process.argv.slice(2), { string: ['_'] })

    let targetDir = argv._[0]
    let template = argv.template || argv.t

    const defaultProjectName = !targetDir ? 'project' : targetDir

    let result: {
        [key: string]: any
    } = {}

    result = await prompts([
        {
            type: targetDir ? null : 'text',
            name: 'projectName',
            message: reset('Project name:'),
            initial: defaultProjectName,
            onState: (state) =>
                (targetDir = state.value.trim() || defaultProjectName)
        },
        {
            type: () =>
                !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
            name: 'overwrite',
            message: () =>
                (targetDir === '.'
                    ? 'Current directory'
                    : `Target directory "${targetDir}"`) +
                ` is not empty. Remove existing files and continue?`
        },
        {
            type: (_, { overwrite }: { overwrite?: boolean } = {}) => {
                if (overwrite === false) {
                    throw new Error(red('✖') + ' Operation cancelled')
                }
                return null
            },
            name: 'overwriteChecker'
        },
        {
            type: () => 'text',
            name: 'packageName',
            message: reset('Package name:'),
            initial: () => toValidPackageName(targetDir),
            validate: (dir) =>
                isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
            type: template && TEMPLATES.some((v) => v.title === template) ? null : 'select',
            name: "framework",
            message:
                typeof template === 'string' && !TEMPLATES.some((v) => v.title === template)
                    ? reset(
                        `"${template}" isn't a valid template. Please choose from below: `
                    )
                    : reset('Select a framework:'),

            initial: 0,
            choices: TEMPLATES
        }
    ], {
        onCancel: () => {
            throw new Error(red('✖') + ' Operation cancelled');
        },
    })

    const { packageName, framework, overwrite } = result

    const root = path.join(cwd, targetDir)

    if (overwrite) {
        emptyDir(root)
    } else if (!fs.existsSync(root)) {
        fs.mkdirSync(root)
    }

    /** 模板可以来源于 -t 参数和模板选择 */
    if (!TEMPLATES.some((v) => v.title === template)) {
        template = framework
    }

    let result_template = framework || template

    /** 所有的模板都以 template-* 为规范 */
    const templateDir = path.join(__dirname, '../template', `template-${result_template}`)

    const renameFiles = {
        _gitignore: '.gitignore'
    }

    const write = (file: string, content?: string) => {
        const targetPath = renameFiles[file]
            ? path.join(root, renameFiles[file])
            : path.join(root, file)

        if (content) {
            fs.writeFileSync(targetPath, content)
        } else {
            copy(path.join(templateDir, file), targetPath)
        }
    }

    const files = fs.readdirSync(templateDir)

    for (const file of files.filter((f) => f !== 'package.json')) {
        write(file)
    }

    const pkg = require(path.join(templateDir, `package.json`))

    pkg.name = packageName || targetDir

    write('package.json', JSON.stringify(pkg, null, 2))

}

init().catch((error) => {
    console.log(error)
})