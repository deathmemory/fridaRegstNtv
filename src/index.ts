/**
 * author: dmemory
 * desc: 本项目是利用 frida 获取 Jni RegisterNatives 动态注册的函数，并将其函数地址和对应的 so 打印出来
 */

import {DMLog} from "./utils/dmlog";

const tag = 'fridaRegstNtv';

function getModuleInfoByPtr(fnPtr: NativePointer) {
    var modules = Process.enumerateModules();
    var modname = null, base = null;
    modules.forEach(function (mod) {
        if (mod.base <= fnPtr && fnPtr.toInt32() <= mod.base.toInt32() + mod.size) {
            modname = mod.name;
            base = mod.base;
            return false;
        }
    });
    return [modname, base];
}

function hook_registNatives() {

    var env = Java.vm.getEnv();
    var handlePointer = env.handle.readPointer();
    console.log("handle: " + handlePointer);
    var nativePointer = handlePointer.add(215 * Process.pointerSize).readPointer();
    console.log("register: " + nativePointer);
    /**
     typedef struct {
        const char* name;
        const char* signature;
        void* fnPtr;
     } JNINativeMethod;
     jint RegisterNatives(JNIEnv* env, jclass clazz, const JNINativeMethod* methods, jint nMethods)
     */
    Interceptor.attach(nativePointer, {
        onEnter: function(args) {
            var env = Java.vm.getEnv();
            var methods = args[2];
            var methodcount = args[3].toInt32();
            var name = env.getClassName(args[1]);
            console.log("==== class: " + name + " ====");

            console.log("==== methods: " + methods + " nMethods: " + methodcount + " ====");
            for (var i = 0; i < methodcount; i ++ ) {
                var idx = i * 12;
                var fnPtr = methods.add(idx + 8).readPointer();
                const infoArr = getModuleInfoByPtr(fnPtr);
                const modulename = infoArr[0];
                const modulebase = infoArr[1];
                var logstr = "name: " + methods.add(idx).readPointer().readCString()
                    + ", signature: " + methods.add(idx + 4).readPointer().readCString()
                    + ", fnPtr: " + fnPtr
                    + ", modulename: " + modulename + " -> base: " + modulebase;
                if (null != modulebase) {
                    logstr += ", offset: " + fnPtr.sub(modulebase);
                }
                DMLog.i(tag, logstr);
            }

        }
    });
}

function main() {
    DMLog.i(tag, 'hello, i am loaded');
    hook_registNatives();
}

if (Java.available) {
    Java.perform(function () {
        main();
    })
}