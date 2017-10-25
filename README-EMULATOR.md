# Emulators

Using GDumper with an emulator is a bit of a difficult setup, however it's possible.

**REQUIREMENTS**
- Android SDK (you'll be needing ADB [Android Debug Bridge] and AVD [Android Virtual Device])
- Frida Server **10.6.12** (for ARM)
- Frida **10.6.12** (for Python3)

**STEPS**

1. Install the Android SDK.

2. Download frida-server-10.6.12 (for Android ARM) and frida-10.6.12 (for Python3)

3. Run the following on an ARM AVD after everything is set up:

```
adb root

adb remount

adb push /path/to/frida /system/xbin/frida

adb shell

su

chmod a+x /system/xbin/frida

frida &
```

4. Follow the main [README](README.md)
