var nodemailer = require("nodemailer");

module.exports = {

alertMail: function() {
//SMTPサーバーの設定
nodemailer.SMTP = {
host: "smtp.gmail.com",
port: 465,
ssl: true,
use_authentication: true,
user: "kkjjhhrr0224@gmail.com",
pass: "kota0224"
};

//メール情報の作成
var message = {
sender: 'kkjjhhrr0224@gmail.com',
to: 'axszndddns@i.softbank.jp',
subject: "monculatorよりALERTMAIL",
body: "安倍晋三さんが遭難した可能性があります。\n至急本人に連絡を取ってください。\n連絡が取れない場合は、最寄の警察まで連絡してください\nfrom monculatorより",
};

var callback = function(err, success) {
if(err) {
console.log('Error occured!!!');
console.log(err.message);
return;
} else if (success) {
console.log('Message was sent successfully.');
}
};
var mail;
try {
console.log('now send a mail...');
mail = nodemailer.send_mail(message, callback);
} catch(e) {
console.log('caught exception...', e);
}
}
};
