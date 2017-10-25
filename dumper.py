import frida
import json
import socket
import sys
import time
import os
import argparse

def parse_message(message, data):
    payload = message["payload"]
    arr = payload.split("::::")
    sess_file = None

    if mode == "dump":
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
    elif mode == "proxy":
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

def get_table():
    with open('xptable.json') as data_file:
        return json.load(data_file)

def instrument_debugger_checks():
    injector = open("dumper.js", "r").read()
    
    cputype = ""
    
    if(arch == "arm"):
        cputype = "1"
    else:
        cputype = "0"
        
    gametype = ""
    
    if(game == "bb"):
        gametype = "0"
    elif(game == "coc"):
        gametype = "1"
    
    xptable = get_table()[gametype][cputype]
    xp1 = int(xptable["1"], 16)
    xp2 = int(xptable["2"], 16)
    xp3 = int(xptable["3"], 16)
    thumb = xptable["thumb"]
    if (thumb):
        xp1 = xp1 + 1
        xp2 = xp2 + 1
        xp3 = xp3 + 1
    return injector.replace("xxp1", str(xp1)).replace("xxp2", str(xp2)).replace("xxp3", str(xp3))

def runCmd(cmd):
    os.system(cmd)
    
mode = ""
game = ""
arch = ""

package_name = ""
path = ""

parser = argparse.ArgumentParser(description='Dump SC protocol data.')

parser.add_argument('-m', '--mode', help="Mode for dumper to run.")
parser.add_argument('-g', '--game', help="Game to run.")
parser.add_argument('-a', '--arch', help="Device architecture.")
    
args = parser.parse_args()

mode = args.mode
game = args.game
arch = args.arch

if(not mode or not game or not arch):
    print("Run with argument --help (-h) for more information.")
    sys.exit(1)

if(mode != "proxy" and mode != "dump"):
    print("Mode \"" + mode + "\" is not valid. Try \"proxy\" or \"dump\"")
    print("Proxy: Connects to the local node proxy server.")
    print("Dump: Starts a dump session.")
    sys.exit(1)
    
if(game != "coc" and game != "bb"):
    print("Game \"" + game + "\" is not valid. Try \"coc\" or \"bb\"")
    print("COC: Clash of Clans")
    print("BB: Boom Beach")
    sys.exit(1)
        
if(arch != "arm" and arch != "x86"):
    print("CPU Architecture \"" + arch + "\" is not valid. Try \"arm\" or \"x86\"")
    print("ARM: Recommended for most physical devices.")
    print("x86: Recommended for a few physical devices and most emulators.")
    sys.exit(1)


if game == "bb":
    package_name = "com.supercell.boombeach"
elif game == "coc":
    package_name = "com.supercell.clashofclans"

print("Starting dumper for " + package_name)
	
if not os.path.exists("dumps"):
    os.makedirs("dumps")

if mode == "proxy":
    print("Requesting connection to proxy.")
    clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    clientsocket.connect(('localhost', 10101))
elif mode == "dump":
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