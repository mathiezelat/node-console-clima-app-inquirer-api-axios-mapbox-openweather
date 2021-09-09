require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        // console.log({ opt });

        switch( opt ) {

            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad:');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad( termino );
                
                // Seleccionar el lugar
                const id = await listarLugares( lugares );

                if ( id === '0' ) continue;

                const lugarSel = lugares.find( lugar => lugar.id === id); 
                const { nombre, lat, lng } = lugarSel;

                // Gurdar en DB

                busquedas.agregarHistorial( nombre );

                // Clima
                const clima = await busquedas.climaLugar( lat, lng );

                const { desc, min, max, temp } = clima;

                // Mostrar resultados
                console.clear();
                console.log('\nInformación del lugar\n'.green); 
                console.log('Ciudad:', nombre.green );
                console.log('Lat:', lat );
                console.log('Lng:', lng );
                console.log('Temperatura:', temp);
                console.log('Mínima:', min);
                console.log('Máxima:', max);
                console.log('Como está el clima:', desc.green );
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( ( lugar, index )=> {
                    const idx = `${ index + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                } )
            break;

        }

        if ( opt !== 0 ) await pausa();

    } while( opt !== 0 );

}

main();