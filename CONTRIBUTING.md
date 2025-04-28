# 欢迎

首先很高兴有更多人能参与到本项目的开发中，无论是添加新功能还是修复BUG或者是改进文案等都是欢迎的。

# 环境搭建

- 在浏览器中安装 [Tampermonkey](https://tampermonkey.net/) 扩展插件
- 安装 [Node.js](https://nodejs.org/zh-cn) (LTS版本就可以)
- 安装 [Visual Studio Code](https://code.visualstudio.com/download)
- 安装 [git](https://git-scm.com/) 或者任意GIT GUI客户端，例如 [Github Desktop](https://desktop.github.com/download/)
- 运行以下命令安装pnpm
```sh
npm install -g pnpm
```
- Fork 本项目 (不用勾选 Copy the `main` branch only)，并 clone 至本地
- 在项目根目录中运行以下命令安装依赖
```sh
pnpm install
```
- 运行以下命令切换至`dev`分支或在GIT GUI客户端中切换至`dev`分支
```sh
git checkout dev
```
至此，完成本项目的环境搭建，运行以下命令或在`Visual Studio Code`的`NPM脚本`栏中的`dev`点击运行按钮即可进行开发
```sh
pnpm run dev
```

# 注意事项

- 提交`commit`时，请使用[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0)的格式
- 发起`PR`前请进行测试
- 发起`PR`时请合并到主仓库的`dev`分支