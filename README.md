A set of utilities to dump, decrypt and parse Supercell games protocol. Big thanks to Royale-Proxy for the bytebuffer extension and working base.

Dumpers, fuzzers and extra tools are gitignored just because i want to make sure whose gonna put hands on them. Feel free to come here https://discord.gg/hTVhy3V and get a copy

####REQUIREMENTS
* Python3
* Frida (http://frida.re)

####USAGE
* Start frida on Android
* Start a terminal and ``node proxy.js``
* Start another one and ``python3 dumper.py 0`` (0: bb / 1: coc)

####TODO
* Fix proxy.js to packetize data from dumper
* Replace manual edit of game type in proxy.js.

```javascript
/**
   * Game Map
   * 0: bb
   * 1: coc
   * 2: cr
   */
  const definitions = new Definitions(1);
```