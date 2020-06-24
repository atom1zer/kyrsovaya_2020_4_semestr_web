
var login = new Vue({
	el:'#login',
	data:{
		email: '',
		password: ''
	},
	methods:{
		login: function(){
			axios.post('/login',{
				email: this.email,
				password: this.password
			}).then(res =>{
				console.log(res)
				localStorage.setItem('token', res.data.data.token)
				location.href = "/";
			}).catch(err =>{
				console.log(err)
			});
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
// var exit = new Vue({
// 	el:'#exit',
// 	data:{

// 	},
// 	methods:{
// 		exit: function(){
// 			axios.get('https://sign10.herokuapp.com/logout',{
// 				params:{
// 					token: localStorage.getItem('token')
// 				}
// 			}).then(res =>{
// 				console.log(res.data)
// 				location.href = "index.php";

// 			}).catch(err=>{
// 				console.log(err)

// 			});

// 		}
// 	}
// })
