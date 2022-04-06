import fs from 'fs';
import path from 'path'

const file = path.resolve('./dist/index.cjs')

const data = fs.readFileSync(file, 'utf8').split('\n')

data.splice(0, 0, "#!/usr/bin/env node")

fs.writeFileSync(file, data.join('\n'), 'utf8')