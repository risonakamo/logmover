const clipboardy=require("clipboardy");
const fs=require("fs");

const logfile="testlog.log";
const targetFolder="../videos/vids";
const moveToFolder="../videos/completed";

if (!fs.existsSync(logfile))
{
    console.log("log file missing");
    return;
}

if (!fs.existsSync(targetFolder))
{
    console.log("target folder missing");
    return;
}

if (!fs.existsSync(moveToFolder))
{
    console.log("move target folder is missing");
    return;
}

var clipboard=clipboardy.readSync().split("\n"); //clipboard text converted into list with new lines

var match;
var targetVideos=[]; //list of video file names to move
var logVidDetect=/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (.*\.mkv)/; //regex the file name of a video from a log file line
for (var x=0,l=clipboard.length;x<l;x++)
{
    match=clipboard[x].match(logVidDetect);
    if (match)
    {
        targetVideos.push(match[1]);
    }
}

if (targetVideos.length!=clipboard.length)
{
    console.log("clipboard discrepency detected");
    console.log("clipboard:");
    console.log(clipboard);
    console.log();
    console.log("target videos:");
    console.log(targetVideos);
    return;
}

console.log(targetVideos);