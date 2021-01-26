const {Builder, By, Key}     = require("selenium-webdriver");
var remote                   = require('selenium-webdriver/remote');
const xlsxFile               = require('read-excel-file/node');
require('dotenv').config();


(async function() {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get(process.env.SITE);

    await xlsxFile(process.env.EXCEL).then(async (rows) => {
        
        for (i in rows){
            const account = await getData(process.env.EXCEL, i);
            await logIn(driver, account);
            console.log("Data ke-" + (i) + " passed")
        }
    })
}());

async function getData(data, i){
    var email='';
    var pass='';

    var rows = await xlsxFile(data);
    for (j in rows[i]){
        if (j == 0) {
            email = rows[i][j];
        }else if(j ==1){
            pass = rows[i][j];                  
        }
    };

    return {
        'email' :email,
        'pass' :pass
    };
}

async function logIn(driver, account){
    await driver.findElement(By.id('emailAddress')).sendKeys(account.email);
    await driver.findElement(By.id('password')).sendKeys(account.pass, Key.RETURN);
    await driver.sleep(1000);
    
    await driver.findElement(By.xpath("//*[@id='bs-example-navbar-collapse-1']/ul/li/a")).click();
    await driver.findElement(By.xpath("//*[@id='bs-example-navbar-collapse-1']/ul/li/ul/li/a")).click();
    await driver.sleep(1000);

}