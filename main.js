const pokedex = document.getElementById('pokedex');
const BASE_API = 'https://pokeapi.co/api/v2/';

async function getAllPokemons(){

	fetch(`${BASE_API}pokemon`)
		.then(function(response){
			return response.json();
		})
		.then(async function(data){
			let pokemones = data.results;
			let numPokes = data.results.length;

			for(let i = 0; i < numPokes; i++){
				await fetch(`${BASE_API}pokemon/${pokemones[i].name}`)
				.then(function(response){
					return response.json();
				})
				.then(function(data){
					pokedex.innerHTML += `
							<div class="pokemon">
								<img src="${data.sprites.front_default}" alt="pokemon">
								<h3>#${data.id} ${data.name}</h3>
							</div>
					`;
				})
			}
			
		})
		.catch(function(e){
			console.log('Hubo un error' + e);
		})
}

getAllPokemons();