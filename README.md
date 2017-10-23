A set of utilities to dump, decrypt and parse Supercell games protocol. Big thanks to Royale-Proxy for the bytebuffer extension and working base.

Dumpers, fuzzers and extra tools are gitignored just because i want to make sure whose gonna put hands on them. Feel free to come here https://discord.gg/hTVhy3V and get a copy

#### REQUIREMENTS
* Python3
* Frida (http://frida.re) (running on Android and bindings ``pip3 install frida``)

#### USAGE (Live proxying)
* Start a terminal and ``node proxy.js``
* Start another one and ``python3 dumper.py 0 game`` (where game = 0: bb / 1: coc)

#### USAGE (Session dump)
* Start a terminal and ``python3 dumper.py 1 game`` (where game = 0: bb / 1: coc)
* Once finish to dump your session start a terminal and ``node protoparser.js dumps/DUMPSPATH``

#### TODO
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