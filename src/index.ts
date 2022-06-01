import prompts from 'prompts'
import minimist from 'minimist'
import { red, green, reset, blue } from 'kolorist'
import fs from 'fs'
import path from 'path'

const cwd = process.cwd()

/** 模板列表 */
const FRAMEWORKS = [
    {
        title: 'vue',
        name: 'vue',
        description: 'vue3 jsx vite 版本',
        color: green,
    },
    {
        title: 'rollup',
        name: 'rollup',
        description: '一个简单的 rollup 打包库',
        color: red,
    },
    {
        title: 'react',
        name: 'react',
        color: blue,
        variants: [
            {
                name: 'react-17',
                description: 'react-17 vite 版本',
                color: green,
            },
            {
                name: 'react-18',
                description: 'react-18 webpack5 版本',
                color: blue,
            },
        ],
    },
]

/** 解析所有模板列表到数组 */
const TEMPLATES = FRAMEWORKS.map(
    (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), [])

function copy(src: string, dest: string) {
    if (src.endsWith('.git') || src.endsWith('node_modules')) {
        return
    }

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
    // console.log('srcDir', srcDir)

    if (srcDir.endsWith('/node_modules')) {
        return
    }

    if (srcDir.endsWith('/.git')) {
        return
    }

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

    /** 创建目标文件夹 */
    let targetDir = argv._[0]

    /** 获取 -t 参数 */
    let template = argv.template || argv.t

    const defaultProjectName = !targetDir ? 'project' : targetDir

    let result: {
        [key: string]: any
    } = {}

    result = await prompts(
        [
            {
                type: targetDir ? null : 'text',
                name: 'projectName',
                message: reset('Project name:'),
                initial: defaultProjectName,
                onState: (state) =>
                    (targetDir = state.value.trim() || defaultProjectName),
            },
            {
                type: () =>
                    !fs.existsSync(targetDir) || isEmpty(targetDir)
                        ? null
                        : 'confirm',
                name: 'overwrite',
                message: () =>
                    (targetDir === '.'
                        ? 'Current directory'
                        : `Target directory "${targetDir}"`) +
                    ` is not empty. Remove existing files and continue?`,
            },
            {
                type: (_, { overwrite }: { overwrite?: boolean } = {}) => {
                    if (overwrite === false) {
                        throw new Error(red('✖') + ' Operation cancelled')
                    }
                    return null
                },
                name: 'overwriteChecker',
            },
            {
                type: () => 'text',
                name: 'packageName',
                message: reset('Package name:'),
                initial: () => toValidPackageName(targetDir),
                validate: (dir) =>
                    isValidPackageName(dir) || 'Invalid package.json name',
            },
            {
                type:
                    template && TEMPLATES.includes(template) ? null : 'select',
                name: 'framework',
                message:
                    typeof template === 'string' &&
                    !TEMPLATES.includes(template)
                        ? reset(
                              `"${template}" isn't a valid template. Please choose from below: `
                          )
                        : reset('Select a framework:'),

                initial: 0,
                choices: FRAMEWORKS.map((framework) => {
                    const frameworkColor = framework.color
                    return {
                        title: frameworkColor(framework.name),
                        value: framework,
                        description: framework.description,
                    }
                }),
            },
            {
                type: (framework) =>
                    framework && framework.variants ? 'select' : null,
                name: 'variant',
                message: reset('Select a variant:'),
                choices: (framework) =>
                    framework.variants.map((variant) => {
                        const variantColor = variant.color
                        return {
                            title: variantColor(variant.name),
                            value: variant.name,
                            description: variant.description,
                        }
                    }),
            },
        ],
        {
            onCancel: () => {
                throw new Error(red('✖') + ' Operation cancelled')
            },
        }
    )

    const { packageName, overwrite, framework, variant } = result

    const root = path.join(cwd, targetDir)

    if (overwrite) {
        emptyDir(root)
    } else if (!fs.existsSync(root)) {
        fs.mkdirSync(root)
    }

    /** 模板可以来源于 -t 参数和模板选择 */
    // if (!TEMPLATES.includes(template)) {
    //     template = framework
    // }

    let result_template = variant || template || framework.name

    // console.log('variant', variant)
    // console.log('')
    // console.log('framework', framework)
    // console.log('')
    // console.log('template', template)

    /** 所有的模板都以 template-* 为规范 */
    const templateDir = path.join(
        __dirname,
        '../template',
        `template-${result_template}`
    )

    const renameFiles = {
        _gitignore: '.gitignore',
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

let obj = [
    {
        title: 'react',
        value: 'react',
        color: blue,
        variants: [
            {
                name: 'react-17-vite',
                display: 'vite',
                color: green,
            },
            {
                name: 'react-18-webpack',
                display: 'webpack',
                color: blue,
            },
        ],
    },
]
