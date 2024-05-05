/**
 * 用于处理试卷转换的类，包括筛选特定样式的文本、生成答案与题目文档等操作。
 */
class test2Paper {
    /**
 * 正则表达式，用于匹配颜色样式。
 */
    colorRegex = /color:\s*rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/;
    /**
     * 构造函数，初始化答题和题目相关的DOM引用及点击事件。
     * @param {string} id - 触发转换操作的按钮ID。
     * @param {Object} dom - 包含各部分DOM元素ID的对象。
     */
    constructor(id, dom) {
        this.typeOfExamQuestion = ['单选', '多选', '判断', '填空'];
        this.answer = {}
        this.answerList = []
        this.answerListChai = []
        this.subject = {}
        document.getElementById(id).onclick = () => {
            this.testNum = [document.getElementById(dom.testNum[0]).value,
            document.getElementById(dom.testNum[1]).value,
            document.getElementById(dom.testNum[2]).value,
            document.getElementById(dom.testNum[3]).value]
            this.testlist = this.generateTestList(
                this.testNum,
                this.typeOfExamQuestion);
            this.doms = {
                text_a: document.getElementById(dom.answer),
                text_b: parseInt(document.getElementById(dom.testNum[0]).value)
                    + parseInt(document.getElementById(dom.testNum[1]).value)
                    + parseInt(document.getElementById(dom.testNum[2]).value)
                    + parseInt(document.getElementById(dom.testNum[3]).value),
                text_c: document.getElementById(dom.test),
                test_e: document.getElementById(dom.knowledge),
            }
            this.sentList = this.splitSentence(this.doms.test_e.innerText)
            this.content = this.doms.test_e.innerHTML;
            this.doms.test_e.innerHTML = this.content.replaceAll(/[!?。？！]/g, '</p><p>')
            this.testToPaper()
        };
    }
    /**
     * 根据arr1中各元素的值，生成一个新数组，新数组中arr2的每个元素
     * 将根据arr1对应位置的值重复出现相应次数。
     * @param {number[]} arr1 - 一个包含非负整数的数组，决定每个元素重复的次数。
     * @param {any[]} arr2 - 一个任意类型的数组，其元素将被复制。
     * @returns {any[]} 一个新数组，包含按照arr1指示重复次数的arr2元素。
     */
    generateTestList(arr1, arr2) {
        let result = []; // 初始化结果数组
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr1[i]; j++) {
                result.push(arr2[i]);
            }
        }
        // 完成所有重复操作后，返回结果数组
        return result;
    }

    /**
     * 根据样式重置span元素并替换原元素。
     * @param {HTMLElement} span - 原始的span元素。
     */
    styleReduce(span) {
        const newspan = document.createElement('span');
        newspan.style.cssText = span.style.cssText;
        newspan.innerText = span.innerText;
        // 将新的div元素替换为目标元素
        span.parentNode.replaceChild(newspan, span);
    }
    /**
     * 生成与输入字符串位数相同的随机数字，返回一个数组，包含输入数字+1，+2，-1，-2的结果。
     * 支持输入为十进制或中文数字。
     *
     * @param {string} inputString - 输入的数字字符串。
     * @returns {string[]} 包含输入数字+1，+2，-1，-2的数组。
     */
    generateAdjustedChineseNumbers(inputString) {
        // 中文数字到阿拉伯数字的映射
        const chineseToArabic = {
            '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
            '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
        };
        // 阿拉伯数字到中文数字的映射
        const arabicToChinese = {
            0: '零', 1: '一', 2: '二', 3: '三', 4: '四',
            5: '五', 6: '六', 7: '七', 8: '八', 9: '九'
        };
        // 获取数字位数
        const numberOfDigits = inputString.length;
        // 检查输入是否为数字（十进制或中文数字）
        if (!/^\d+$/.test(inputString) && !/^[零|一|二|三|四|五|六|七|八|九]+$/.test(inputString)) {
            return [inputString];
        }
        // 检查输入是否为数字（十进制或中文数字）
        else if (/^[零|一|二|三|四|五|六|七|八|九]+$/.test(inputString)) {
            // 如果输入是中文数字，转换为阿拉伯数字
            let arabicInput = inputString.split('').map(chineseDigit => chineseToArabic[chineseDigit]).join('');
            // 生成+1，+2，-1，-2的数组
            const adjustedArabicNumbers = [
                parseFloat(arabicInput) + 2,
                parseFloat(arabicInput) + 1,
                parseFloat(arabicInput),
                parseFloat(arabicInput) - 1,
                parseFloat(arabicInput) - 2
            ];
            // 转换回中文数字并保持位数
            const adjustedChineseNumbers = adjustedArabicNumbers.map(num => {
                const chineseNums = num.toString().split('').map(digit => arabicToChinese[parseInt(digit)]);
                return chineseNums.join('').padStart(numberOfDigits, '零');
            });
            return adjustedChineseNumbers;
        } else if (/\d/.test(inputString)) {
            const adjustedArabicNumbers = [
                parseFloat(inputString) + 2,
                parseFloat(inputString) + 1,
                parseFloat(inputString),
                parseFloat(inputString) - 1,
                parseFloat(inputString) - 2
            ];

            return adjustedArabicNumbers;
        }
    }

    /**
     * 随机化输入字符串中的字母
     * @param {string} inputStr - 输入的字符串，可能包含字母和其他字符
     * @returns {string} - 返回一个新字符串，其中的字母已被替换为字母表内的随机字母
     */
    randomizeLetters(inputStr) {
        let result = '';
        for (let i = 0; i < inputStr.length; i++) {
            const char = inputStr[i];
            if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                // 生成一个字母表内的随机偏移量
                const offset = Math.floor(Math.random() * 25);
                let newCharCode;
                if (char >= 'a' && char <= 'z') {
                    // 小写字母的处理
                    newCharCode = ((char.charCodeAt(0) - 'a'.charCodeAt(0) + offset) % 26) + 'a'.charCodeAt(0);
                } else {
                    // 大写字母的处理
                    newCharCode = ((char.charCodeAt(0) - 'A'.charCodeAt(0) + offset) % 26) + 'A'.charCodeAt(0);
                }
                result += String.fromCharCode(newCharCode);
            } else {
                // 非字母字符直接保留
                result += char;
            }
        }
        return result;
    }
    /**
     * 检查两个字符串是否含有至少num个相同的字符。
    //  * 如果任一字符串长度小于等于5，则降低要求到至少有2个相同字符。
     *
     * @param {string} str1 - 第一个字符串。
     * @param {string} str2 - 第二个字符串。
    //  * @param {number} [num=5] - 默认要求的相同字符数量。
     * @returns {boolean} 如果满足条件返回true，否则返回false。
     */
    hasMoreThanFiveSameChars(str1, str2) {
        let count = 0;
        let set = new Set();
        // if (str1.length <= 5 || str2.length <= 5) {
        //     num = 2;
        // }
        for (let i = 0; i < str1.length; i++) {
            if (!set.has(str1[i])) {
                set.add(str1[i]);
                if (str2.includes(str1[i])) {
                    count++;
                    // if (count >= num) {
                    //     return true;
                    // }
                }
            }
        }
        return count;
    }
    /**
     * 判断两个单词是否在同一句话中
     * @param {string} sentence - 待检测的句子
     * @param {string} word1 - 第一个单词
     * @param {string} word2 - 第二个单词
     * @returns {boolean} - 如果两个单词在同一句话中，则返回true，否则返回false
     */
    areWordsInSameSentence(sentence, word1, word2) {
        // 创建正则表达式以匹配单词顺序，支持word1在前或word2在前的情况
        const regex = RegExp(`${word1}.*${word2}|${word2}.*${word1}`);
        // 使用正则表达式测试句子中是否存在匹配
        return regex.test(sentence);
    }
    /**
     * 对给定的对象进行排序，返回一个新对象，其键值对按照值从大到小排序。
     * @param {Object} obj - 待排序的对象，其键值对表示需要排序的数据。
     * @returns {Object} - 排序后的新对象，键值对按照值从大到小排列。
     */
    dictSort(obj) {
        // 将对象转换为键值对数组并按照值进行排序
        const sortedObj = Object.entries(obj).sort((a, b) => b[1] - a[1]);
        // 将排序后的键值对数组转换回对象
        return Object.fromEntries(sortedObj);
    }
    /**
     * 根据输入单词的类型查找匹配项，并生成相应的变体或查找相似度高的单词。
     * 支持数字（中文或阿拉伯数字）、纯字母单词的随机化变体生成，以及查找具有至少5个相同字符的单词。
     * 若结果数量不足四个，尝试从相邻句子中寻找匹配项。
     *
     * @param {string} word - 输入的单词，可以是数字（中文或阿拉伯数字）或纯字母字符串。
     * @param {Object} answerList - 用于查找匹配项的对象，键为单词，值为相关信息。
     * @returns {Object} - 包含匹配项及其权重的结果对象。权重默认设为9999或实际匹配字符数。
     */
    findMatchingElements(wordc, answerList) {
        const result = {};
        const word = wordc.join('')
        if (this.checkType(wordc) === '数组' && (/[a-zA-Z]/.test(word) || /[0-9]/.test(word))) {

        } else {
            // 根据输入单词的类型生成匹配项
            if (/^[零|一|二|三|四|五|六|七|八|九]+$/.test(word)) {
                // 生成四个随机数字
                const number = word.match(/^[零|一|二|三|四|五|六|七|八|九]+$/g)[0];

                let numberResult = this.generateAdjustedChineseNumbers(number);
                numberResult = numberResult.filter((item, index) => item !== number);
                numberResult = this.shuffleArray(numberResult);
                result[word.replace(number, numberResult[0])] = 9999;
                result[word.replace(number, numberResult[1])] = 9999;
                result[word.replace(number, numberResult[2])] = 9999;
                return result;
            } else if (/\d/.test(word) && !/[a-zA-Z]/.test(word) && !word.includes('%')) {
                // 替换数字并生成四个随机数字
                const number = word.match(/[0-9]+/g)[0];
                let numberResult = this.generateAdjustedChineseNumbers(number);
                numberResult = numberResult.filter((item, index) => item !== parseFloat(number));
                numberResult = this.shuffleArray(numberResult);
                result[word.replace(number, numberResult[0])] = 9999;
                result[word.replace(number, numberResult[1])] = 9999;
                result[word.replace(number, numberResult[2])] = 9999;
                return result;
            } else if (/^[a-zA-Z]+$/.test(word)) {
                // 随机化字母并生成四个随机化单词
                result[this.randomizeLetters(word)] = 9999;
                result[this.randomizeLetters(word)] = 9999;
                result[this.randomizeLetters(word)] = 9999;
                return result;
            }
        }

        // 查找具有5个以上相同字符的单词
        let newword = this.chaiZi(word);
        let newALKeys = Object.keys(answerList);
        let newALValues = Object.values(answerList);
        for (let i = 0; i < newALValues.length; i++) {
            let newALValuesi = newALValues[i]
            const nearlyNum = [...newword].filter((char, index) => char === newALValues[i][index]).length;
            // let nearlyNum = this.hasMoreThanFiveSameChars(newword, newALValues[i])
            if ((newword.length <= 5 || newALValuesi.length <= 5) && nearlyNum > 3) {
                result[newALKeys[i]] = nearlyNum;
            } else if (nearlyNum > 5) {
                result[newALKeys[i]] = nearlyNum;
            }
        }
        // 如果结果不足四个，查找在句子中与输入单词相邻的单词
        if (Object.keys(result).length < 4) {
            const liSen = this.sentList
            for (let i = 0; i < liSen.length; i++) {
                for (let j of newALKeys) {
                    let newsent = liSen[i] + liSen[i + 1] + liSen[i + 2] + liSen[i + 3];
                    if (this.areWordsInSameSentence(newsent, word, j)) {
                        result[newALKeys[i]] = 1;
                    }
                }
            }
        }
        // result.delete(undefined);
        // 将Set转换为Array并返回结果
        return result;
    }
    /**
     * 根据输入单词的类型查找匹配项，并生成相应的变体或查找相似度高的单词。
     * 支持数字（中文或阿拉伯数字）、纯字母单词的随机化变体生成，以及查找具有至少5个相同字符的单词。
     * 若结果数量不足四个，尝试从相邻句子中寻找匹配项。
     * 第二轮查找不论如何皆为0
     * @param {string} word - 输入的单词，可以是数字（中文或阿拉伯数字）或纯字母字符串。
     * @param {Object} answerList - 用于查找匹配项的对象，键为单词，值为相关信息。
     * @returns {Object} - 包含匹配项及其权重的结果对象。权重默认设为9999或实际匹配字符数。
     */
    findMatchingElements0(word, answerList) {
        const result = {};
        // 查找具有5个以上相同字符的单词
        let newword = this.chaiZi(word);
        let newALKeys = Object.keys(answerList);
        let newALValues = Object.values(answerList);
        for (let i = 0; i < newALValues.length; i++) {
            let newALValuesi = newALValues[i]
            const nearlyNum = [...newword].filter((char, index) => char === newALValues[i][index]).length;
            // let nearlyNum = this.hasMoreThanFiveSameChars(newword, newALValues[i])
            if ((newword.length <= 5 || newALValuesi.length <= 5) && nearlyNum > 3) {
                result[newALKeys[i]] = nearlyNum;
            } else if (nearlyNum > 5) {
                result[newALKeys[i]] = nearlyNum;
            }
        }
        // 如果结果不足四个，查找在句子中与输入单词相邻的单词
        if (Object.keys(result).length < 4) {
            const liSen = this.sentList
            for (let i = 0; i < liSen.length; i++) {
                for (let j of newALKeys) {
                    let newsent = liSen[i] + liSen[i + 1] + liSen[i + 2] + liSen[i + 3];
                    if (this.areWordsInSameSentence(newsent, word, j)) {
                        result[newALKeys[i]] = 1;
                    }
                }
            }
        }
        // 将Set转换为Array并返回结果
        return result;
    }
    /**
    * 根据规则筛选并处理文档中的span元素样式。
    */
    testStyleReduce() {
        const childttest = this.doms.test_e.getElementsByTagName('span');
        const answerList = new Set();
        for (const span of childttest) {
            const spancsstext = span.style.cssText;
            const matchedColor = this.colorRegex.exec(spancsstext);

            // 如果匹配到红色、绿色或蓝色，则保留当前颜色样式；否则，清除样式。
            if (matchedColor &&
                (matchedColor[0].includes('255, 0, 0') ||
                    matchedColor[0].includes('0, 255, 0') ||
                    matchedColor[0].includes('0, 0, 255'))) {
                // 由于正则已经匹配到了正确的颜色样式，这里不需要再次赋值
                answerList.add(span.innerText.replaceAll(' ', ''));
            } else {
                span.style.cssText = ''; // 清除样式
            }
            // 只在样式有变化时调用styleReduce
            if (matchedColor) {
                this.styleReduce(span);
            }
        }
        this.answerList = Array.from(answerList)
    }
    /**
 * 将文本按句子分割，支持常见的句末标点（包括换行符、问号、感叹号及中文句号、问号、感叹号）。
 * 过滤掉空字符串，确保返回的数组中每个元素都是非空的句子。
 *
 * @param {string} text - 待分割的文本字符串。
 * @returns {string[]} 分割后的句子数组。
 */
    splitSentence(text) {
        const punctuation = /\n|[!?。？！]+/;
        const textSplit = text.split(punctuation);
        const result = textSplit.filter(item => item.trim() !== '');
        return result;
    }

    /**
     * 从给定数组中随机选择元素，确保结果数组包含指定的include数组中的所有元素，
     * 并补充随机选择的其他元素直到结果数组长度达到4。
     *
     * @param {any[]} arr - 可供随机选择的元素数组。
     * @param {any[]} include - 必须包含在结果中的元素数组。
     * @returns {any[]} 长度为4的包含指定元素的随机数组。
     */
    getRandomList(arr, include) {
        arr = arr.filter(item => !include.includes(item));
        const includedItems = Array.from(new Set(include));
        const result = []
        while (result.length < 4 - include.length) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            const item = arr[randomIndex];
            if (!includedItems.includes(item) && !result.includes(item)) {
                result.push(item);
                includedItems.push(item); // 添加到已包含的元素集合中
            }
            arr.splice(randomIndex, 1); // 移除已选中的元素，避免重复选取
        }
        return result;
    }

    /**
     * 返回数组中最长的字符串元素。
     *
     * @param {string[]} arr - 字符串数组。
     * @returns {string} 数组中最长的字符串。
     */
    getLongestElement(arr) {
        return arr.reduce((longest, current) => {
            return current.length > longest.length ? current : longest;
        }, '');
    }

    /**
     * 随机打乱数组的元素顺序。
     *
     * @param {any[]} array - 要打乱的数组。
     * @returns {any[]} 打乱后的数组。
     */
    shuffleArray(array) {
        // for (let i = array.length - 1; i > 0; i--) {
        //     let j = Math.floor(Math.random() * (i + 1));
        //     [array[i], array[j]] = [array[j], array[i]]; // ES6解构赋值交换元素
        // }
        return array.sort(() => Math.random() - 0.5);;
    }

    /**
     * 将输入的汉字单词分解为更小的单位（如拼音或部首），使用预定义的映射`chaizi`。
     * 不可分解的字符保持原样。
     *
     * @param {string} word - 需要分解的汉字字符串。
     * @returns {string} 分解后的字符串。
     */
    chaiZi(word) {
        let chaiword = '';
        for (let key of word) {
            let pianPang = chaizi[key];
            if (pianPang !== undefined) {
                chaiword += pianPang;
            } else {
                chaiword += key;
            }
        }
        chaiword = chaiword.replaceAll(' ', ''); // 移除可能的空格
        return chaiword;
    }

    /**
     * 应用`chaiZi`方法处理`answerList`中的每个元素，并返回一个新对象，
     * 其中键为原始答案，值为经过处理后的字符串。
     *
     * @returns {Object.<string, string>} 处理后的答案映射对象。
     */
    chaiAnswerList() {
        this.answerListChai = {};
        for (let i of this.answerList) {
            const caizi = this.chaiZi(i);
            this.answerListChai[i] = caizi;
        }
        return this.answerListChai;
    }
    /**
     * 检查并返回给定值的数据类型。
     * 
     * @param {*} value 需要检查类型的值
     * @returns {string} 返回值的数据类型，如"数组"、"对象"、"字符串"、"数字"、"布尔值"、"函数"、"null"或"其他类型"
     */
    checkType(value) {
        if (Array.isArray(value)) {
            return "数组";
        } else if (typeof value === "string") {
            return "字符串";
        } else if (typeof value === "number") {
            return "数字";
        } else if (typeof value === "boolean") {
            return "布尔值";
        } else if (typeof value === 'function') {
            return '函数';
        } else if (value instanceof Object) {
            return '对象';
        } else if (value === null) {
            return "null";
        } else {
            return "其他类型";
        }
    }

    /**
     * 在数组中查找指定目标的索引位置。
     * 如果目标是数组，则返回每个元素在arr中的索引组成的数组；
     * 如果目标是字符串，则返回该字符串在arr中的第一个索引位置组成的单元素数组。
     * 
     * @param {Array} arr 被搜索的数组
     * @param {*} target 需要在数组中查找的目标值或目标数组
     * @returns {Array<number>} 目标值在数组中的索引位置组成的数组，如果未找到则返回空数组
     */
    findAnswerOption(arr, target) {
        if (this.checkType(target) === '数组') {
            return this.replaceNumbersWithLetters(target.map(t => arr.indexOf(t)));
        }
        else if (this.checkType(target) === '字符串') {
            return this.replaceNumbersWithLetters([arr.indexOf(target)])
        }
    }
    /**
     * 将数组中的数字替换为预定义字母表中的对应字母。
     *
     * 此函数接收一个包含非负整数的数组，其中每个整数代表
     * 'A' 到 'E' 字母表中的一个位置（索引）。它将这些数字映射到相应的
     * 字母上并返回一个新的数组，其中原始数字已被相应的字母替换。
     *
     * @param {number[]} arr - 一个包含整数的数组，整数范围应该是[0, 4]，
     *                         用于映射到 'A' 到 'E' 的字母。
     * @returns {string[]} 一个新的数组，其中每个元素都是原始数组中数字对应的字母。
     *
     * @example
     * replaceNumbersWithLetters([0, 3, 1]); // returns ['A', 'D', 'B']
     */
    replaceNumbersWithLetters(arr) {
        const mapping = ['A', 'B', 'C', 'D'];
        return arr.map(num => mapping[num]);
    }
    /**
     * 合并两个对象，第一个字典优先。
     * 将`dict2`中的键值对合并到`dict1`中，并返回一个新的对象。
     * 如果`dict2`中的某个键在`dict1`中不存在，则将其添加到结果对象中。
     * 不会修改原始对象。
     * @param {Object} dict1 - 第一个对象，合并时作为基础。
     * @param {Object} dict2 - 第二个对象，其键值对将被合并到`dict1`中。
     * @returns {Object} - 合并后的新对象，包含了`dict1`和`dict2`的所有键值对。
     */
    mergeDicts(dict1, dict2) {
        const result = { ...dict1 }; // 创建dict1的浅拷贝作为结果对象
        for (const key in dict2) { // 遍历dict2的键
            if (!result.hasOwnProperty(key)) { // 如果键不在结果对象中
                result[key] = dict2[key]; // 添加键值对到结果对象
            }
        }
        return this.dictSort(result); // 返回合并后的新对象
    }
    /**
     * 删除数组中指定索引的元素并返回新数组。原数组不会被修改.
     *
     * @param {Array} arr - 要处理的数组.
     * @param {Array} del - 包含要删除元素索引的数组.
     * @returns {Array} - 返回一个新的数组，其中不包含指定索引的元素.
     */
    delrepeat(arr, del) {
        for (const key of del) {
            delete arr[key];
        }
        return arr;
    }
    /**
     * 比较两个字符串是否完全相等。
     *
     * @param {string} str1 - 第一个字符串用于比较。
     * @param {string} str2 - 第二个字符串用于比较。
     * @returns {boolean} - 如果两个字符串相等返回true，否则返回false。
     */
    isRight(str1, str2) {
        if (str1 === str2) {
            return true
        } else {
            return false
        }
    }
    /**
    * 格式化答案输出为HTML字符串。
    * @param {Object} answer - 答案对象。
    * @returns {string} 格式化后的HTML字符串。
    */
    subjectOutput(subject, answer) {
        let subjecthtml = ''
        let answer3 = Object.values(answer)
        let subject3 = Object.values(subject)
        let subjecthtmlRevised = {
            '单选': [],
            '多选': [],
            '判断': [],
            '填空': [],
        }
        for (let span1 = 0; span1 < subject3.length; span1++) {
            let subject1 = subject3[span1]
            let answer1 = answer3[span1]
            this.answerListChai = this.chaiAnswerList()
            if (subject1[0][1] === '单选') {
                let answer1Listold = this.findMatchingElements(answer1, this.answerListChai)
                let answer1List;
                let answer1ListoldKey = Object.keys(answer1Listold)
                if (answer1ListoldKey.length < 3) {//第4+个是答案本身
                    answer1List = this.mergeDicts(answer1Listold, this.findMatchingElements0(this.getLongestElement(answer1ListoldKey), this.answerListChai), answer1)
                } else {
                    answer1List = answer1Listold
                }
                answer1List = this.delrepeat(answer1List, answer1)
                let answer2option = Object.keys(answer1List).slice(0, 3);
                answer2option = this.shuffleArray([...answer1, ...answer2option]).flat()
                let html = '<span>' + subject1[0][0] + '</span></p>' +
                    `<p><table style="width: 100%;"><tr>
                <td style="width: 25%;">A. ${answer2option[0]}</td>
                <td style="width: 25%;">B. ${answer2option[1]}</td>
                <td style="width: 25%;">C. ${answer2option[2]}</td>
                <td style="width: 25%;">D. ${answer2option[3]}</td>
                </tr></table><br/>`
                subjecthtml += html
                let foundAnswerOption = this.findAnswerOption(answer2option, answer1)
                subjecthtmlRevised['单选'].push([html, answer1, foundAnswerOption])
            } else if (subject1[0][1] === '多选') {
                let answer1Listold = this.findMatchingElements(answer1, this.answerListChai)
                let answer1List;
                let answer1ListoldKey = Object.keys(answer1Listold)
                if (answer1ListoldKey.length < 3) {
                    answer1List = this.mergeDicts(answer1Listold, this.findMatchingElements0(this.getLongestElement(answer1ListoldKey), this.answerListChai), answer1)
                } else {
                    answer1List = answer1Listold
                }
                answer1List = this.delrepeat(answer1List, answer1)
                let answer2option = Object.keys(answer1List).slice(0, 4 - answer1.length);
                answer2option = this.shuffleArray([...answer1, ...answer2option]).flat()
                let html = '<span>' + subject1[0][0] + '</span></p>' +
                    `<p><table style="width: 100%;"><tr>
                <td style="width: 25%;">A. ${answer2option[0]}</td>
                <td style="width: 25%;">B. ${answer2option[1]}</td>
                <td style="width: 25%;">C. ${answer2option[2]}</td>
                <td style="width: 25%;">D. ${answer2option[3]}</td>
                </tr></table><br/>`
                subjecthtml += html
                let foundAnswerOption = this.findAnswerOption(answer2option, answer1)
                subjecthtmlRevised['多选'].push([html, answer1, foundAnswerOption])
            } else if (subject1[0][1] == '判断') {
                let answer1List = this.dictSort(this.findMatchingElements(answer1, this.answerListChai))
                let html;
                let answer1ListKey = Object.keys(answer1List)[0]
                // let foundAnswerOption = this.isRight(answer1ListKey, answer1[0])
                let foundAnswerOption = Math.random()>0.5
                if (foundAnswerOption) {
                    html = '<span>' + subject1[0][0].replaceAll('*class="panDuanTiHuan"', answer1) + '</span><br/>'
                    foundAnswerOption = '√'
                } else {
                    html = '<span>' + subject1[0][0].replaceAll('*class="panDuanTiHuan"', answer1ListKey) + '</span><br/>'
                    foundAnswerOption = '×'
                }
                subjecthtml += html
                subjecthtmlRevised['判断'].push([html, answer1, foundAnswerOption])
            } else if (subject1[0][1] == '填空') {
                let html = '<span>' + subject1[0][0] + '</span><br/>'
                subjecthtml += html
                subjecthtmlRevised['填空'].push([html, answer1])
            }
        }
        return subjecthtml, subjecthtmlRevised
    }
    /**
    * 计算答案总数量。
    * @param {Object} answer - 答案对象。
    * @returns {number} 答案总数。
    */
    score(answer) {
        return Object.values(answer).reduce((count, arr) => count + arr.length, 0)
    }
    /**
     * 随机选择指定数量的唯一元素。
     * @param {Iterable<number>} numbers - 可迭代的数字集合。
     * @param {number} realnum - 需要选择的元素数量。
     * @returns {number[]} 选中的数字数组。
     */
    selectNumbers(numbers, realnum, testlist, realgetnumdict) {
        // numbers = Array.from(numbers)
        numbers = [...numbers]
        let numberkeys = Object.keys(realgetnumdict)
        let numbervalues = Object.values(realgetnumdict)

        let selectedNumbers = {};
        let selectedDuoxuanNumbers = [];
        for (let nu = 0; nu < numbervalues.length; nu++) {
            if (numbervalues[nu] >= 2) {
                selectedDuoxuanNumbers.push(parseInt(numberkeys[nu]))
            }
        }
        selectedDuoxuanNumbers = this.shuffleArray(selectedDuoxuanNumbers).slice(0, this.testNum[1])
        numbers = numbers.filter(item => !selectedDuoxuanNumbers.includes(item))
        for (let j = 0; j < realnum; j++) {
            if (testlist[j] !== '多选') {
                let randomIndex = Math.floor(Math.random() * numbers.length);
                selectedNumbers[numbers[randomIndex]] = testlist[j];
                numbers.splice(randomIndex, 1);
            } else if (testlist[j] === '多选') {
                let randomIndex = Math.floor(Math.random() * selectedDuoxuanNumbers.length);
                selectedNumbers[selectedDuoxuanNumbers[randomIndex]] = '多选';
                selectedDuoxuanNumbers.splice(randomIndex, 1);
            }
        }
        delete selectedNumbers.undefined;
        return selectedNumbers;
    }
    /**
    * 导出HTML内容到Word文档。
    */
    html2doc() {
        $("#text-c").wordExport('题目');
        $("#text-a").wordExport('答案');
    }
    /**
     * 将给定对象的键值对反转，即将原来的键作为值，值作为键。
     * 新对象的结构为：{原值: 原键}
     *
     * @param {Object} obj - 输入对象，包含键值对。
     * @returns {Object} 输出对象，键值对反转后的结果。
     */
    invertKeysAndValues(obj) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {}); // 初始化一个空对象作为累积器
    }
    /**
    * 主处理函数，触发试卷转换流程。
    */
    testToPaper() {
        this.testStyleReduce()

        const childttest = this.doms.test_e.getElementsByTagName('p')
        const realgetnum = new Set()
        for (let span1 = 0; span1 < childttest.length; span1++) {
            const pare = childttest[span1].getElementsByTagName('span')
            for (let p1 = 0; p1 < pare.length; p1++) {
                const para = pare[p1]
                if (this.colorRegex.test(para.style.cssText)) {
                    realgetnum.add(span1)
                }
            }
        }
        const realgetnumdict = {}
        for (let span1 = 0; span1 < childttest.length; span1++) {
            if (realgetnum.has(span1)) {
                const pare = childttest[span1].getElementsByTagName('span')
                realgetnumdict[span1] = Array.from(pare).map(e => this.colorRegex.test(e.style.cssText)).filter(function (item) {
                    return item === true;
                }).length
                // realgetnumdict.push(Array.from(pare).map(e => this.colorRegex.test(e.style.cssText)).length)
            }
        }
        let realnum = this.doms.text_b
        let selectedNumbers = this.selectNumbers(realgetnum, realnum, this.testlist, realgetnumdict)
        this.subject = {}
        this.answer = {}
        let browlst = Object.keys(selectedNumbers)
        let selectedNumbersValues = {}
        for (const key in selectedNumbers) {
            if (key !== 'undefined') {
                selectedNumbersValues[parseInt(key)] = selectedNumbers[key];
            }
        }
        for (let span1 = 0; span1 < childttest.length; span1++) {
            if (browlst.includes(span1.toString())) {
                this.subject, this.answer = this.newSpanCreate(span1, childttest[span1], this.subject, this.answer, selectedNumbersValues)
            }
        }
        let subjecthtml, subjecthtmlRevised = this.subjectOutput(this.subject, this.answer)
        // let answerTotalCount = this.score(this.answer)
        // let tocount = '<span>一、填空题（共计' + answerTotalCount + '个空/2分）</span><p></p>' + subjecthtml
        // let tocount = subjecthtml
        let danxuananswerhtml = ''
        let duoxuananswerhtml = ''
        let panduananswerhtml = ''
        let tiankonganswerhtml = ''
        let danxuan = ''
        let duoxuan = ''
        let panduan = ''
        let tiankong = ''
        let countNum = 0
        let tocount1;
        let numChangeDict = {
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            7: '七',
            8: '八',
            9: '九',
            10: '十'
        }
        let numChangeDictFirst = 0;
        let tocount = '';
        let answerhtml = '';
        if (subjecthtmlRevised['单选'].length > 0) {
            ++numChangeDictFirst;
            tocount1 = `<p>${numChangeDict[numChangeDictFirst]}、单选题（共计${this.testNum[0]}个空/2分）</p>`
            danxuananswerhtml += `<p><table>`
            for (let i of subjecthtmlRevised['单选']) {
                countNum += 1
                danxuan += `<span>${(countNum)}. ${i[0].replaceAll('(（', '(').replaceAll('）)', ')').replaceAll('((', '(').replaceAll('))', ')')} </span>`
                danxuananswerhtml += `<tr>
            <td nowrap>${(countNum)}. ${i[2].join('')}</td>
            <td width='10px'>&nbsp;</td>
            <td>${i[1]}</td>
            </tr>`
            }
            danxuananswerhtml += `</table></p>`
            tocount += tocount1 + danxuan
            answerhtml += tocount1 + danxuananswerhtml
        }
        if (subjecthtmlRevised['多选'].length > 0) {
            ++numChangeDictFirst;
            tocount1 = `<br/><p>${numChangeDict[numChangeDictFirst]}、多选题（共计${this.testNum[1]}个空/3分）</p>`
            duoxuananswerhtml += `<p><table>`
            for (let i of subjecthtmlRevised['多选']) {
                countNum += 1
                duoxuan += `<span>${(countNum)}. ${i[0].replaceAll('(（', '(').replaceAll('）)', ')').replaceAll('((', '(').replaceAll('))', ')')} </span>`
                duoxuananswerhtml += `<tr>
            <td width='120px' nowrap>${(countNum)}. ${i[2].join('').split("").sort().join("")}</td>
            <td width='10px'>&nbsp;</td>
            <td>${i[1].join(' ; ')}</td>
            </tr>`
            }
            duoxuananswerhtml += `</table></p>`
            tocount += tocount1 + duoxuan
            answerhtml += tocount1 + duoxuananswerhtml
        }
        if (subjecthtmlRevised['判断'].length > 0) {
            ++numChangeDictFirst;
            tocount1 = `<br/><p>${numChangeDict[numChangeDictFirst]}、判断题（共计${this.testNum[2]}个空/2分）</p>`
            for (let i of subjecthtmlRevised['判断']) {
                countNum += 1
                panduan += `<span>(&nbsp;&nbsp;) ${(countNum)}. ${i[0]} </span>`
                panduananswerhtml += `<p>${(countNum)}. ${i[2]}</p>`
            }
            tocount += tocount1 + panduan
            answerhtml += tocount1 + panduananswerhtml
        }
        if (subjecthtmlRevised['填空'].length > 0) {
            ++numChangeDictFirst;
            tocount1 = `<br/><p>${numChangeDict[numChangeDictFirst]}、填空题（共计${this.testNum[3]}个空/2分）</p>`
            for (let i of subjecthtmlRevised['填空']) {
                countNum += 1
                tiankong += `<span>${(countNum)}. ${i[0]} </span>`
                tiankonganswerhtml += `<p>${(countNum)}. ${i[1]}</p>`
            }
            tocount += tocount1 + tiankong
            answerhtml += tocount1 + tiankonganswerhtml
        }
        this.doms.text_c.innerHTML = tocount
        this.doms.text_a.innerHTML = answerhtml
        this.doms.test_e.innerHTML = this.content
    }
    /**
     * 生成一个介于min（包含）和max（不包含）之间的随机整数。
     * min会被调整为Math.ceil(min - 1)，max会被调整为Math.floor(max - 1)。
     * 这意味着返回的随机整数范围是[min, max)。
     *
     * @param {number} min - 最小值（包含）。
     * @param {number} max - 最大值（不包含）。
     * @returns {number} 生成的随机整数。
     */
    getRandomInt(min, max) {
        min = Math.ceil(min - 1);
        max = Math.floor(max - 1);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
    * 创建新span元素并更新答案与题目对象。
    * @param {number} num - 当前处理的段落索引。
    * @param {HTMLElement} nspan - 当前处理的段落元素。
    * @param {Object} subject - 主题对象。
    * @param {Object} answer - 答案对象。
    * @returns {Array} 更新后的主题与答案对象数组。
    */
    newSpanCreate(num, nspan, subject, answer, selectedNumbersValues) {
        let countnum = 0
        answer[num] = []
        subject[num] = []
        const span2 = nspan.getElementsByTagName('span')
        let unshiftDuoxuan = false
        // let remain = false
        let stip = false
        let parePast;
        const span2List = Array.from(span2).map(e => this.colorRegex.test(e.style.cssText))
        const randNum = span2List.filter(function (item) {
            return item === true;
        }).length;
        if (randNum > 0) {
            for (let p1 = 0; p1 < span2.length; p1++) {
                let para = span2[p1]
                // let inanswer = ''
                if (this.colorRegex.test(para.style.cssText)) {
                    if (selectedNumbersValues[num] === '单选') {
                        if (!stip) {
                            const newspan2 = document.createElement('span');
                            newspan2.innerHTML = '<span>（' + '&nbsp;'.repeat(3) + '）</span>'
                            para.parentNode.replaceChild(newspan2, para);
                            // inanswer = (num + 1) + '. ' + para.innerText
                            answer[num].push(para.innerText);
                        }
                        if (stip && Math.random() > 0.4) {
                            try {
                                const newspan2 = document.createElement('span');
                                newspan2.innerHTML = '<span>（' + '&nbsp;'.repeat(3) + '）</span>'
                                para.parentNode.replaceChild(newspan2, para);
                                // inanswer = (num + 1) + '. ' + para.innerText
                                answer[num] = [para.innerText];
                            } catch (e) { console.log('单选', e); break }
                        }
                    } else if (selectedNumbersValues[num] === '多选' && countnum <= 4) {
                        if (!stip) {
                            const newspan2 = document.createElement('span');
                            newspan2.innerHTML = '<span>（' + '&nbsp;'.repeat(3) + '）</span>'
                            para.parentNode.replaceChild(newspan2, para);
                            // inanswer = (num + 1) + '. ' + para.innerText
                            answer[num].push(para.innerText);
                            parePast = para
                            ++countnum;
                        }
                        if (stip && (Math.random() > 0.4 || countnum == 1)) {
                            try {
                                // 在储蓄足够时随机删除第一个
                                if (Math.random() > 0.2 && randNum > 2) {
                                    unshiftDuoxuan = true
                                    --countnum;
                                }
                                const newspan2 = document.createElement('span');
                                newspan2.innerHTML = '<span>（' + '&nbsp;'.repeat(3) + '）</span>'
                                para.parentNode.replaceChild(newspan2, para);
                                // inanswer = (num + 1) + '. ' + para.innerText
                                answer[num].push(para.innerText);
                                ++countnum;
                                if (Math.random() > 0.4 && countnum >= 2) {
                                    if (unshiftDuoxuan) {
                                        para.parentNode.replaceChild(parePast, newspan2);
                                        answer[num] = answer[num].unshift();
                                    }
                                    break
                                }
                            } catch (e) { console.log('多选', e); break }
                        }
                        // countnum++;
                        // if (Math.random() > 0.4 && countnum >= 2) {
                        //     break
                        // }
                    } else if (selectedNumbersValues[num] === '判断') {
                        if (!stip) {
                            const newspan2 = document.createElement('span');
                            newspan2.innerHTML = '<span>*class="panDuanTiHuan"</span>'
                            para.parentNode.replaceChild(newspan2, para);
                            // inanswer = (num + 1) + '. ' + para.innerText
                            answer[num].push(para.innerText);
                        }
                        if (stip && Math.random() > 0.4) {
                            try {
                                const newspan2 = document.createElement('span');
                                newspan2.innerHTML = '<span>*class="panDuanTiHuan"</span>'
                                para.parentNode.replaceChild(newspan2, para);
                                // inanswer = (num + 1) + '. ' + para.innerText
                                answer[num] = [para.innerText];
                            } catch (e) { console.log('判断', e); break }
                        }
                    } else if (selectedNumbersValues[num] === '填空') {
                        if (!stip) {
                            const newspan2 = document.createElement('span');
                            newspan2.innerHTML = '<span>' + '_'.repeat(parseInt(para.innerText.length * 2.5) + 4) + '</span>'
                            para.parentNode.replaceChild(newspan2, para);
                            // inanswer = (num + 1) + '. ' + para.innerText
                            answer[num].push(para.innerText);
                        }
                        if (stip && Math.random() > 0.4) {
                            try {
                                const newspan2 = document.createElement('span');
                                newspan2.innerHTML = '<span>' + '_'.repeat(parseInt(para.innerText.length * 2.5) + 4) + '</span>'
                                para.parentNode.replaceChild(newspan2, para);
                                // inanswer = (num + 1) + '. ' + para.innerText
                                answer[num] = [para.innerText];
                            } catch (e) { console.log('填空', e); break }
                        }
                    }
                    // remain = true
                    stip = true
                    // this.doms.text_a.innerHTML += inanswer + '<p>';
                }
            }
            // if (remain) {
            const newspan = document.createElement('span');
            newspan.innerHTML = '<span>' + (num + 1) + '. ' + nspan.innerText + '</span><p>';
            this.doms.text_c.appendChild(newspan);
            const createP = document.createElement('p');
            this.doms.text_c.appendChild(createP);
            subject[num].push([nspan.innerText, selectedNumbersValues[num]]);
            // remain = false
            // }
        }
        return subject, answer
    }
}