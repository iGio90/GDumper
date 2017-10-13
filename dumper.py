import frida
import sys

package_name = "com.supercell.boombeach"

def instrument_debugger_checks():
    return open("dump.js", "r").read()

process = frida.get_usb_device().attach(package_name)
script = process.create_script(instrument_debugger_checks())
script.load()
sys.stdin.read()