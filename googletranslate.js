const chromeOptions = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chromeOptions.Options().headless())
    .build();
var url = 'http://translate.google.com';
driver.get(url);
var count = 2,
    length = 0;
var results = {
    arrayLang: [],
    arrayIndex: [],
}
var finalData = '';

Pause(4, OpenLanguageBox);

function OpenLanguageBox() {
    driver.findElement(By.className('tl-more tlid-open-target-language-list')).click();
    // console.log('Box Opened');
    Pause(4, GetIdAndLang);
}

function GetIdAndLang() {
    var ids = '';
    Pause(1, function() {
        if (count != 111) {
            driver.findElement(By.xpath('//div[@class="language-list-unfiltered-langs-tl_list"]/div[2]/div[' + (count) + ']')).getAttribute('class').then(function(id) {
                console.log(id);
                if (typeof id.split('-')[1] != 'undefined' && typeof id.split('-')[2] != 'undefined') {
                    ids = id.split('-')[1] + '-' + id.split('-')[2];
                } else {
                    ids = id.split('-')[1]
                }
                var finalId = ids.replace('item-selected', '');
                console.log(finalId);
                results.arrayIndex.push(finalId);
            });
            driver.findElement(By.xpath('//div[@class="language-list-unfiltered-langs-tl_list"]/div[2]/div[' + (count) + ']')).getText().then(function(txt) {
                console.log(txt);
                results.arrayLang.push(txt);
            });
            count++;
            GetIdAndLang();
        } else {
            count = 0;
            Pause(2, AppendToArray);
        }
    });
}
var fileName = 'Languages.js';

function AppendToArray() {
    var languages = {};
    for (var i = 0; i < results.arrayIndex.length; i++) {
        languages[results.arrayLang[i].toLowerCase()] = results.arrayIndex[i];
    }
    finalData = "exports.languages = [" + JSON.stringify(languages) + "];";
    fs.stat(fileName, function(err, status) {
        if (!err) {
            fs.unlink(fileName, function(err) {
                if (err)
                    console.log(err);
                console.log("File Was present")
                fs.appendFileSync(fileName, '' + finalData + '\n');
            });
        } else {
            console.log("New file")
            fs.appendFileSync(fileName, '' + finalData + '\n');
        }
    });
    QuitDriver();
}

function Pause(Time, FuncName) {
    setTimeout(FuncName, Time * 1000);
}

function QuitDriver() {
    driver.close();
    driver.quit();
}