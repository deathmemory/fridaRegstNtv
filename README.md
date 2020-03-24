# fridaRegstNtv

本项目是利用 frida 获取 Jni RegisterNatives 动态注册的函数，并将其函数地址和对应的 so 打印出来
由于此功能使用频率较高，所以单独拉出一个库，方便使用。

# 安装

```bash
git clone https://github.com/deathmemory/fridaRegstNtv.git
cd fridaRegstNtv
sudo npm install
npm run build
```

# 使用

```bash
frida -U -l _fridaRegstNtv.js com.package.name
```
