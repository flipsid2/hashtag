
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
          <input type="submit" class="btn btn-primary" value="Shake HashTag">
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">HashTag List</h3>
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
          title: '',
          author: '11',
          url: 'http://'
      },
      alertList : ''
    }
  },

  computed: {
    validation: function () {
      return {
        title: !!this.newHashTag.title.trim(),
        author: !!this.newHashTag.author.trim()
		// url:
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
      shakeHashTag: function () { 
        for(let i = this.hashtags.length - 1; i >= 0; i--) {
          let randomIndex = Math.floor(Math.random() * i);
          
          let temp = this.hashtags[i];
          this.hashtags[i] = this.hashtags[randomIndex];
          if( this.alertList == '' ){
            this.alertList = '#' + this.hashtags[i].title
          } else {
            this.alertList = this.alertList  + ', #' +this.hashtags[i].title
          }
          this.hashtags[randomIndex] = temp;
        }
        alert(this.alertList)
        this.alertList = ''
      },
      addHashTag: function () {
  		if (this.isValid) {
        if ( this.hashtags.length >= 5 ){
          toastr.warning('최대 해시태그 저장 MAX( ' + this.hashtags.length + ' )까지 입니다.')
          return
        } 

        for(let i = this.hashtags.length - 1; i >= 0; i--) {
          let temp = this.hashtags[i];
          if ( temp.title == this.newHashTag.title ) {
            toastr.warning('중복되는 해시태그( ' + this.newHashTag.title + ' ) 입니다.')
            
            this.newHashTag.title = '';
            this.newHashTag.author = '';
            this.newHashTag.url = 'http://';
            return
          }
        }

        hashtagsRef.push(this.newHashTag);
          this.newHashTag.title = '';
          this.newHashTag.author = '';
          this.newHashTag.url = 'http://';
        toastr.success('HashTag added successfully')
        
	  	} else {
        for(let i = this.hashtags.length - 1; i >= 0; i--) {
          let temp = this.hashtags[i];
          if ( temp.title == this.newHashTag.title ) {
            toastr.warning('중복되는 해시태그( ' + this.newHashTag.title + ' ) 입니다.')
            
            this.newHashTag.title = '';
            this.newHashTag.author = '';
            this.newHashTag.url = 'http://';
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
