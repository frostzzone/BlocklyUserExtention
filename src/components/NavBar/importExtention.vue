<template>
	<li class="nav-item">
		<a class="nav-link active" aria-current="page" @click="loadEx" style="cursor: pointer;">click to load extention</a>
		<input hidden @change="load" id="load-code" type="file" accept=".js,.txt" />
	</li>
</template>

<script>
	//import { data } from '../../store.js'
	import {
		mapWritableState
	} from 'pinia'
	import {
		data
	} from '../../store.js'

	import Swal from "sweetalert2";
	import JSZip from "jszip";
	import * as virm from 'vm-browserify';

	const Toast = Swal.mixin({
		toast: true,
		background: '#ef2b48',
		color: '#000',
		position: 'bottom-end',
		showConfirmButton: false,
		timer: 5000,
		timerProgressBar: true,
		didOpen: (toast) => {}
	})

	export default {
		name: "filemenu",
		/*computed: {
    ...mapWritableState(data, ['workspace','extentions', 'S4D'])
	},*/
		setup() {
			const states = data()

			return {
				states
			}
		},
		methods: {
			loadEx() {
				//console.log(this.states)
				Swal.fire({
					title: 'How do you want to load extention',
					showDenyButton: true,
					showCancelButton: true,
					confirmButtonText: 'Url',
					confirmButtonColor: '#3085d6',
					denyButtonText: `File`,
					denyButtonColor: '#3085d6',
				}).then((result) => {
					if (result.isConfirmed) {
						// Load from URL
						Swal.fire('Saved!', '', 'success')
						this.askForUrl()
					} else if (result.isDenied) {
						// Load from File
						this.askForFile()
					}
				});

			},
			askForFile() {
				document.querySelector("#load-code").click();
			},
			askForUrl() {
				let S4D = this.states.S4D
				S4D.register = this.states.addExtention;
				let UpToolBox = this.states.registerToolbox;
				let currentTb = this.states.currentTb;

				Swal.fire({
					title: 'Submit extention URL',
					input: 'text',
					inputAttributes: {
						autocapitalize: 'off'
					},
					showCancelButton: true,
					confirmButtonText: 'Submit',
					showLoaderOnConfirm: true,
					preConfirm: (url) => {
						return fetch(url)
							.then(response => {
								if (!response.ok) {
									throw new Error(response.statusText)
								}
								return response.text()
							})
							.catch(error => {
								Swal.showValidationMessage(
									`Request failed: ${error}`
								)
							})
					},
					allowOutsideClick: () => !Swal.isLoading()
				}).then((result) => {
					if (result.isConfirmed) {
						let data = result.value;
						if (!data.includes('S4D.register(')) {
							Swal.fire({
								title: `error`,
								text: `No extention is being registered`
							})
						} else {
							const vmcode = `(()=>{
try{
 ${data}
 } catch(err){
 return err
 }
 return {name: "ok", message: "passed register"}
 })()`

							const context = virm.runInNewContext(vmcode, {
								S4D
							});
							if (context.name == 'Error') {
								Toast.fire({
									icon: 'error',
									title: context.message
								})

							} {
								try {
								UpToolBox(currentTb);
							} catch (err) {
									console.log(err)
								Toast.fire({
									icon: 'error',
									title: err.message
								})
							}
							}
						}
					}
				})
			},
			async load() {
				let S4D = this.states.S4D
				S4D.register = this.states.addExtention;
				let UpToolBox = this.states.registerToolbox;
				let currentTb = this.states.currentTb;
				const file = document.getElementById("load-code").files[0];
				//document.querySelector("#docName").textContent = documentName;
				const fileReader = new FileReader();
				fileReader.readAsText(file);
				fileReader.onload = function() {
					//console.log(fileReader.result)
					if (!fileReader.result.includes('S4D.register(')) {
						Swal.fire({
							title: `error`,
							text: `No extention is being registered`
						})
					} else {
						const vmcode = `(()=>{
			try{
 ${fileReader.result}
 } catch(err){
 return err
 }
 return S4D
 })()`

						const context = virm.runInNewContext(vmcode, {
							S4D
						});
						if (context.name == 'Error') {
							Toast.fire({
								icon: 'error',
								title: context.message
							})

						} {
							try {
								UpToolBox(currentTb);
							} catch (err) {
								Toast.fire({
									icon: 'error',
									title: err.message
								})
							}
							//eval(fileReader.result);
						}
					}
				};
				fileReader.onerror = function() {
					alert(fileReader.error);
				};
			},
		},
	}
</script>