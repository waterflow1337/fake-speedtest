from speedtest import SpeedTest

ping = "10"  # do not change it's only used for the signature
upload_mbps = min(float(input("Upload Mbps: ")), 9999)  # max 9999
download_mbps = min(float(input("Upload Mbps: ")), 9999)  # max 9999
key = "817d699764d33f89c"
upload_ping = input("Upload latency: ")
download_ping = input("Download latency: ")
idle_latency = input("Idle latency: ")
server_id = 27961  # Change to your closest server if you want

speed_test = SpeedTest(ping, upload_mbps, download_mbps, key, upload_ping, download_ping, idle_latency, server_id)
response = speed_test.fake_speedtest()

if not response:
    print("Failed to generate speedtest")
else:
    print(f"Generated link: https://www.speedtest.net/result/{response}")

