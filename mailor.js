var nodemailer = require("nodemailer");
var dateformat = require('dateformat');

//メールタイトル
const MAIL_TITLE = '【Montculatorからのお知らせ】';
//メッセージヘッダー(入山)
const MESSAGE_HEADER_ENTERING = '【入山のお知らせ】';
//メッセージヘッダー(下山)
const MESSAGE_HEADER_DESCENDING = '【下山のお知らせ】';
//改行コード
const LINEFEED_CODE = '\n';
//送信元
const MAIL_SOURCE = 'from Montculator';

//メールタイトルを作成します
function createTitle(status, username) {
    var title = '';
    if (status == 'Entering') { //入山
        title = username + 'さんが入山しました' + MAIL_TITLE;
    } else if(status == 'Descending') { //下山
        title = username + 'さんが下山しました' + MAIL_TITLE;
    }
    return title;
}

//メール本文を作成します
function createMessage(status, username, mountainName) {
    var message = '';
    var nowdate = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    if (status == 'Entering') { //入山
        message = MESSAGE_HEADER_ENTERING + LINEFEED_CODE + username + 'さんが' + mountainName + 'へ' + nowdate + 'に入山しました。';
    } else if(status == 'Descending') { //入山
        message = MESSAGE_HEADER_DESCENDING + LINEFEED_CODE + username + 'さんが' + mountainName + 'から' + nowdate + 'に下山しました。';
    }
    //送信元を追加
    message = message + LINEFEED_CODE + LINEFEED_CODE + MAIL_SOURCE;
    return message;
}

module.exports = {
    //入山・下山のメールを送信します
    sendMessage: function(email, username, status, mountainname) {
        //SMTPサーバの設定
        nodemailer.SMTP = {
            host: "smtp.gmail.com",
            port: 465,
            ssl: true,
            use_authentication: true,
            user: "mountculator@gmail.com",
            pass: "kota0224"
        };
        //メール情報
        var message = {
            sender: 'mountculator@gmail.com',
            to: email,
            subject: createTitle(status, username),
            body: createMessage(status, username, mountainname)
        };
        console.log('message is ...');
        console.log(message);
        //メールを送信します
        nodemailer.send_mail(message, function(err, success) {
            if (err) {
                console.log(err);
            } else if (success) {
                console.log(success);
            }
        });
    },

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
            subject: "【デモです】montculatorよりALERTMAIL",
            body: "安倍晋三さんが遭難した可能性があります。\n至急本人に連絡を取ってください。\n連絡が取れない場合は、最寄の警察まで連絡してください\nfrom montculatorより",
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
