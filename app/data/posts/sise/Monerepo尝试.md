# Monerepo尝试

### 项目文件结构

```json
monerepo/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── ui-components/      # React组件库
│   │   ├── package.json
│   │   ├── src/
│   │   └── ...
│   └── playground/         # 验证组件库的应用
│       ├── package.json
│       ├── src/
│       └── ...
```

### 母包配置

```json
 packages:
  - 'packages/*'
```

这会读取packages下面的目录里的package.json作为子包

命令 filter会赛选指定的子包

```ts
       "dev:playground": "pnpm --filter playground dev",
        "dev:ui": "pnpm --filter ui-components dev",
```

##### pnpm 使用硬连接的方式节约磁盘空间利用率、采用虚拟存储目录+软连接解决幽灵依赖

**软链接（符号连接）：** 包含一条以绝对路径或相对路径的形式指向其他文件或者目录的引用。

最常见的就是桌面的快捷方式，其本质就是一个软链接，软链接所产生的文件是无法更改的，它只是存储了目标文件的路径，并根据该路径去访问对应的文件。

**硬链接：** 电脑文件系统中的多个文件平等的共享同一个文件存储单元。

假如磁盘中有一个名为 data 的数据，C盘中的一个名为 hardlink1 的文件硬链接到磁盘 data 数据，另一个名为 hardlink2 的文件也硬链接到磁盘 data 数据，此时如果通过 hardlink1 文件改变磁盘 data 的数据内容，则通过 hardlink2 访问磁盘 data 数据内容是改变过后的内容。

