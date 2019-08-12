#!/usr/bin/env node

const clipboardy=require("clipboardy");
const fs=require("fs");
const chalk=require("chalk");

const logfile="testing/testlog.log";
const targetFolder="../../videos/vids";
const moveToFolder="../../videos/completed";

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

try
{
    var clipboardText=clipboardy.readSync();
}

catch
{
    console.log("clipboard error".red);
    return;
}

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
    console.log(chalk.red("clipboard discrepency detected"));
    console.log(chalk.red("clipboard:"));
    console.log(clipboardText);
    console.log();
    console.log(chalk.cyan("target videos:"));
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
        console.log(chalk.red(`couldn't find ${chalk.yellow(targetVideos[x])}.`));
        discrepencyDetected=1;
    }
}

//quit if coulndt find something
if (discrepencyDetected)
{
    console.log(chalk.red("clipboard:"));
    console.log(clipboardText);
    console.log(chalk.red(`cancelling.`));
    return;
}

//if all target videos are there, move them
for (var x=0,l=targetVideos.length;x<l;x++)
{
    videoPath=`${targetFolder}/${targetVideos[x]}`;
    fs.rename(videoPath,`${moveToFolder}/${targetVideos[x]}`,()=>{});
    console.log(chalk.green(`${chalk.yellow(targetVideos[x])} moved.`));
}

//make sure theres a new line at the end of the clipboard text before writing it into the file
if (clipboardText[clipboardText.length-1]!="\n")
{
    clipboardText+="\n";
}

fs.appendFile(logfile,clipboardText,()=>{});