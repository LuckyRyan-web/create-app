/**
 *
 * @author liuyuan
 * @date 2022-09-24 17:11
 * @since 0.0.0
 */
import { defineComponent, ref, PropType } from 'vue'
import classnames from 'classnames'
import style from './style.module.scss'

export default defineComponent({
    props: {
        msg: {
            type: String,
            default: '',
        },
        info: {
            type: Object as PropType<ApiUser.Msg>,
            default: () => {
                return {
                    name: 'hello typings',
                }
            },
        },
    },
    setup() {
        const count = ref(0)

        return {
            count,
        }
    },
    render() {
        return (
            <div>
                <h1>{this.msg}</h1>
                <h1>{this.info.name}</h1>
                <div class={style.card}>
                    <button
                        type="button"
                        onClick={() => {
                            this.count++
                        }}
                    >
                        count is {this.count}
                    </button>
                    <p>
                        Edit
                        <code>components/HelloWorld.vue</code> to test HMR
                    </p>
                    <p>
                        Check out
                        <a
                            href="https://vuejs.org/guide/quick-start.html#local"
                            target="_blank"
                        >
                            create-vue
                        </a>
                        , the official Vue + Vite starter
                    </p>
                    <p>
                        Install
                        <a
                            href="https://github.com/johnsoncodehk/volar"
                            target="_blank"
                        >
                            Volar
                        </a>
                        in your IDE for a better DX
                    </p>
                    <p class="read-the-docs">
                        Click on the Vite and Vue logos to learn more
                    </p>
                </div>
            </div>
        )
    },
})
