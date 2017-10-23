import frida
import socket
import sys
import time
import os

game = 0
if len(sys.argv) > 1:
    game = sys.argv[1]

package_name = ""
if game == 0:
    package_name = "com.supercell.boombeach"
elif game == 1:
    package_name = "com.supercell.clashofclans"

def parse_message(message, data):
    print(message)
    payload = message["payload"]
    arr = payload.split(":")
    #sess_file.write(payload + "\n")
    clientsocket.send(payload.encode())
    if arr[0] == "0":
        print("PK:"+arr[1])
    elif arr[0] == "1":
        print("SK:"+arr[1])
    elif arr[0] == "2":
        print("PKS:"+arr[1])
    elif arr[0] == "3":
        msgId = int(arr[1][:4], 16)
        print("[CLIENT] " + str(msgId))
    elif arr[0] == "4":
        msgId = int(arr[1][:4], 16)
        print("[SERVER] " + str(msgId))

def instrument_debugger_checks():
    injector = ""
    if game == 0:
        injector = "bb_dumper.js"
    elif game == 1:
        injector = "coc_dumper.js"

    return open(injector, "r").read()

def runCmd(cmd):
    os.system(cmd)

if not os.path.exists("dumps"):
    os.makedirs("dumps")

#sess_file = open("dumps/" + str(time.time()) + ".bin", "w")

clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clientsocket.connect(('localhost', 10101))

runCmd("adb shell am force-stop " + package_name)
runCmd("adb shell am start -n " + package_name + "/" + package_name + ".GameApp")

process = frida.get_usb_device().attach(package_name)
script = process.create_script(instrument_debugger_checks())
script.on('message', parse_message)
script.load()
sys.stdin.read()
#sess_file.close()
