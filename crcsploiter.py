import argparse
import binascii
import capstone
import keystone
import os
import sys


def main(args):
    parser = argparse.ArgumentParser(description='Exploit Supercell CRC protection.')

    parser.add_argument('-o', '--offset', help="Offset", required=True)
    parser.add_argument('-c', '--count', help="Count")
    parser.add_argument('-pH', '--payloadH', help="Attempt to find a valid spot for given payload in hex string format")
    parser.add_argument('-pI', '--payloadI', help="Attempt to find a valid spot for given payload provided as instruction")
    parser.add_argument('-e', '--extract', help="Extract library")

    args = parser.parse_args()

    offset = args.offset
    count = args.count
    extract = args.extract
    payloadH = args.payloadH
    payloadI = args.payloadI

    if not count:
        count = 8

    if extract:
        print("Extracting libg\n")
        runCmd("adb shell su -c cp /data/data/com.supercell.boombeach/lib/libg.so /sdcard/libg.so")
        runCmd("adb pull /sdcard/libg.so .")

    if str.startswith(offset, "0x"):
        offset = int(offset, 16)
    else:
        offset = int(offset)

    lib = open("libg.so", "rb")
    data = lib.read()
    lib.close()

    target = data[offset:offset + count]

    hex_bytes = binascii.hexlify(target)
    hex_str = hex_bytes.decode("ascii")
    print("CALCULATING CRC FOR: " + str.upper(hex_str) + "\n")

    print("ASSEMBLY CODE:")
    md = capstone.Cs(capstone.CS_ARCH_ARM, capstone.CS_MODE_THUMB)
    for (address, size, mnemonic, op_str) in md.disasm_lite(target, 0x0000):
        print("0x%x:\t%s\t%s" % (address, mnemonic, op_str))
    print("")

    calculateCrc(hex_str)

    if payloadI:
        print("ASSEMBLING INSTRUCTION: %s" % payloadI)
        try:
            payloadI = payloadI.encode()
            ks = keystone.Ks(keystone.KS_ARCH_ARM, keystone.KS_MODE_THUMB)
            encoding, count = ks.asm(payloadI)
            payloadH = binascii.hexlify(bytearray(encoding)).decode("ascii")
            print(payloadH + "\n")
        except keystone.KsError as e:
            print("ERROR: %s" % e)

    if payloadH:
        print("CALCULATING CRC FOR CUSTOM PAYLOAD:")
        calculateCrc(payloadH)


def runCmd(cmd):
    os.system(cmd)


def calculateCrc(payload):
    k = 0
    crc = 0
    block = ""
    plen = len(payload)
    for i in range(plen):
        if i % 2 != 0:
            if (k != 4 and k > 0) and (i + 1 == plen):
                print("CRC for block %s: %d" % (str.upper(block), crc))
            continue

        if i + 2 <= len(payload):
            block += payload[i:i + 2]
            crc += parseInt(payload[i:i + 2])

        k = k + 1

        if k == 4:
            k = 0
            print("CRC for block %s: %d" % (str.upper(block), crc))
            crc = 0
            block = ""
    print("")


def parseInt(str):
    hex = {'A', 'B', 'C', 'D', 'E', 'F'}
    for hChar in hex:
        if hChar in str.upper():
            return int(str, 16)
    return int(str, 10)


if __name__ == '__main__':
    main(sys.argv)
