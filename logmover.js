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

var clipboardText=clipboardy.readSync();
var clipboard=clipboardText.split("\n"); //clipboard text converted into list with new lines

var targetVideos=[]; //list of video file names to move
var discrepencyDetected=0;

var match;
var logVidDetect=/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (.*\.mkv)/; //regex the file name of a video from a log file line
for (var x=0,l=clipboard.length;x<l;x++)
{
    //skip empty lines
    if (!clipboard[x].trim())
    {
        continue;
    }

    //grab the video file name out of the log line
    match=clipboard[x].match(logVidDetect);
    //if it managed to grab it, add it to list of video files
    if (match)
    {
        targetVideos.push(match[1]);
    }

    else
    {
        //otherwise there's an incorrect line in the input
        discrepencyDetected=1;
    }
}

//dont do anything if theres a problem
if (discrepencyDetected)
{
    console.log("clipboard discrepency detected");
    console.log("clipboard:");
    console.log(clipboard);
    console.log();
    console.log("target videos:");
    console.log(targetVideos);
    return;
}

//make sure theres a new line at the end of the clipboard text before writing it into the file
if (clipboardText[clipboardText.length-1]!="\n")
{
    clipboardText+="\n";
}

fs.appendFile(logfile,clipboardText,()=>{});

console.log(targetVideos);
