const clipboardy=require("clipboardy");
const fs=require("fs");
const colors=require("colors");

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
    console.log("clipboard discrepency detected".red);
    console.log("clipboard:".red);
    console.log(clipboard);
    console.log();
    console.log("target videos:".cyan);
    console.log(targetVideos);
    return;
}

//just check if all the videos to move exist, abort if even one of them are
//missing
var videoPath;
for (var x=0,l=targetVideos.length;x<l;x++)
{
    videoPath=`${targetFolder}/${targetVideos[x]}`;
    if (!fs.existsSync(videoPath))
    {
        console.log(`couldn't find ${colors.yellow(targetVideos[x])}.`.red);
        discrepencyDetected=1;
    }
}

//quit if coulndt find something
if (discrepencyDetected)
{
    console.log("clipboard:".red);
    console.log(clipboardText);
    console.log(`cancelling.`.red);
    return;
}

//if all target videos are there, move them
for (var x=0,l=targetVideos.length;x<l;x++)
{
    videoPath=`${targetFolder}/${targetVideos[x]}`;
    fs.rename(videoPath,`${moveToFolder}/${targetVideos[x]}`,()=>{});
    console.log(colors.green(`${colors.yellow(targetVideos[x])} moved.`));
}

//make sure theres a new line at the end of the clipboard text before writing it into the file
if (clipboardText[clipboardText.length-1]!="\n")
{
    clipboardText+="\n";
}

fs.appendFile(logfile,clipboardText,()=>{});