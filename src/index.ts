import prompts from "prompts"
import minimist from 'minimist'

async function init() {

    const argv = minimist(process.argv.slice(2), { string: ['_'] })

    let result: {
        [key: string]: any
    } = {}

    console.log(argv)

    const response = await prompts([
        {
            type: 'confirm',
            name: 'out',
            message: 'Are you going out for fun now?',
        },
        {
            type: 'select',
            name: "templateType",
            message: '请选择模板类型',
            choices: [
                {
                    title: 'vue',
                    value: 'vue'
                },
                {
                    title: 'rollup',
                    value: 'rollup'
                }
            ]
        }
    ])

    console.log(response)
}

init().catch((error) => {
    console.log(error)
})