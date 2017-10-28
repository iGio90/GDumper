/**
 *
 GDumper is a free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// OFFSETS TABLE
const xp1 = "xxp1"; // Login builder ep
const xp2 = "xxp2"; // Keypair ep
const xp3 = "xxp3"; // blake2b finish wrapper

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

function chainAttack() {
    Interceptor.detachAll();

    Interceptor.attach(Module.findExportByName("libg.so", "send"), {
        onEnter: function (args) {
            var b = ba2hex(Memory.readByteArray(args[1], parseInt(args[2])));
            var msgId = parseInt("0x" + b.substring(0, 4));
            if (msgId < 10000 || msgId > 30000) {
                return;
            }
            send("3::::" + b);
        },
        onLeave: function (retval) {
        }
    });

    var pl = null;
    var buf;
    var len;
    Interceptor.attach(Module.findExportByName("libg.so", "recv"), {
        onEnter: function (args) {
            buf = args[1];
            len = parseInt(args[2]);
        },
        onLeave: function (retval) {
            if (pl === null) {
                var b = ba2hex(Memory.readByteArray(buf, len));
                var msgId = parseInt("0x" + b.substring(0, 4));
                if (msgId < 10000 || msgId > 30000) {
                    return;
                }
                pl = b;
            } else {
                pl += ba2hex(Memory.readByteArray(buf, len));
                send("4::::" + pl);
                pl = null;
            }
        }
    });
}

function inject() {
    Process.enumerateModules({
        onMatch: function (module) {

            if (module.name === "libg.so") {
                var base = module.base;
                var pt1 = ptr(parseInt(base) + parseInt(xp1));
                var pt2 = ptr(parseInt(base) + parseInt(xp2));
                var pt3 = ptr(parseInt(base) + parseInt(xp3));

                Interceptor.attach(Module.findExportByName("libg.so", "send"), {
                    onEnter: function (args) {
                        var msgId = parseInt("0x" + ba2hex(Memory.readByteArray(ptr(args[1]), 2)));
                        if (msgId < 10000 || msgId > 30000) {
                            return;
                        }
                        if (msgId === 10100) {
                            Interceptor.attach(pt1, {
                                onEnter: function (args) {
                                    var pk;
                                    var sk;
                                    Interceptor.attach(pt2, {
                                        onEnter: function (args) {
                                            pk = args[0];
                                            sk = args[1];
                                        },
                                        onLeave: function (retval) {
                                            send("0::::" + ba2hex(Memory.readByteArray(pk, 32)));
                                            send("1::::" + ba2hex(Memory.readByteArray(sk, 32)));
                                            Interceptor.detachAll();
                                            Interceptor.attach(pt3, {
                                                onEnter: function (args) {
                                                    send("2::::" + ba2hex(Memory.readByteArray(ptr(parseInt(args[0]) + 132), 32)));
                                                },
                                                onLeave: function (retval) {
                                                    chainAttack();
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