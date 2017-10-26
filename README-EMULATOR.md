# Emulators

Using GDumper with an emulator is a bit of a difficult setup, however it's possible.

GDumper supports both ARM and x86 emulators.

**REQUIREMENTS**
- Android SDK (you'll be needing ADB [Android Debug Bridge])
- Android Emulator **running Android 6.0** (either an AVD [Android Virtual Device] or any rooted x86 emulator)
- Frida Server **10.6.12** (for ARM/x86)
- Frida **10.6.12** (for Python3)

#### Why use Frida 10.6.12?
Because this is the only version that is least likely to crash at this point, and supports both ARM/x86 emulators.

## Steps

1. Install the Android SDK.

2. Get an Android Emulator.

3. Download frida-server-10.6.12 (for Android ARM/x86) and frida-10.6.12 (for Python3)

4. Run the following on an Android Emulator after everything is set up, as this will install and start frida server:

```
adb root

adb remount

adb push /path/to/frida /system/xbin/frida

adb shell

su

chmod a+x /system/xbin/frida
(or chmod 755 /system/xbin/frida on older android versions)

frida &
```

4. Follow the main [README](README.md)
