import { publicKey } from "src/config/config"


export class Util {

  static judgePassword(password:string):boolean {
          //获得密码       
          if(!/^(?!\d+$)(?![a-zA-Z]+$)\w{8,20}$/.test(password)||/(\w)\1{3}/.test(password)) {
            return false
          }
          var judgeArr = [
            '0123456789', 
            'abcdefghijklmnopqrstuvwxyz',
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
          ]
          for(let item of judgeArr) {
            let v = password.toLowerCase()
            for(let i = 0;i<=v.length - 5;i++) {
              if(
              v.includes(item.substr(i, 4)) || 
              v.split('').reverse().join('').includes(item.substr(i, 4))
              )
              {
                console.log(v)
                console.log(i)
                console.log(item.substr(i, 4))
                console.log(v.includes(item.substr(i, 4)))
                console.log(v.split('').reverse().join('').includes(item.substr(i, 4)))
                return false
              }
            }
          }
          // console.log(password)
           
          return true;
  }

  static getCurrentTime() {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    let time = year + "-" + month.toString().padStart(2,'0') + "-" + date.toString().padStart(2,'0') + " " + hour.toString().padStart(2,'0')  + ":" + minu.toString().padStart(2,'0')  + ":" + sec.toString().padStart(2,'0') ;
    return time;
  }

  static AESDecrypt(text) {
    let CryptoJS = require("crypto-js");
    var bytes  = CryptoJS.AES.decrypt(text.toString(), publicKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static AESEncrypt(text) {
    let CryptoJS = require("crypto-js");
    return CryptoJS.AES.encrypt(text, publicKey).toString();
  }
}