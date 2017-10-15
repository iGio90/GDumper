import frida
import sys
import os

def instrument_debugger_checks():
    return open("dump.js", "r").read()

def runCmd(cmd):
    os.system(cmd)

game = 0
if len(sys.argv) > 1:
    game = sys.argv[1]

package_name = ""
if game == 0:
    package_name = "com.supercell.boombeach"

runCmd("adb shell am force-stop " + package_name)
runCmd("adb shell am start -n " + package_name + "/" + package_name + ".GameApp")

process = frida.get_usb_device().attach(package_name)
script = process.create_script(instrument_debugger_checks())
script.load()
sys.stdin.read()