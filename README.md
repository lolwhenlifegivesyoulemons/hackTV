# hackTV

Hackable Samsung Smart TV (Tizen) video/stream player.

![Photoshot of hackTV](https://i.imgur.com/i2i5gKq.jpg)

# How to run/debug?

Install [Tizen SDK](https://developer.tizen.org/development/tizen-studio/download?langswitch=en), create a new blank Tizen Web Project, then register certificate, then import hackTV in project, AND THEN run/debug on your TV.

# How to install?

1. Create a hackTV.wgt file from the blank Tizen Web project (google will help you)
2. enable developer mode in apps (go to apps, press 12345 on your smart remote, enable and put your pc's local ip)
3. run `sdb connect 192.168.1.xx` in the CLI (replace xx with your tv's local ip)
4. run `tizen install -n hackTV.wgt -t UDID` (if you don't know your UDID, run sdb devices and get the string that starts with UN)
5. profit!
