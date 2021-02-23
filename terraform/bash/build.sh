#! /bin/bash
echo "=== Build Started! ==="
# mkdir logs

echo "Start - Machine Update"
sudo apt-get upgrade > ./logs/updateMachineLog.txt
sudo apt-get update > ./logs/updateMachineLog.txt
echo "End - Machine Update"

echo "Start - Installing NodeJS, NPM"
yes | sudo apt install nodejs  > ./logs/nodeNpmLog.txt
yes | sudo apt install npm > ./logs/nodeNpmLog.txt
echo "End - Installing NodeJS, NPM"

cd BTC-TS

echo "Start - Installing Dependencies"
npm install > ../logs/dependenciesLog.txt
echo "End - Installing Dependencies"

echo "=== Build Ended! ==="