
var login = new Vue({
	el:'#login',
	data:{
		email: '',
		password: ''
	},
	methods:{
		login: function(){
			if(localStorage.getItem("token") == "1"){
				location.href = "/quizz";
			}
			else{
			axios.post('/login',{
				email: this.email,
				password: this.password
			}).then(res =>{
				console.log(res)
				//localStorage.setItem('token', res.data.data.token)	
				localStorage.setItem('token', "1")		
				location.href = "/quizz"
			}).catch(err =>{
				console.log(err)
			});
		}
		}
		
	}
})
 var reg = new Vue({
	el:'#reg',
	data:{
		email:'',
		login:'',
		password: ''
	},
	methods:{
		register: function(){
			axios.post('/register',{
				//console.log(email+login + password),
                email: this.email,
				login: this.login,
				password: this.password
			}).then(res =>{
				console.log(res.data)
				alert("Вы успешно зарегистрированы");
				location.href = "/register";
			}).catch(err=>{
				console.log(email+login + password)

			});
		}
	}
})



var quiz = new Vue({
	el:'#quiz',
	data:{
		quizzes: []
	},
	methods:{
		list_of_quiz: function(){
			axios.get('/quiz',{
		
			}).then(res =>{
				this.quizzes = res.data.quiz;
				this.quizzes = value;
				console.log(res.data.quiz)
				//alert("Вы успешно зарегистрированы");
			}).catch(err=>{
			});
		}
	}
})


var exit = new Vue({
	el:'#exit',
	data:{},
	methods:{
		quit: function(){
			axios.get('/',{
				params:{
					token: localStorage.getItem('token')
				}
			}).then(res =>{
				localStorage.removeItem(this.email)
				localStorage.removeItem('token')
				console.log(res.data)
				location.href = "/register";

			}).catch(err=>{
				console.log(err)

			});

		}
	}
})

var stat = new Vue({
	el:'#stat',
	data:{
		results: []
	},
	methods:{
		list_of_stat: function(){
			axios.get('/statistics',{	
			}).then(res =>{
				this.results = res.data.stat;
				this.results = value;
				console.log(res.data.stat)
				//alert("Вы успешно зарегистрированы");
			}).catch(err=>{
			});
		}
	}
})

