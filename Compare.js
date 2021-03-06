/**
Compares the 2 pokemon and returns the winner based on types if there is one,
otherwise it compares the base stats of each pokemon, and returns the pokemon
with higher overall stats.

pokemon1 : pokemon acquired from the api based on the first text box
pokemon2 : pokemon acquired from the api based on the second text box
**/
async function compare(pokemon1, pokemon2) {
  let temp = await compareTypes(pokemon1, pokemon2);
  if (null == temp)
    return compareStats(pokemon1, pokemon2);
  return temp;
}


/**
Compares the types of each pokemon to determine the damage multiplier. The
pokemon that will recieve more damage is the winner.

pokemon1 : pokemon acquired from the api based on the first text box
pokemon2 : pokemon acquired from the api based on the second text box
**/
async function compareTypes(pokemon1, pokemon2) {
  //the array of all type interactions (ex: if grass takes more damage from fire)
  var damageRelations;

  //for readability, an array of each pokemon's types is created
  let pokemon1Types = new Array();
  let pokemon2Types = new Array();
  for (var key in pokemon1.types)
    pokemon1Types.push(pokemon1.types[key].type.name);
  for (var key in pokemon2.types)
    pokemon2Types.push(pokemon2.types[key].type.name);

  let i = pokemon1Types.length;
  while (i--) {
    let j = pokemon2Types.length;
    //for every type that pokemon1 has, get the damage relations
    await P.getTypeByName(pokemon1Types[i])
      .then(function(response) {
          damageRelations = response.damage_relations;
    });

    //for every type that pokemon2 has, check if pokemon1 has any weaknesses
    //or strengths against pokemon 2, and adjust damage multipliers
    while (j--) {
      for (var key in damageRelations) {
        multiplier.adjustMulitplier(damageRelations[key], key, pokemon2Types[j]);
      }
    }
  }
  console.log(multiplier.getAttackMultiplier());
  //return the pokemon which will take more damage, if they are tied, return null
  if (multiplier.getAttackMultiplier() > multiplier.getDefenseMultiplier())
    return pokemon1;
  else if (multiplier.getAttackMultiplier()  < multiplier.getDefenseMultiplier())
    return pokemon2;
  return null;
}

/**
Compare the base stats of each pokemon and return the pokemon with higher stats.
if they are tied, the first pokemon passed in is returned.

pokemon1 : pokemon acquired from the api based on the first text box
pokemon2 : pokemon acquired from the api based on the second text box
**/
function compareStats(pokemon1, pokemon2) {
  let totalStatValuePokemon1 = 0;
  let totalStatValuePokemon2 = 0;
  let i = pokemon1.stats.length;
  let j = pokemon2.stats.length;
  while (i--) {
      totalStatValuePokemon1 += pokemon1.stats[i].base_stat;
  }
  while (j--) {
      totalStatValuePokemon2 += pokemon2.stats[j].base_stat;
  }
  return totalStatValuePokemon2 > totalStatValuePokemon1 ? pokemon2 : pokemon1;
}
