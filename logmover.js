const clipboardy=require("clipboardy");
const fs=require("fs");

const logfile="C:/Users/khang/Desktop/logmover/testlog.log";

if (!fs.existsSync(logfile))
{
    console.log("log file missing");
    return;
}

var clipboard=clipboardy.readSync().split("\n");

var match;
var targetVideos=[];
for (var x=0,l=clipboard.length;x<l;x++)
{
    match=clipboard[x].match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (.*\.mkv)/);
    if (match)
    {
        targetVideos.push(match[1]);
    }
}

console.log(targetVideos);