const colorRegex = /color:\s*rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/;

function styleReduce(span) {
    const newspan = document.createElement('span');
    newspan.style.cssText = span.style.cssText;
    newspan.innerText = span.innerText;
    // 将新的div元素替换为目标元素
    span.parentNode.replaceChild(newspan, span);

}
function newSpanCreate(num, nspan, subject, answer) {
    answer[num] = []
    subject[num] = []
    span2 = nspan.getElementsByTagName('span')
    remain = false
    stip = false
    for (p1 = 0; p1 < span2.length; p1++) {
        para = span2[p1]
        inanswer = ''
        if (colorRegex.test(para.style.cssText)) {
            remain = true
            stip = true
            const newspan2 = document.createElement('span');
            newspan2.innerHTML = '<span>' + '_'.repeat(parseInt(para.innerText.length * 2.5) + 4) + '</span>'
            para.parentNode.replaceChild(newspan2, para);
            inanswer = (num + 1) + '. ' + para.innerText
            answer[num].push(para.innerText);
            document.getElementById('text-a').innerHTML += inanswer + '<p>';
            if (stip & Math.random() > 0.6) {
                break
            }
        }
    }
    if (remain) {
        const newspan = document.createElement('span');
        newspan.innerHTML = '<span>' + (num + 1) + '. ' + nspan.innerText + '</span><p>';
        document.getElementById('text-c').appendChild(newspan);
        const createP = document.createElement('p');
        document.getElementById('text-c').appendChild(createP);
        subject[num].push(nspan.innerText);
        remain = false
    }
    return subject, answer
}
function testStyleReduce() {
    // childttest = document.getElementById('test-e').children
    childttest = document.getElementById('test-e').getElementsByTagName('span')
    for (span1 = 0; span1 < childttest.length; span1++) {
        span = childttest[span1]
        spancsstext = span.style.cssText
        // 保留所有颜色
        // if (colorRegex.test(spancsstext)) {
        //     span.style.cssText = colorRegex.exec(spancsstext);
        //     styleReduce(span)
        // } else {
        //     span.style.cssText = ''
        //     styleReduce(span)
        // }
        // 保留红色、绿色、蓝色
        if (spancsstext.includes('color: rgb(255, 0, 0)') || spancsstext.includes('color: rgb(0, 255, 0)') || spancsstext.includes('color: rgb(0, 0, 255)')) {
            span.style.cssText = colorRegex.exec(spancsstext);
            styleReduce(span)
        } else {
            span.style.cssText = ''
            styleReduce(span)
        }
    }
}

function answerOutput(answer) {
    answerhtml = ''
    answer = Object.values(answer)
    for (span1 = 0; span1 < answer.length; span1++) {
        newsp = answer[span1]
        if (newsp.length == 0) {
            continue
        }
        answerhtml += '<p>' + (span1 + 1) + '. ' + '<span>' + newsp.join('<span style="color:#696969"> ; </span>') + '</span></p>'
    }
    return answerhtml
}
function score(answer){
    answer = Object.values(answer)
    totalCount = answer.reduce((count, arr) => count + arr.length, 0);
    return totalCount
}
function selectNumbers(numbers, realnum) {
    numbers = Array.from(numbers)
    var selectedNumbers = [];
    for (var j = 0; j < realnum; j++) {
        var randomIndex = Math.floor(Math.random() * numbers.length);
        selectedNumbers.push(numbers[randomIndex]);
        numbers.splice(randomIndex, 1);
    }
    return selectedNumbers;
}
function test2Paper() {
    text_c = document.getElementById('test-e').innerHTML;
    testStyleReduce()
    answer = {}
    subject = {}
    childttest = document.getElementById('test-e').getElementsByTagName('p')
    realgetnum = new Set()
    for (span1 = 0; span1 < childttest.length; span1++) {
        span2 = childttest[span1]
        pare = span2.getElementsByTagName('span')
        for (p1 = 0; p1 < pare.length; p1++) {
            para = pare[p1]
            if (colorRegex.test(para.style.cssText)) {
                realgetnum.add(span1)
            }
        }
    }
    realnum = document.getElementById('text-b').value
    selectedNumbers = selectNumbers(realgetnum, realnum)
    for (span1 = 0; span1 < childttest.length; span1++) {
        console.log(span1, selectedNumbers, selectedNumbers.includes(span1))
        if (selectedNumbers.includes(span1)) {
            span = childttest[span1]
            subject, answer = newSpanCreate(span1, span, subject, answer)
        }
    }
    subjecthtml = answerOutput(subject)
    answerhtml = answerOutput(answer)
    answerTotalCount = score(answer)
    tocount = '<span>一、填空题（共计' + answerTotalCount + '个空/2分）</span><p></p>' + subjecthtml
    document.getElementById('text-c').innerHTML = tocount
    document.getElementById('text-a').innerHTML = answerhtml
    document.getElementById('test-e').innerHTML = text_c
}

function html2doc() {
    $("#text-c").wordExport('题目');//notice_title为储存了导出Word文件名称的input控件ID
    $("#text-a").wordExport('答案');//notice_title为储存了导出Word文件名称的input控件ID
}