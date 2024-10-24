import os
import shutil
import re

def copy_and_modify_readme(src_dir, dest_dir):
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.lower() == 'readme.md':
                src_path = os.path.join(root, file)
                rel_path = os.path.relpath(root, src_dir)
                print(rel_path)
                dest_path = os.path.join(dest_dir, rel_path.replace('src/', ''), '../', file)

                # 创建目标目录(如果不存在)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)

                # 读取源文件内容
                with open(src_path, 'r', encoding='utf-8') as src_file:
                    content = src_file.read()

                # 修改文件名为组件名
                component_name = os.path.basename(root)
                new_filename = f"{component_name}.md"
                dest_path = os.path.join(os.path.dirname(dest_path), new_filename)

                # 修改内部引用路径
                content = re.sub(
                    r'(\.\/demos)',
                    f'../../packages/components/src/components/{rel_path}/demos',
                    content
                )

                # 写入修改后的内容到目标文件
                with open(dest_path, 'w', encoding='utf-8') as dest_file:
                    dest_file.write(content)

                print(f"已复制并修改: {src_path} -> {dest_path}")

# 设置源目录和目标目录
src_directory = 'packages/components'
dest_directory = 'docs'

# 执行复制和修改操作
copy_and_modify_readme(src_directory, dest_directory)

print("操作完成!")
