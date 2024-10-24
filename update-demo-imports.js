const fs = require('node:fs')
const path = require('node:path')

function updateDemoImports(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`读取文件 ${filePath} 时出错:`, err)
      return
    }

    const updatedContent = data.replace(
      /<demo src="..\/..\/packages\/components\/src\/components\/(.+?)\/demos\/(.+?)\.vue" \/>/g,
      (match, componentPath, demoName) => {
        return `<script setup>
  import ${demoName} from 'components/${componentPath}/demos/${demoName}.vue'
  import ${demoName}Code from 'components/${componentPath}/demos/${demoName}.vue?raw'
</script>
<demo :comp="${demoName}" :code="${demoName}Code" />`
      },
    )

    if (data !== updatedContent) {
      fs.writeFile(filePath, updatedContent, 'utf8', (writeErr) => {
        if (writeErr)
          console.error(`写入文件 ${filePath} 时出错:`, writeErr)
        else
          console.log(`文件 ${filePath} 已成功更新`)
      })
    }
    else {
      console.log(`文件 ${filePath} 无需更新`)
    }
  })
}

function processDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`读取目录 ${directory} 时出错:`, err)
      return
    }

    files.forEach((file) => {
      const fullPath = path.join(directory, file.name)
      if (file.isDirectory())
        processDirectory(fullPath)
      else if (file.isFile() && path.extname(file.name) === '.md')
        updateDemoImports(fullPath)
    })
  })
}

// 指定要处理的目录
const targetDirectory = './docs/components'
processDirectory(targetDirectory)
