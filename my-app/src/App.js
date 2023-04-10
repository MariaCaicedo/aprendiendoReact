
import { useState } from 'react'

function Cuadrado({ valor, unCuadruadoClick, ganador }) {
  return <button className={ganador ? "cuadrado-ganador" : "cuadrado"} onClick={unCuadruadoClick}>{valor}</button>
}

function Cuadricula({ xEsElSiguiente, cuadrados, enJuego }) {
  //const [xEsElSiguiente, setXEsElSiguiente] = useState(true);
  //const [cuadrados, setCuadrados] = useState(Array(9).fill(null));

  const ganador = calcularGanador(cuadrados) ? calcularGanador(cuadrados).ganador : '';
  let estado = "Es el turno del Jugador:" + (xEsElSiguiente ? "X" : "O");
  if (ganador) {
    estado = "El GANADOR de la partida Es:" + ganador;
  } else if (cuadrados.every((valor) => {
    return valor
  })) {
    estado = 'Empate'
  }


  function handleClicck(posicion) {
    if (cuadrados[posicion] || calcularGanador(cuadrados)) {
      return;
    }
    const siguienteCuadrado = cuadrados.slice();
    if (xEsElSiguiente) {
      siguienteCuadrado[posicion] = "X";
    } else {
      siguienteCuadrado[posicion] = "O";
    }
    //setCuadrados(siguienteCuadrado);
    //setXEsElSiguiente(!xEsElSiguiente);
    enJuego(siguienteCuadrado);
  }

  const cuadricula = [];
  for (let fila = 0; fila < 3; fila++) {
    const cajones = [];
    for (let columna = 0; columna < 3; columna++) {
      const posicion = fila * 3 + columna;
      cajones.push(
        <Cuadrado ganador={calcularGanador(cuadrados) && calcularGanador(cuadrados).combinacion.includes(posicion)} valor={cuadrados[posicion]} unCuadruadoClick={() => handleClicck(posicion)
        } />
      );
    }
    cuadricula.push(<div className='board-row'>
      {cajones}
    </div>)
  }
  return <>
    <div className='status'>
      {estado}

    </div>
    {cuadricula}
  </>
}

export default function Juego() {
  const [historial, setHistorial] = useState([Array(9).fill(null)]);
  const [movimientoActual, setMovimientoActual] = useState(0);
  const [ascendente, setAscendente] = useState(true);
  const xEsElSiguiente = movimientoActual % 2 === 0;
  const cuadradoActual = historial[movimientoActual];

  function iniciarJuego(siguienteCuadrado) {
    const siguienteHistorial = [...historial.slice(0, movimientoActual + 1), siguienteCuadrado];
    setHistorial(siguienteHistorial);
    setMovimientoActual(siguienteHistorial.length - 1);
  }

  function irA(siguienteMovimiento) {
    setMovimientoActual(siguienteMovimiento);
  }

  const movimientos = historial.map((jugadaActual, idJugada) => {
    let descripcion;
    if (idJugada > 0) {
      descripcion = 'Ir al movimiento #' + idJugada + calcularMovimiento(historial, jugadaActual, idJugada);

    } else {
      descripcion = 'Ir al inicio del juego';
    }
    return (
      <li key={idJugada}>
        <button onClick={() => irA(idJugada)}>
          {descripcion}
        </button>
      </li>
    )
  })

  movimientos.push(
    "Estas en el movimiento #" + historial.length
  );
  return (
    <div className='game'>
      <div className='game-board'>
        <Cuadricula xEsElSiguiente={xEsElSiguiente} cuadrados={cuadradoActual} enJuego={iniciarJuego} />
      </div>
      <div className='game-info'>
        <button onClick={() => setAscendente(!ascendente)}>Ordenar {ascendente ? 'Ascendente' : 'Desendente'}</button>
        <ol>
          {ascendente ? movimientos : movimientos.reverse()}
        </ol>
      </div>
    </div>
  );
}

function calcularGanador(cuadrados) {
  const lineas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let posicion = 0; posicion < lineas.length; posicion++) {
    const [a, b, c] = lineas[posicion];
    if (cuadrados[a] && cuadrados[a] === cuadrados[b] && cuadrados[a] === cuadrados[c]) {
      console.log('ganador')
      return { ganador: cuadrados[a], combinacion: lineas[posicion] };
    }
  }
  return null;
}

function calcularMovimiento(historial, jugadaActual, idJugada) {
  let jugadaAnterior = historial[idJugada - 1];
  for (let posicion = 0; posicion < jugadaActual.length; posicion++) {
    if (jugadaActual[posicion] !== jugadaAnterior[posicion]) {
      return ` [${Math.floor(posicion / 3)},${posicion % 3}]=${jugadaActual[posicion]}`;
    }
  }
}