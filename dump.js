inject();

function inject() {
    Process.enumerateModules({
        onMatch: function (module) {

            if (module.name === "libg.so") {
                var base = module.base;
                var pt1 = ptr(parseInt(base) + 1 + 0x243578);
                var pt2 = ptr(parseInt(base) + 1 + 0x1BC65C);
                var pt3 = ptr(parseInt(base) + 1 + 0x2B0884);
                var pt4 = ptr(parseInt(base) + 1 + 0x12AD64);
                var pt5 = ptr(parseInt(base) + 1 + 0x1B033C);
                var pt6 = ptr(parseInt(base) + 1 + 0x148378);
                var pt7 = ptr(parseInt(base) + 1 + 0x18D7E4);

                Interceptor.attach(Module.findExportByName("libg.so", "send"), {
                    onEnter: function (args) {
                        buf = Memory.readUShort(ptr(args[1]));
                        if (buf === 29735) {
                            Interceptor.attach(pt1, {
                                onEnter: function (args) {
                                    Interceptor.attach(pt2, {
                                        onEnter: function (args) {
                                        },
                                        onLeave: function (retval) {
                                            Interceptor.detachAll();
                                            Interceptor.attach(pt3, {
                                                onEnter: function (args) {
                                                },
                                                onLeave: function (retval) {
                                                    Interceptor.detachAll();
                                                    var i = 0;
                                                    Interceptor.attach(pt4, {
                                                        onEnter: function (args) {
                                                            i++;
                                                        },
                                                        onLeave: function (retval) {
                                                            if (i === 1) {
                                                                Interceptor.attach(pt5, {
                                                                    onEnter: function (args) {
                                                                        var pt = ptr(parseInt(this.context.r0) + 32 + 48)
                                                                        var buf = Memory.readByteArray(pt,
                                                                            parseInt(args[2]));
                                                                        console.log(hexdump(buf, {
                                                                            offset: 0,
                                                                            length: parseInt(args[2]),
                                                                            header: true,
                                                                            ansi: true
                                                                        }));
                                                                    },
                                                                    onLeave: function (retval) {
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });

                                                    Interceptor.attach(pt6, {
                                                        onEnter: function (args) {
                                                        },
                                                        onLeave: function (retval) {
                                                            Interceptor.detachAll();
                                                            Interceptor.attach(Module.findExportByName("libg.so", "send"), {
                                                                onEnter: function (args) {
                                                                    var buf = Memory.readUShort(ptr(args[1]));
                                                                    console.log(buf)
                                                                },
                                                                onLeave: function (retval) {
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });

                                },
                                onLeave: function (retval) {
                                }
                            });
                        }
                    },
                    onLeave: function (retval) {
                    }
                });
            }
        },
        onComplete: function () {
        }
    });
}