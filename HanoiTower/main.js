"use strict";
var myTimer = null;
var moveInfo;
var moveInc = 1;
var speed;

var callStack;

var barsInfo = [{}, {}, {}, {}, {}];

var diskPosTop, diskPosLeft, DiskID;

window.onload = function() {
    diskPosTop = new Array();
    diskPosLeft = new Array();
    DiskID = [disk0, disk1, disk2, disk3, disk4]
    for (var i = 0; i < 5; i++) {
        diskPosTop[i] = DiskID[i].style.top;
        diskPosLeft[i] = DiskID[i].style.left;
    }

}

function executeHanoi() {
    var speed = parseInt(speedSelectList.options[speedSelectList.selectedIndex].value);
    var diskCount = parseInt(diskSelectList.options[diskSelectList.selectedIndex].value);
    // alert(diskCount);
    // var diskCount =3;

    // Diskleri başlangıç sütununa taşı
    for (var i = 0; i < 5; i++) {
        DiskID[i].style.top = diskPosTop[i];
        DiskID[i].style.left = diskPosLeft[i];
    }

    barsInfo[0].disks = ['disk0', 'disk1', 'disk2', 'disk3', 'disk4'];
    //alert(barsInfo[0].disks.pop().id);
    barsInfo[1].disks = [];
    barsInfo[2].disks = [];
    barsInfo[3].disks = [];
    barsInfo[4].disks = [];

    switch (diskCount) {
        case 3:
            barsInfo[0].disks.pop();
            barsInfo[0].disks.pop();
            disk3.style.display = "none";
            disk4.style.display = "none";
            break;

        case 4:
            barsInfo[0].disks.pop();
            disk4.style.display = "none";
            break;
    }

    callStack = []; // callStack dizisi global olmalı

    Hanoi(diskCount, 0, 2, 1);

    moveDisk(); // moveDisk parametrelerini callStack'ten alır
}


function Hanoi(n, from, to, via) {
    if (n == 0) return;

    Hanoi(n - 1, from, via, to);
    // moveDisk(from,to);

    callStack.push([from, to]); // parametreleri callStack dizisine kaydet
    Hanoi(n - 1, via, to, from);

}

function moveDisk() {
    if (callStack.length == 0) return;

    var param = callStack.shift();
    var fromBar = param[0];
    var toBar = param[1];

    var elem = document.getElementById(barsInfo[fromBar].disks.pop()); // fromBarda üst elemanı bul

    moveInfo = {
        elem: elem,
        fromBar: fromBar,
        toBar: toBar,
        whichPos: "top", // hareket için
        dir: -1, // 1 veya -1
        state: "up", // yukarı hareket
        endPos: 60 // yukarı hareket için(piksel cinsinden) bitiş konumu
    }

    myTimer = setInterval(animateMove, speed); // Animasyonu başlat
}

function karmasiklikHesapla(disk) {
    return (Math.pow(2, disk) - 1);

}

function animateMove() {
    var elem = moveInfo.elem;
    var dir = moveInfo.dir;

    var pos = parseInt(elem[(moveInfo.whichPos == "left") ? "offsetLeft" : "offsetTop"]);

    if (((dir == 1) && (pos >= moveInfo.endPos)) || ((dir == -1) && (pos <= moveInfo.endPos))) {
        if (moveInfo.state == "up") {
            moveInfo.state = "hor";
            moveInfo.whichPos = "left";
            moveInfo.dir = 1;
            if (moveInfo.fromBar > moveInfo.toBar) moveInfo.dir = -1;
            //alert("toBar:" + moveInfo.toBar);
            var toBar = document.getElementById("bar" + moveInfo.toBar);
            // Sonraki satır : 15px (kule genişliğinin yarısı)   
            moveInfo.endPos = toBar.offsetLeft - Math.floor(elem.offsetWidth / 2) + 15;
            return;
        } else if (moveInfo.state == "hor") // aşağı hareket
        {
            moveInfo.state = "down";
            moveInfo.whichPos = "top";
            moveInfo.dir = 1;
            //alert(elem.offsetHeight);
            moveInfo.endPos = document.getElementById("bottombar").offsetTop - (barsInfo[moveInfo.toBar].disks.length + 1) * elem.offsetHeight;
            return;
        } else {
            clearInterval(myTimer); // timer ı iptal et
            barsInfo[moveInfo.toBar].disks.push(elem.id);
            moveDisk();
            return;
        }
    }


    // Diski taşı
    pos = pos + dir * moveInc;
    elem.style[moveInfo.whichPos] = pos + "px";

    if (moveInfo.state == "up") {
        var fromBar = document.getElementById("bar" + moveInfo.fromBar);
        if (elem.offsetTop < fromBar.offsetTop) {
            var x = elem.getElementsByClassName("insideImg")[0].offsetHeight;
            if (x > 0) elem.getElementsByClassName("insideImg")[0].style.height = x - moveInc + "px";
        }
    }

    if (moveInfo.state == "down") {
        var toBar = document.getElementById("bar" + moveInfo.toBar);
        if (elem.offsetTop > toBar.offsetTop) {
            var x = elem.getElementsByClassName("insideImg")[0].offsetHeight;
            if (x < 14) elem.getElementsByClassName("insideImg")[0].style.height = x + moveInc + "px";
        }
    }

}