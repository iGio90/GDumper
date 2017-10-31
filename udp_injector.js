const xp1 = 0x3243FC; // udp connection
const xp2 = 0x323AFC; // udp send message (first one)
const xp3 = 0x323A20; // udp pre-send (all)
const xp4 = 0x33C2F6; // possible rc4

const xp5 = 0x324980; // udp send 1 (subsequent packet)
const xp6 = 0x3248C0; // udp send 2 (used only on first packed)


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

function inject() {
    Process.enumerateModules({
        onMatch: function (module) {
            if (module.name === "libg.so") {
                var base = module.base;
                var pt1 = ptr(parseInt(base) + 1 + xp5);
                var pt2 = ptr(parseInt(base) + 1 + xp6);

                Interceptor.attach(pt1, {
                    onEnter: function (args) {
                        console.log("UDP SEND 1");
                        console.log(Memory.readByteArray(ptr(parseInt(args[0]) + 1410), 64));
                    },
                    onLeave: function (retval) {
                    }
                });
                Interceptor.attach(pt2, {
                    onEnter: function (args) {
                        console.log("UDP SEND 2");
                        console.log(Memory.readByteArray(ptr(parseInt(args[0]) + 1410), 64));
                    },
                    onLeave: function (retval) {
                    }
                });
                Interceptor.attach(Module.findExportByName("libg.so", "sendto"), {
                    onEnter: function (args) {
                        console.log(Memory.readByteArray(args[1], 64));
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