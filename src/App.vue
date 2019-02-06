
<template>
  <div id="app" class="container">
    <div class="page-header">
      <h1>수호 #해시태그 <small> by flipside.tk</small></h1>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New HashTag</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-inline" v-on:submit.prevent="addHashTag">
          <div class="form-group">
            <label for="HashTagTitle">Title:</label>
            <input type="text" id="HashTagTitle" class="form-control" v-model="newHashTag.title">
          </div>
          <input type="submit" class="btn btn-primary" value="Add HashTag">
          <h3><small># 빼고 해시태그 입력하세요.</small></h3>
        </form>
      </div>

      <div class="panel-body">
        <form id="form" class="form-inline" v-on:submit.prevent="shakeHashTag">
          <input type="submit" class="btn btn-primary" value="#해시테그 추출">
          <input type="number" v-model.number="MaxTagCount" value={MaxTagCount}>
        </form>
        <br>
        <div class="form-group">
          <label for="HashTagList">#해시테그 리스트 : {{alertList}} </label>
          <button type="button" @click="doCopy"> = Copy = </button>
        </div>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">HashTag List ({{hashtags.length}})</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hashtag in hashtags">
              <td>{{hashtag.title}}</td>
              <td><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removenHashTag(hashtag)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
// import Hello from './components/Hello'
import Firebase from 'firebase'
import toastr from 'toastr'

var config = {
  apiKey: "AIzaSyCZfASKG4YgC8fsYGK7DmV5rd9H8ECYNO0",
  authDomain: "hashtag-fd483.firebaseapp.com",
  databaseURL: "https://hashtag-fd483.firebaseio.com",
  projectId: "hashtag-fd483",
  storageBucket: "hashtag-fd483.appspot.com",
  messagingSenderId: "363548257370"
}

let app = Firebase.initializeApp(config)
let db = app.database()
let hashtagsRef = db.ref('hashtag')

export default {
  name: 'app',
  firebase: {
    hashtags: hashtagsRef
  },

  data () {
    return {
      newHashTag: {
          title: ''
      },
      alertList : '',
      alertListCnt : 0,
      MaxTagCount : 30
    }
  },

  computed: {
    validation: function () {
      return {
        title: !!this.newHashTag.title.trim()
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },

   methods: {
      doCopy: function () {
        this.$copyText(this.alertList).then(function (e) {
          alert('Copied')
          console.log(e)
        }, function (e) {
          alert('Can not copy')
          console.log(e)
        })
      },
      shakeHashTag: function () { 
        this.alertList = ''
        this.alertListCnt = 0
        let hashtagList = this.hashtags

        for(let i = this.hashtags.length - 1; i >= 0; i--) {
          let randomIndex = Math.floor(Math.random() * i);
          
          let temp = hashtagList[i];
          hashtagList[i] = hashtagList[randomIndex];
          if( this.alertListCnt < this.MaxTagCount ) {
            if( this.alertList == '' ){
              this.alertList = '#' + hashtagList[i].title
            } else {
              this.alertList = this.alertList  + ' #' +hashtagList[i].title
            }
          }
          hashtagList[randomIndex] = temp;
          this.alertListCnt++;
        }
      },
      addHashTag: function () {
    		if (this.isValid) {
          //if ( this.hashtags.length >= this.MaxTagCount ){
          //  toastr.warning('최대 해시태그 저장 MAX( ' + this.hashtags.length + ' )까지 입니다.')
          //  this.newHashTag.title = '';
          //  return
          //} 

          for(let i = this.hashtags.length - 1; i >= 0; i--) {
            let temp = this.hashtags[i];
            if ( temp.title == this.newHashTag.title ) {
              toastr.warning('중복되는 해시태그( ' + this.newHashTag.title + ' ) 입니다.')
              
              this.newHashTag.title = '';
              return
            }
          }

          hashtagsRef.push(this.newHashTag);
          this.newHashTag.title = '';
          toastr.success('HashTag added successfully')
          
  	  	} else {
          for(let i = this.hashtags.length - 1; i >= 0; i--) {
            let temp = this.hashtags[i];
            if ( temp.title == this.newHashTag.title ) {
              toastr.warning('중복되는 해시태그( ' + this.newHashTag.title + ' ) 입니다.')
              
              this.newHashTag.title = '';
              return
            }
          }
  		  	toastr.warning('The data is empty!')
        }
      },
      removenHashTag: function (hashtag) {
        hashtagsRef.child(hashtag['.key']).remove()
        toastr.success('HashTag removed successfully')
      }
   }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
