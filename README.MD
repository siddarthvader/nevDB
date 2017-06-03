(on windows machine)
npm install node-gyp -g
npm cache clean
rm -rf node_modules
npm install


(install mongoDb, run cmd using admin rights)
>go to bin folder of mongo
>mongod -directoryperdb --dbpath F:\code\server\mongo\data\db --logpath F:\code\server\mongo\data\log\mongo.log --logappend --rest --install
> (if system error 2 occues) remove the mongo service first, "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --remove