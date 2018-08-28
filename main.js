// CONFIG
const pokedex = document.getElementById('pokedex');
const BASE_API = 'https://pokeapi.co/api/v2/';

// DOM del Modal
const modalContent = document.getElementById('modal-content');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

// DOM del loader superior
const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loader-count');
const loaderImg = document.getElementById('loader-img');

// DOM de botones
const allPokeBtn = document.getElementById('btn-all-pk');
const btnTypeList = document.getElementById('btn-type-pk');
btnTypeList.addEventListener('click', typeListBtns);
allPokeBtn.addEventListener('click', getAllPokemons)

	// Lista de Botones
	btnMenuList = document.querySelectorAll('li');
	for(let i = 0; i < btnMenuList.length; i++){
		btnMenuList[i].addEventListener('click', function(e){
			for(let i = 0; i < btnMenuList.length; i++){
				btnMenuList[i].classList.remove('active');
			}
			this.classList.add('active');
		});
	}


// Boton para cerrar modal
const btnClose = document.getElementById('btn-close');
btnClose.addEventListener('click', function(e){
	e.preventDefault();
	modal.classList.remove('modalIn');
	modal.classList.add('modalOut');
	setTimeout(function(){
		overlay.classList.toggle('overlayOn');
	}, 1000);
})



function alerta(){
	// Funcion de testeo de eventos
	alert('funciona');
}

// Funcion para renderizar pokemons despues de hacer la consulta
function renderPokemon (data){
	let container = document.createElement("div");
	container.setAttribute('data-id', data.id);
	container.classList.add("pokemon");
	let capitalName = data.name.charAt(0).toUpperCase() + data.name.slice(1); 
	container.innerHTML = `
		<img src="${data.sprites.front_default}" alt="pokemon">
		<h3>${capitalName}</h3>
	`;

	container.addEventListener('click', renderModal);
	pokedex.appendChild(container);
}

// Funcion para renderizar botones
function renderTypeButtons(data){
	let container = document.createElement("div");
	container.setAttribute('data-type', data.name);
	container.classList.add("type-button");
	let capitalName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
	container.innerHTML = `
			<img src="img/${data.name}-type.png" alt="" />
			<h3>${capitalName}</h3>
		`;
	container.addEventListener('click', getTypeofPokemon);
	pokedex.appendChild(container);
}

// Funcion para renderizar pokemon dentro del modal
async function renderModal(e){
		let pokeID = this.dataset.id;
		overlay.classList.toggle('overlayOn');
		modal.classList.remove('modalOut');
		modal.classList.add('modalIn');
		randomPika(modalContent);
		await fetch(`${BASE_API}pokemon/${pokeID}`)
			.then(function(response){
				return response.json();
			})
			.then(async function(data){

				let color;
				let habitat;
				let generacion;

				await fetch(`${data.species.url}`)
					.then(function(response){
						return response.json();
					})
					.then(function(data2){
						color = data2.color.name;
						habitat = data2.habitat.name;
						generacion = data2.generation.name;
					})
					.catch(function(e){
						console.log('Hubo un error : -->' + e);
					})

				let capitalName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
				let weight = data.weight / 10;
				let height = data.height / 10;
				let types = data.types;
				let typesPK = [];
				let typesSTR = "";
				let typesSTRname = "";
				types.forEach(function(el){
					typesPK.unshift(el.type.name);
				});
				typesPK.forEach(function(el){
					typesSTR += `<div class="oneType">
									<img width="20px" src="img/${el}-type.png" alt="" />
									<p>${el}</p>
								</div>`;
					typesSTRname += `<img width="60px" src="img/${el}-type.png" alt="" />`
				});

				modalContent.innerHTML = `
					<div class="modal-img">
						<img src="${data.sprites.front_default}" alt="pokemon"">
					</div>
					<div class="modal-name">
						<div class="name">
							<span>#${data.id}</span>
							<h2>${capitalName}</h3>
						</div>
						<div class="type-img">
							${typesSTRname}
						</div>
					</div>
					<div class="modal-data">
						<table>
							<tr>
								<th>Tipo</th>
								<td>
									<div class="typesText">
										${typesSTR}
									</div>
								</td>
							</tr>
							<tr>
								<th>Color</th>
								<td>${color}</td>
							</tr>
							<tr>
								<th>Altura</th>
								<td>${height} m.</td>
							</tr>
							<tr>
								<th>Peso</th>
								<td>${weight} kg.</td>
							</tr>
							<tr>
								<th>Habitat</th>
								<td>${habitat}</td>
							</tr>
							<tr>
								<th>Generacion</th>
								<td>${generacion}</td>
							</tr>
						</table>
					</div>
				`;
			})
			.catch(function(e){
				console.log('Hubo un error: -->' + e);
			})

	}


// Funciones y variables para pedir pokemones
let stopper = false;

// Todos los pokemones
async function getAllPokemons(){

	if(!stopper){
		loaderCount.innerHTML = "";
		loader.classList.remove('loader-on');
	}

	randomPika(pokedex);
	stopper = true;

	console.log("pidiendo lista de pokemones");
	loader.classList.add('loader-on');
	loaderCount.innerHTML = 'Obteniendo pokemones';

	await fetch(`${BASE_API}pokemon`)
		.then(function(response){
			console.log("lista obtenida");
			return response.json();
		})
		.then(async function(data){
			stopper = false;
			let pokemones = data.results;
			let numPokes = pokemones.length;
			console.log("renderizando pokemones");
			loaderCount.innerHTML = 'Cargando';
			pokedex.innerHTML = "";

			for(let i = 0; i < numPokes; i++){
				if (stopper) {return;}

				await fetch(`${BASE_API}pokemon/${pokemones[i].name}`)
					.then(function(response){
						return response.json();
					})
					.then(function(data){
						if (stopper) {return;}
						renderPokemon(data);
					})
					.catch(function(e){
						console.log(e);
					})				

				loaderCount.innerHTML = `${i +1} / ${numPokes}`;
			}

			loaderCount.innerHTML = "Finalizado";
			loaderImg.setAttribute('src', 'img/pika02.gif');
			setTimeout(function(){
				loaderImg.setAttribute('src', 'img/pika01.gif');
				loader.classList.remove('loader-on');
			}, 4000);
		})
		.catch(function(e){
			console.log('Hubo un error: -->' + e);
		})
}

// Pokemones por tipo
async function getTypeofPokemon(e){
	let typePK = this.dataset.type;
	if(!stopper){
		loaderCount.innerHTML = "";
		loader.classList.remove('loader-on');
	}
	randomPika(pokedex);
	stopper = true;

	loader.classList.add('loader-on');
	loaderCount.innerHTML = 'Obteniendo pokemones';

	console.log(`pidiendo lista de pokemones tipo ${typePK}`);

	await fetch(`${BASE_API}type/${typePK}`)
		.then(function(response){
			console.log("lista obtenida");
			return response.json();
		})
		.then(async function(data){
			stopper = false;
			let numPokes = data.pokemon.length;
			let pokemones = data.pokemon;

			console.log("renderizando pokemones");
			loaderCount.innerHTML = 'Cargando';
			pokedex.innerHTML = "";

			for(let i = 0; i < numPokes; i++){
				if (stopper) {return;}
				await fetch(`${BASE_API}pokemon/${pokemones[i].pokemon.name}`)
					.then(function(response){
						return response.json();
					})
					.then(function(data){
						if (stopper) {return;}
						renderPokemon(data);
					})
					.catch(function(e){
						console.log(e);
					})

				loaderCount.innerHTML = `${i +1} / ${numPokes}`;
			}

			loaderCount.innerHTML = "Finalizado";
			loaderImg.setAttribute('src', 'img/pika02.gif');
			setTimeout(function(){
				loaderImg.setAttribute('src', 'img/pika01.gif');
				loader.classList.remove('loader-on');
			}, 4000);
		})
		.catch(function(e){
			console.log('Hubo un error: -->' + e);
		})
}

// Renderizado de botones de TIPO
async function typeListBtns(){
	if(!stopper){
		loaderCount.innerHTML = "";
		loader.classList.remove('loader-on');
	}
	randomPika(pokedex);
	stopper = true;
	console.log('Buscando lista de Tipos');
	await fetch(`${BASE_API}type/`)
		.then(function(response){
			return response.json();
		})
		.then(function(data){
			stopper = false;
			pokedex.innerHTML = "";
			console.log('Cargando lista de tipos');
			for(let i = 0; i < data.results.length; i++){
				if (stopper) {return;}
				renderTypeButtons(data.results[i]);
			}
			console.log('Lista de tipos cargada');
		})
		.catch(function(e){
			console.log('Hubo un error: -->' + e);
		})
}

// funcion pikachu loader random

function randomPika(cont){
	displayCont = cont.dataset.loader;
	let num = Math.random() * 10;
	num = num.toFixed();
	let pika;
	if(num < 4){
		pika = 'pika-surf';
	} else if(num >= 4 && num < 7){
		pika = 'pika-run';
	} else if(num >= 7){
		pika = 'pika-guitar';
	}

	cont.innerHTML = `
		<div class="${displayCont}">
			<img src="img/${pika}.gif" alt="">
		</div>
	`;
}