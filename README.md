# fridaRegstNtv

本项目是利用 frida 获取 Jni RegisterNatives 动态注册的函数，并将其函数地址和对应的 so 打印出来
由于此功能使用频率较高，所以单独拉出一个库，方便使用。

# 效果

```angular2html
[INFO][fridaRegstNtv]: hello, i am loaded
handle: 0xefb71cbc
register: 0xef9ba4f1
==== class: com.meituan.android.cipstorage.MMKV ====
==== methods: 0xcd52d428 nMethods: 41 ====
[INFO][fridaRegstNtv]: name: initialize, signature: ()V, fnPtr: 0xcd50b6bd, modulename: libcips.so -> base: 0xcd505000, offset: 0x66bd
[INFO][fridaRegstNtv]: name: onExit, signature: ()V, fnPtr: 0xcd50b6c7, modulename: libcips.so -> base: 0xcd505000, offset: 0x66c7
[INFO][fridaRegstNtv]: name: getMMKVWithID, signature: (Ljava/lang/String;ILjava/lang/String;)J, fnPtr: 0xcd50b6d1, modulename: libcips.so -> base: 0xcd505000, offset: 0x66d1                   
[INFO][fridaRegstNtv]: name: encodeBool, signature: (JLjava/lang/String;Z)Z, fnPtr: 0xcd50b76d, modulename: libcips.so -> base: 0xcd505000, offset: 0x676d
[INFO][fridaRegstNtv]: name: decodeBool, signature: (JLjava/lang/String;Z)Z, fnPtr: 0xcd50b7bf, modulename: libcips.so -> base: 0xcd505000, offset: 0x67bf
[INFO][fridaRegstNtv]: name: encodeInt, signature: (JLjava/lang/String;I)Z, fnPtr: 0xcd50b80f, modulename: libcips.so -> base: 0xcd505000, offset: 0x680f
[INFO][fridaRegstNtv]: name: decodeInt, signature: (JLjava/lang/String;I)I, fnPtr: 0xcd50b85b, modulename: libcips.so -> base: 0xcd505000, offset: 0x685b
[INFO][fridaRegstNtv]: name: encodeLong, signature: (JLjava/lang/String;J)Z, fnPtr: 0xcd50b8a5, modulename: libcips.so -> base: 0xcd505000, offset: 0x68a5
[INFO][fridaRegstNtv]: name: decodeLong, signature: (JLjava/lang/String;J)J, fnPtr: 0xcd50b8f7, modulename: libcips.so -> base: 0xcd505000, offset: 0x68f7
[INFO][fridaRegstNtv]: name: encodeFloat, signature: (JLjava/lang/String;F)Z, fnPtr: 0xcd50b953, modulename: libcips.so -> base: 0xcd505000, offset: 0x6953
......
```

# 安装

```bash
git clone https://github.com/deathmemory/fridaRegstNtv.git
cd fridaRegstNtv
sudo npm install
npm run build
```

# 使用

工程里已经生成了 `_fridaRegstNtv.js` 可以不用 build 直接使用。

```bash
frida -U -l _fridaRegstNtv.js -f com.package.name --no-pause
```
