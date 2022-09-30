import React, {useState , useEffect} from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { colourOptions } from './data.ts';
import data from './MyData.json'

const animatedComponents = makeAnimated();

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9'},
    { value: 'blue', label: 'Blue', color: '#0052CC'},
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630'},
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
  ];

let locationOptions = []

const myArrLocations =  [
    {
      LocationHeardKey: 'Carretera a Man��--Paso Acjanaco a Wayquecha',
      ScientificNameKey: {
        'Nothocercus nigrocapillus': 14.285714285714285,
        'Colaptes rupicola': 14.285714285714285,
        'Bolborhynchus orbygnesius': 14.285714285714285,
        'Scytalopus schulenbergi': 14.285714285714285,
        'Scytalopus parvirostris': 14.285714285714285,
        'Asthenes helleri': 14.285714285714285,
        'Synallaxis azarae': 14.285714285714285,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--T��neles Pillahuata (2600-2800m)',
      ScientificNameKey: {
        'Nothocercus nigrocapillus': 10,
        'Bolborhynchus lineola': 10,
        'Grallaria erythroleuca': 10,
        'Chamaeza mollissima': 10,
        'Cranioleuca marcapatae': 10,
        'Synallaxis azarae': 10,
        'Pipreola arcuata': 10,
        'Myadestes ralloides': 10,
        'Turdus serranus': 10,
        'Psarocolius atrovirens': 10,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Wayqecha Cloud Forest Birding Lodge',
      ScientificNameKey: {
        'Nothocercus nigrocapillus': 11.11111111111111,
        'Amazona mercenarius': 11.11111111111111,
        'Synallaxis azarae': 11.11111111111111,
        'Ampelion rubrocristatus': 11.11111111111111,
        'Troglodytes aedon': 22.22222222222222,
        'Zonotrichia capensis': 11.11111111111111,
        'Myiothlypis signata': 11.11111111111111,
        'Diglossa cyanea': 11.11111111111111,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Man�� Wildlife Center (Valqui A5.1)',
      ScientificNameKey: {
        'Tinamus major': 1.1627906976744187,
        'Crypturellus cinereus': 2.3255813953488373,
        'Crypturellus undulatus': 1.1627906976744187,
        'Crypturellus strigulosus': 1.1627906976744187,
        'Crypturellus bartletti': 3.488372093023256,
        'Ortalis guttata': 1.1627906976744187,
        'Penelope jacquacu': 1.1627906976744187,
        'Pipile cumanensis': 1.1627906976744187,
        'Odontophorus stellatus': 1.1627906976744187,
        'Patagioenas plumbea': 1.1627906976744187,
        'Nyctidromus albicollis': 3.488372093023256,
        'Nyctibius grandis': 1.1627906976744187,
        'Heliornis fulica': 1.1627906976744187,
        'Megascops watsonii': 2.3255813953488373,
        'Lophostrix cristata': 3.488372093023256,
        'Pulsatrix perspicillata': 1.1627906976744187,
        'Glaucidium hardyi': 2.3255813953488373,
        'Pharomachrus pavoninus': 1.1627906976744187,
        'Trogon melanurus': 1.1627906976744187,
        'Momotus momota': 2.3255813953488373,
        'Electron platyrhynchum': 4.651162790697675,
        'Nystalus obamai': 1.1627906976744187,
        'Monasa nigrifrons': 2.3255813953488373,
        'Capito auratus': 2.3255813953488373,
        'Eubucco richardsoni': 2.3255813953488373,
        'Selenidera reinwardtii': 1.1627906976744187,
        'Ramphastos tucanus': 2.3255813953488373,
        'Campephilus rubricollis': 1.1627906976744187,
        'Micrastur semitorquatus': 2.3255813953488373,
        'Ibycter americanus': 1.1627906976744187,
        'Euchrepomis humeralis': 1.1627906976744187,
        'Cymbilaimus lineatus': 1.1627906976744187,
        'Myrmoborus leucophrys': 1.1627906976744187,
        'Myrmelastes hyperythrus': 1.1627906976744187,
        'Formicarius colma': 1.1627906976744187,
        'Chamaeza nobilis': 1.1627906976744187,
        'Sittasomus griseicapillus': 1.1627906976744187,
        'Dendrexetastes rufigula': 1.1627906976744187,
        'Nasica longirostris': 2.3255813953488373,
        'Xiphorhynchus guttatus': 2.3255813953488373,
        'Furnarius leucopus': 1.1627906976744187,
        'Automolus rufipileatus': 2.3255813953488373,
        'Thripophaga fusciceps': 1.1627906976744187,
        'Synallaxis gujanensis': 2.3255813953488373,
        'Tyranneutes stolzmanni': 1.1627906976744187,
        'Chiroxiphia pareola': 2.3255813953488373,
        'Lipaugus vociferans': 1.1627906976744187,
        'Schiffornis turdina': 1.1627906976744187,
        'Platyrinchus platyrhynchos': 1.1627906976744187,
        'Mionectes oleagineus': 1.1627906976744187,
        'Todirostrum maculatum': 1.1627906976744187,
        'Tolmomyias assimilis': 1.1627906976744187,
        'Myiarchus ferox': 1.1627906976744187,
        'Pitangus sulphuratus': 1.1627906976744187,
        'Pachysylvia hypoxantha': 1.1627906976744187,
        'Cyanocorax cyanomelas': 1.1627906976744187,
        'Microcerculus marginatus': 1.1627906976744187,
        'Turdus hauxwelli': 1.1627906976744187,
        'Turdus albicollis': 1.1627906976744187,
        'Turdus lawrencii': 1.1627906976744187,
        'Icterus croconotus': 2.3255813953488373,
        'Habia rubica': 1.1627906976744187,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Estaci��n Biol��gica Villa Carmen',
      ScientificNameKey: {
        'Tinamus guttatus': 2,
        'Crypturellus cinereus': 2,
        'Crypturellus soui': 4,
        'Crypturellus undulatus': 6,
        'Crypturellus atrocapillus': 4,
        'Nyctibius griseus': 4,
        'Amaurolimnas concolor': 2,
        'Rupornis magnirostris': 2,
        'Megascops choliba': 4,
        'Megascops watsonii': 4,
        'Monasa nigrifrons': 2,
        'Ramphastos tucanus': 2,
        'Colaptes punctigula': 2,
        'Aratinga weddellii': 2,
        'Psittacara leucophthalmus': 2,
        'Thamnophilus palliatus': 2,
        'Myrmotherula longicauda': 2,
        'Drymophila devillei': 2,
        'Cercomacroides fuscicauda': 2,
        'Myrmoborus lophotes': 4,
        'Sciaphylax hemimelaena': 2,
        'Akletos goeldii': 2,
        'Myrmothera berlepschi': 2,
        'Formicarius analis': 2,
        'Campylorhamphus trochilirostris': 2,
        'Thripophaga fusciceps': 2,
        'Synallaxis gujanensis': 2,
        'Pipra fasciicauda': 2,
        'Hemitriccus flammulatus': 2,
        'Hemitriccus iohannis': 2,
        'Poecilotriccus albifacies': 2,
        'Todirostrum chrysocrotaphum': 2,
        'Cyanocorax violaceus': 2,
        'Microcerculus marginatus': 2,
        'Troglodytes aedon': 2,
        'Pheugopedius genibarbis': 2,
        'Arremon taciturnus': 4,
        'Myiothlypis bivittata': 2,
        'Cyanoloxia rothschildii': 2,
        'Coereba flaveola': 2,
        'Saltator coerulescens': 2,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Cock-of-the-Rock Lodge & Manu Paradise Lodge',
      ScientificNameKey: {
        'Crypturellus obsoletus': 16,
        'Odontophorus speciosus': 4,
        'Megascops ingens': 4,
        'Colaptes rubiginosus': 4,
        'Myrmotherula longicauda': 4,
        'Pyriglena maura': 12,
        'Formicarius rufipectus': 4,
        'Lepidothrix coeruleocapilla': 4,
        'Lophotriccus pileatus': 12,
        'Tolmomyias flaviventris': 4,
        'Tyrannus melancholicus': 4,
        'Cyphorhinus thoracicus': 8,
        'Turdus hauxwelli': 8,
        'Myiothlypis bivittata': 12,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Amazon��a Lodge',
      ScientificNameKey: {
        'Crypturellus undulatus': 5.555555555555555,
        'Crypturellus atrocapillus': 5.555555555555555,
        'Penelope jacquacu': 5.555555555555555,
        'Patagioenas plumbea': 5.555555555555555,
        'Patagioenas subvinacea': 5.555555555555555,
        'Nyctibius grandis': 5.555555555555555,
        'Amaurolimnas concolor': 5.555555555555555,
        'Aramides cajaneus': 5.555555555555555,
        'Megascops watsonii': 5.555555555555555,
        'Galbula cyanescens': 5.555555555555555,
        'Thamnomanes schistogynus': 5.555555555555555,
        'Akletos goeldii': 5.555555555555555,
        'Phlegopsis nigromaculata': 5.555555555555555,
        'Myrmothera berlepschi': 5.555555555555555,
        'Dendrocolaptes picumnus': 5.555555555555555,
        'Xiphorhynchus guttatus': 5.555555555555555,
        'Furnarius leucopus': 5.555555555555555,
        'Cyanoloxia rothschildii': 5.555555555555555,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Blanquillo Macaw Clay Lick',
      ScientificNameKey: {
        'Crypturellus undulatus': 20,
        'Nannopsittaca dachilleae': 20,
        'Akletos goeldii': 20,
        'Synallaxis albigularis': 20,
        'Todirostrum maculatum': 20,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Man�� Wildlife Center--Antthrush Trail',
      ScientificNameKey: {
        'Crypturellus undulatus': 33.33333333333333,
        'Cercomacra manu': 33.33333333333333,
        'Myrmoborus lophotes': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Rio Madre de Dios--Man�� Wildlife Center a Laberinto',
      ScientificNameKey: { 'Crypturellus undulatus': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Paucartambo--Huancarani--Huayllatambo--La Casa del Abuelo (reference)',
      ScientificNameKey: {
        'Nothoprocta pentlandii': 14.285714285714285,
        'Patagioenas maculosa': 14.285714285714285,
        'Patagona gigas': 14.285714285714285,
        'Colaptes rupicola': 14.285714285714285,
        'Asthenes ottonis': 14.285714285714285,
        'Cranioleuca albicapilla': 14.285714285714285,
        'Troglodytes aedon': 14.285714285714285,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Cocha Camungo',
      ScientificNameKey: {
        'Mitu tuberosum': 20,
        'Laterallus melanophaius': 20,
        'Laterallus exilis': 20,
        'Ramphastos tucanus': 20,
        'Schiffornis major': 20,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Abra M��laga--Upper Temperate Forest (3400-3200m)',
      ScientificNameKey: {
        'Odontophorus balliviani': 25,
        'Scytalopus schulenbergi': 25,
        'Scytalopus parvirostris': 25,
        'Uromyias agraphia': 25,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Esperanza',
      ScientificNameKey: {
        'Odontophorus balliviani': 25,
        'Ciccaba albitarsis': 25,
        'Ochthoeca cinnamomeiventris': 25,
        'Myadestes ralloides': 25,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Rio Alto Madre de Dios--Amazonia Lodge a Boca Man��',
      ScientificNameKey: { 'Patagioenas subvinacea': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Edificio Mirador Parque M��gico (apartment building) [urban area]--Lima--Lima',
      ScientificNameKey: {
        'Zenaida meloda': 6.329113924050633,
        'Systellura decussata': 6.329113924050633,
        'Amazilis amazilia': 1.2658227848101267,
        'Larus dominicanus': 1.2658227848101267,
        'Camptostoma obsoletum': 18.9873417721519,
        'Troglodytes aedon': 26.582278481012654,
        'Zonotrichia capensis': 13.924050632911392,
        'Dives warczewiczi': 22.78481012658228,
        'Thraupis episcopus': 1.2658227848101267,
        'Coereba flaveola': 1.2658227848101267,
        Sum: 100
      }
    },
    {
      LocationHeardKey: "Puerto Maldonado--Juan Mayta's Farm",
      ScientificNameKey: { 'Dromococcyx phasianellus': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'ACP Pillco Grande--Carretera a Tres Cruces',
      ScientificNameKey: {
        'Tringa melanoleuca': 33.33333333333333,
        'Scytalopus schulenbergi': 33.33333333333333,
        'Cistothorus platensis': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Santuario Historico Machu Picchu--Avenida Hermanos Ayar',
      ScientificNameKey: {
        'Rupornis magnirostris': 33.33333333333333,
        'Pachyramphus versicolor': 33.33333333333333,
        'Henicorhina leucophrys': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Abra M��laga--Cloud Forest (2700-3000m)',
      ScientificNameKey: { 'Glaucidium bolivianum': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Rocotal',
      ScientificNameKey: {
        'Pharomachrus antisianus': 20,
        'Synallaxis azarae': 40,
        'Myadestes ralloides': 20,
        'Entomodestes leucotis': 20,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Puente Quita Calzones',
      ScientificNameKey: {
        'Trogon personatus': 25,
        'Malacoptila fulvogularis': 25,
        'Lophotriccus pileatus': 25,
        'Tangara chilensis': 25,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Limatambo to Mollepata--Anta',
      ScientificNameKey: { 'Nystalus chacuru': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Paucartambo, Before Pillcopata',
      ScientificNameKey: { 'Pteroglossus castanotis': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Rio Madre de Dios--Man�� Wildlife Center a Tambo Blanquillo Lodge',
      ScientificNameKey: {
        'Ramphastos tucanus': 33.33333333333333,
        'Furnarius leucopus': 33.33333333333333,
        'Ammodramus aurifrons': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Cock-of-the-Rock Lek',
      ScientificNameKey: {
        'Colaptes rubiginosus': 20,
        'Scytalopus atratus': 20,
        'Conopias cinchoneti': 20,
        'Henicorhina leucophrys': 20,
        'Myadestes ralloides': 20,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Yoga Limatambo Hotel',
      ScientificNameKey: { 'Colaptes rivolii': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera 28B--Pe��as',
      ScientificNameKey: {
        'Colaptes rupicola': 33.33333333333333,
        'Grallaria andicolus': 33.33333333333333,
        'Asthenes ottonis': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Tanager Corner a Thousand-meter Bridge (1100-1300m)',
      ScientificNameKey: {
        'Thamnophilus palliatus': 7.6923076923076925,
        'Hypocnemis subflava': 15.384615384615385,
        'Cercomacroides serva': 15.384615384615385,
        'Pyriglena maura': 7.6923076923076925,
        'Myrmoborus leucophrys': 7.6923076923076925,
        'Campylorhamphus trochilirostris': 23.076923076923077,
        'Conopias cinchoneti': 7.6923076923076925,
        'Myiodynastes chrysocephalus': 7.6923076923076925,
        'Pheugopedius genibarbis': 7.6923076923076925,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Chonta Chaca',
      ScientificNameKey: { 'Thamnomanes schistogynus': 50, 'Akletos goeldii': 50, Sum: 100 }
    },
    {
      LocationHeardKey: 'Bambu Lodge',
      ScientificNameKey: { 'Akletos goeldii': 50, 'Tyrannulus elatus': 50, Sum: 100 }
    },
    {
      LocationHeardKey: 'Rio Madre de Dios--Boca Man�� a Man�� Wildlife Center',
      ScientificNameKey: { 'Myrmophylax atrothorax': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Thousand-meter Bridge a Chontachacra (900-1100m)',
      ScientificNameKey: {
        'Grallaria guatimalensis': 33.33333333333333,
        'Machaeropterus pyrocephalus': 33.33333333333333,
        'Lophotriccus pileatus': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--T��neles Pillahuata (2200-2500m)',
      ScientificNameKey: {
        'Grallaria erythroleuca': 50,
        'Henicorhina leucophrys': 50,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Soraypampa',
      ScientificNameKey: { 'Scytalopus urubambae': 50, 'Asthenes ottonis': 50, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Mirador (1700-1800m)',
      ScientificNameKey: {
        'Scytalopus atratus': 33.33333333333333,
        'Chiroxiphia boliviana': 33.33333333333333,
        'Contopus fumigatus': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Rocotal Medio (2000-2200m)',
      ScientificNameKey: {
        'Scytalopus atratus': 50,
        'Henicorhina leucophrys': 50,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Man�� Cloud Forest Lodge (1500-1700m)',
      ScientificNameKey: {
        'Scytalopus atratus': 25,
        'Poecilotriccus plumbeiceps': 25,
        'Henicorhina leucophrys': 25,
        'Myadestes ralloides': 25,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Laguna de Huacarpay',
      ScientificNameKey: {
        'Phacellodomus striaticeps': 50,
        'Troglodytes aedon': 50,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Rocotal Inferior (1800-2000m)',
      ScientificNameKey: {
        'Chiroxiphia boliviana': 33.33333333333333,
        'Myadestes ralloides': 33.33333333333333,
        'Entomodestes leucotis': 33.33333333333333,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Pillahuata (Valqui A1.2)',
      ScientificNameKey: { 'Pachyramphus versicolor': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'La Convenci��n--Huayopata--San Luis (private concervancy area) [upper montane evergreen forest, chusquea bamboo, second-growth scrub]',
      ScientificNameKey: { 'Hemitriccus granadensis': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Parque Andr��s Avelino C��ceres (park)--Jes��s Mar��a--Lima',
      ScientificNameKey: {
        'Camptostoma obsoletum': 50,
        'Zonotrichia capensis': 50,
        Sum: 100
      }
    },
    {
      LocationHeardKey: 'ACP Abra M��laga (Valqui B2)',
      ScientificNameKey: { 'Troglodytes aedon': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Patria (600-900m)',
      ScientificNameKey: { 'Troglodytes aedon': 50, 'Ammodramus aurifrons': 50, Sum: 100 }
    },
    {
      LocationHeardKey: 'Ollantaytambo (pueblo)',
      ScientificNameKey: { 'Troglodytes aedon': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Parque Municipal de Barranco (park)--Barranco--Lima',
      ScientificNameKey: { 'Troglodytes aedon': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Paucartambo (pueblo)',
      ScientificNameKey: { 'Troglodytes aedon': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Cusco (ciudad)',
      ScientificNameKey: { 'Turdus chiguanco': 100, Sum: 100 }
    },
    {
      LocationHeardKey: 'Carretera a Man��--Pilcopata a Atalaya (500-600m)',
      ScientificNameKey: { 'Saltator grossus': 100, Sum: 100 }
    }
  ];


data.map(elem => {
  locationOptions.push({ value: elem.LocationHeardKey, label: elem.LocationHeardKey} )
})
  
const AnimatedMulti = ({getSpecies}) => {

  const [userChoice, setUserChoice] = useState("");

 
    let arrScientificNames = userChoice.length>0 && userChoice.map( elemChoice => {
      let objLocName = data.find( elem => elem.LocationHeardKey === elemChoice.value)
        if(objLocName) {
          return objLocName
        }

        else {
          console.log('thanks')
        }
    })

    console.log("userchoice: ", userChoice);

    let counts = {}

  
    useEffect(() => {
      // Only call setState within event handlers! 
      // Do not call setState inside the body of your function component

      if(arrScientificNames) {
        let totalArrScientificNames = arrScientificNames.map( elem => Object.keys(elem.ScientificNameKey))
        console.log("total: ", totalArrScientificNames);
        let sumUpArrays = [].concat.apply([], totalArrScientificNames);
        console.log("sum up: ", sumUpArrays)
  
   
  
        for (const scientificName of sumUpArrays) {
          counts[scientificName] = counts[scientificName] ? counts[scientificName] + 1 : 1;
        }
  
        counts['Sum'] = 0;
  
        let sumSpeciesEachLocation  = Object.values(counts).reduce( (acc,curr) => {
              return acc+curr;
        })
  
  
        counts['Sum'] = sumSpeciesEachLocation;
  
       
        let totalSumSpecies = counts.Sum;
  
        Object.keys(counts).map(elem => {
   
          let percentageFrequencySp = ((counts[elem]/totalSumSpecies)*100).toFixed(2);
  
          counts[elem] = percentageFrequencySp;
        })
  
        console.log("final array", counts);
      }


      getSpecies(counts)
    },[userChoice])
  
  
    return (
      <Select
        closeMenuOnSelect={true}
        components={animatedComponents}
      
        isMulti
        options={locationOptions}
        onChange={(choice) => setUserChoice(choice)}
      />
    );
}

export default AnimatedMulti;