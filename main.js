const pokedex = document.getElementById('pokedex');
const BASE_API = 'https://pokeapi.co/api/v2/';

const modalContent = document.getElementById('modal-content');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

const linkTypeList = document.querySelectorAll('#type-list li');

const loader = document.getElementById('loader');
const loaderCount = document.getElementById('loader-count');
const loaderImg = document.getElementById('loader-img');


const dropdownTypeBox = document.getElementById('dropdown-type');

const allPokeBtn = document.getElementById('btn-all-pk');
const btnTypeList = document.getElementById('btn-type-pk');
// const normalPokeBtn = document.getElementById('btn-normal-pk');

allPokeBtn.addEventListener('click', getAllPokemons);
btnTypeList.addEventListener('click', dropdownList);
// normalPokeBtn.addEventListener('click', getTypeofPokemon);

for(let i = 0; i < linkTypeList.length; i++){
	linkTypeList[i].addEventListener('click', function(){
		let typePK = this.dataset.type;
		getTypeofPokemon(typePK);
	});
}

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

function dropdownList(){
	dropdownTypeBox.classList.toggle('dropdown-type-down');
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

// Funcion para renderizar pokemon dentro del modal
async function renderModal(e){
		let pokeID = this.dataset.id;
		overlay.classList.toggle('overlayOn');
		modal.classList.remove('modalOut');
		modal.classList.add('modalIn');
		modalContent.innerHTML = `<div class="loading-modal"><img src="img/loading.gif" alt=""/></div>`;
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
						console.log(data2);
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
				console.log(e);
			})

	}

let stopper = false;


// Funcion para pedir todos los pokemones
async function getAllPokemons(){

	if(!stopper){
		loaderCount.innerHTML = "";
		loader.classList.remove('loader-on');
	}
	pokedex.innerHTML = "";
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

// Pedir pokemones por tipo de pokemones
async function getTypeofPokemon(type){
	let typePK = type;
	if(!stopper){
		loaderCount.innerHTML = "";
		loader.classList.remove('loader-on');
	}
	pokedex.innerHTML = "";
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