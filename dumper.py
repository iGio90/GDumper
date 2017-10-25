import frida
import socket
import sys
import time
import os

if len(sys.argv) < 3:
    print("Usage: python3 dumper.py mode game")
    print("")
    print("Modes:")
    print("0: Connect to local node proxy server")
    print("1: Dump session")
    print("")
    print("Games:")
    print("0: Boom Beach")
    print("1: Clash of Clans")
    exit(0)

mode = sys.argv[1]
game = sys.argv[2]

package_name = ""
path = ""

if game == "0":
    package_name = "com.supercell.boombeach"
elif game == "1":
    package_name = "com.supercell.clashofclans"

def parse_message(message, data):
    payload = message["payload"]
    arr = payload.split("::::")
    sess_file = None

    if mode == "1":
        if arr[0] == "0":
            print("PK:"+arr[1])
            sess_file = open(path + "/pk" + ".bin", "w")
            sess_file.write(arr[1])
        elif arr[0] == "1":
            print("SK:"+arr[1])
            sess_file = open(path + "/sk" + ".bin", "w")
            sess_file.write(arr[1])
        elif arr[0] == "2":
            print("PKS:"+arr[1])
            sess_file = open(path + "/pks" + ".bin", "w")
            sess_file.write(arr[1])
        elif arr[0] == "3":
            msgId = int(arr[1][:4], 16)
            sess_file = open(path + "/" + str(int(round(time.time() * 1000))) + "_client_" + str(msgId) + ".bin", "w")
            sess_file.write(arr[1])
            print("[CLIENT] " + str(msgId))
        elif arr[0] == "4":
            msgId = int(arr[1][:4], 16)
            sess_file = open(path + "/" + str(int(round(time.time() * 1000))) + "_server_" + str(msgId) + ".bin", "w")
            sess_file.write(arr[1])
            print("[SERVER] " + str(msgId))
        if (sess_file is not None):
            sess_file.close()
    elif mode == "0":
        msglen = len(payload)
        totalsent = 0
        while totalsent < msglen:
            sent = clientsocket.send(payload[totalsent:].encode())
            if sent == 0:
                raise RuntimeError("socket connection broken")
            totalsent = totalsent + sent
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
            print("[SERVER] " + str(msgId) + " " + str(totalsent))
        time.sleep(50.0 / 1000.0)


def instrument_debugger_checks():
    injector = ""
    if game == "0":
        injector = "bb_dumper.js"
    elif game == "1":
        injector = "coc_dumper.js"

    return open(injector, "r").read()

def runCmd(cmd):
    os.system(cmd)

print("Starting dumper for " + package_name)
	
if not os.path.exists("dumps"):
    os.makedirs("dumps")

if mode == "0":
    print("Requesting connection to proxy.")
    clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    clientsocket.connect(('localhost', 10101))
elif mode == "1":
    print("Preparing file dumps.")
    t = str(int(round(time.time() * 1000)))
    path = "dumps/" + package_name + "_" + t
    os.makedirs(path)

print ("Killing " + package_name)
runCmd("adb shell am force-stop " + package_name)
print ("Starting " + package_name)
runCmd("adb shell am start -n " + package_name + "/" + package_name + ".GameApp")

process = frida.get_usb_device().attach(package_name)
print("Frida attached.")
script = process.create_script(instrument_debugger_checks())
print("Dumper loaded.")
script.on('message', parse_message)
print("parse_message registered within script object.")
script.load()
sys.stdin.read()
