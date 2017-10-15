var payload;
const xp1 = 0x243578;
const xp2 = 0x1BC65C;
const xp3 = 0x2B0884;
const xp4 = 0x18D7E4;
const xp5 = 0x12AD64;
const xp6 = 0x1B033C;
const xp7 = 0x148378;

inject();

function ba2hex(bufArray) {
    var uint8arr = new Uint8Array(bufArray);
    if (!uint8arr) {
        return '';
    }

    var hexStr = '';
    for (var i = 0; i < uint8arr.length; i++) {
        var hex = (uint8arr[i] & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }

    return hexStr.toUpperCase();
}

function chainAttack(base, loginAttach) {
    var pt4 = ptr(parseInt(base) + 1 + xp5);
    var pt5 = ptr(parseInt(base) + 1 + xp6);
    var pt6 = ptr(parseInt(base) + 1 + xp7);

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
                        var head = 32 + (loginAttach ? 48 : 0);
                        var pt = ptr(parseInt(this.context.r0) + head);
                        payload = Memory.readByteArray(pt, parseInt(args[2]) - head);
                    },
                    onLeave: function (retval) {
                    }
                });
                i++;
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
                    var msgId = parseInt(ba2hex(Memory.readByteArray(ptr(args[1]), 2)));
                    if (msgId > 1000) {
                        console.log(msgId);
                        if (typeof payload !== 'undefined' && payload !== null) {
                            console.log(hexdump(payload, {
                                offset: 0,
                                length: payload.length,
                                header: true,
                                ansi: true
                            }));
                        }

                        chainAttack(base, false)
                    }
                },
                onLeave: function (retval) {
                }
            });
        }
    });
}

function inject() {
    Process.enumerateModules({
        onMatch: function (module) {

            if (module.name === "libg.so") {
                var base = module.base;
                var pt1 = ptr(parseInt(base) + 1 + xp1);
                var pt2 = ptr(parseInt(base) + 1 + xp2);
                var pt3 = ptr(parseInt(base) + 1 + xp3);
                var pt7 = ptr(parseInt(base) + 1 + xp4);

                Interceptor.attach(Module.findExportByName("libg.so", "send"), {
                    onEnter: function (args) {
                        var msgId = parseInt(ba2hex(Memory.readByteArray(ptr(args[1]), 2)));

                        if (msgId < 10) {
                            return;
                        }

                        if (msgId === 2774) {
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
                                                    chainAttack(base, true);
                                                }
                                            });
                                        }
                                    });

                                },
                                onLeave: function (retval) {
                                }
                            });
                        } else {
                            var msgId = parseInt(ba2hex(Memory.readByteArray(ptr(args[1]), 2)));
                            if (msgId > 1000) {
                                console.log(msgId)
                            }
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