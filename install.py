import os, json
import time, subprocess


def loop():
    for x in tuple(open("data.txt", 'r')):
        os.system("./adb disconnect")
        time.sleep(1)
        print(x.strip())
        t = subprocess.Popen("./adb connect {}:{}".format(x.strip(), 5555), shell=True,
                             stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        a = 0
        while t.poll() is None:
            if a == 10:
                t.kill()
            time.sleep(1)
            a += 1
        time.sleep(1)
        os.system("./adb install base.apk")
        time.sleep(1)
        os.system(
            "./adb shell monkey -p com.android.wifimanager -c android.intent.category.LAUNCHER 1")
        time.sleep(1)
        with open('data.txt', 'r') as fin:
            data = fin.read().splitlines(True)
        with open('data.txt', 'w') as fout:
            fout.writelines(data[1:])

loop()