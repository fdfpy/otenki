var app=new Vue({
  el:'#app',

  data:{

    status:false, //day(昼) or night(夜)を格納する変数
    message:'', //天気の概要を取得する。
    title:'',  // 天気予報の場所を取得する。
    telop:{     
      today:'',   //今日の天気を格納する
      tomorrow:'' //明日の天気を格納する
    },
    tempL:0, //今日、もしくは明日の最低気温を格納する
    tempH:0, //今日、もしくは明日の最高気温を格納する
    url:'', //今日、もしくは明日の天気の画像を格納する
    now:'', //現在時刻を取得する。
    hour:'', //hourを取得する
    settime:15,   //day(昼)とnight(夜)のしきい時間 hour を決めている。
    hinichi:'', //天気の概要の対象日を取得する


},

// Vueインスタンス作成時に実行する。
  created:function(){
    this.getTenki()
    this.gettime()
  },



  methods:{

    //文字列をseoaratorを指定して分割する関数
    moji_split:function(stringToSplit,separator){
      var arrayOfStrings = stringToSplit.split(separator);
      return arrayOfStrings[0]
      },

   //現在時刻の取得
    gettime:function(){
    
      this.now=this.moji_split(new Date().toLocaleTimeString()," ") //現在時刻をxx:xx:xxの形式で取得する
      dd=new Date()
      this.hour= dd.getHours()  //現在時刻 hourのみを取得している
    },

   //現在時刻の取得とAPIより天気の取得を行う
    revised:function(){
      this.gettime()
      this.getTenki()  
    },

    //今日、もしくは明日の天気を取得する
    getTenki:function(){
      //APIにアクセス
      axios.get('ajax.php?url=http://weather.livedoor.com/forecast/webservice/json/v1?city=340010')
      .then(function(response){
           //console.log(response.data)   //デバッグ用コード
           //console.log(response.data.forecasts[0].image) //デバッグ用コード
           //console.log(response.data.forecasts[0].image.url) //デバッグ用コード
        this.message=response.data.description.text //天気の概要を取得
        this.hinichi=this.moji_split(response.data.description.publicTime,"T") //天気の概要の対象日を取得する     
        this.title=response.data.title // 天気予報の場所を取得する。
        this.telop.today=response.data.forecasts[0].telop //今日の天気を取得する
        this.telop.tomorrow=response.data.forecasts[1].telop //明日の天気を取得する。  
      // status=night(夜の場合)
        if(this.hour >= this.settime) {
        //明日の最低気温を取得する。時刻によってはデータがないことがあるのでエラーの場合のフォローをしている
          try{
          this.tempL=response.data.forecasts[1].temperature.min.celsius 
          }catch(e) { this.tempL='NA' } //明日の最低気温
          this.tempH=response.data.forecasts[1].temperature.max.celsius  //明日の最高気温
          this.url=response.data.forecasts[1].image.url //明日の天気の絵を取得 
          this.status='night'       
 
      // status=day(昼の場合)
        }else{
        //今日の最低気温取得する。 時刻によってはデータがないことがあるのでエラーの場合のフォローをしている
          try{
              this.tempL=response.data.forecasts[0].temperature.min.celsius//今日の最低気温 
          }catch(e) {
            this.tempL="NA"
         }
        //今日の最高気温取得。 時刻によってはデータがないことがあるのでエラーの場合のフォローをしている
          try{
           this.tempH=response.data.forecasts[0].temperature.max.celsius
         }catch(e) {
          this.tempH="NA"
          } 
           this.url=response.data.forecasts[0].image.url //今日の天気の絵を取得     
           this.status='day' 
      }
      }.bind(this)) 
    //エラーが発生すれば.catchに処理が流れる
    .catch(function(error){
      this.message = 'ERROR'
    }.bind(this))
    //APIの処理の完了時.finallyに処理が流れる
    .finally(function(){

    }.bind(this))
  }
  }
})

//これより下は通常のJavascriptとなっている。

//現在時刻の取得とAPIより天気の取得を行う
var count=0;
var countup=function() {
  app.revised()
}

setInterval(countup,1000*60*60)  //countupを1時間に1度実施する



