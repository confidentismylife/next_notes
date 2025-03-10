[TOC]

# java-spring-docker

该模版演示基于 Java + Spring 实现全自动检出代码 -> 单元测试 -> 构建 Docker 镜像 -> 推送到 Docker 制品库 -> 部署到远端服务器

## 文件解释

样例包括:

- README.md - 本文件
- gradlew - Gradle 的 wrapper 脚本，可以在没有安装 Gradle 的情况下自动安装 Gradle
- gradlew.bat - Windows 下用的 gradlew 脚本
- build.gradle - Gradle 项目的基本描述和依赖配置
- src/main - 主 Java 源代码
- src/test - 主 Java 测试代码

## 快速开始

如下这些引导，假定你想在自己的电脑上开发本项目。

1. 运行测试

```
$ ./gradlew test
```

1. 运行构建

```
$ ./gradlew build
```

1. 启动服务

```
$ java -jar ./build/libs/spring-app.jar
```

1. 打开 <http://127.0.0.1:8080/> .
