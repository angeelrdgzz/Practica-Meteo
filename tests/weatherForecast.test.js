const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

const { obtenInformacionMeteo, procesaDireccionViento } = require("../src/tiempo");

const mockDatosAPI = {
  current_weather: {
    temperature: 20,
    windspeed: 15,
    winddirection: 45,
    weathercode: 1,
  },
};

const mockRespuestaAPI = {
  ok: true,
  json: jest.fn().mockResolvedValue(mockDatosAPI),
};

describe("obtenInformacionMeteo", () => {
  it("debería procesar los datos del clima correctamente", async () => {
    fetch.mockResolvedValue(mockRespuestaAPI);
    console.log = jest.fn();

    await obtenInformacionMeteo(42.2576, -8.683);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.open-meteo.com/v1/forecast?latitude=42.2576&longitude=-8.683&current_weather=true"
      )
    );
  });

  it("debería manejar errores de la API", async () => {
    fetch.mockRejectedValue(new Error("Fallo en la red"));
    console.error = jest.fn();

    await obtenInformacionMeteo(42.2576, -8.683);

    expect(console.error).toHaveBeenCalledWith(
      "Error al obtener datos meteorológicos: Fallo en la red"
    );
  });

  it("debería manejar respuestas de la API sin datos actuales", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    console.error = jest.fn();

    await obtenInformacionMeteo(42.2576, -8.683);

    expect(console.error).toHaveBeenCalledWith("Datos meteorológicos no encontrados.");
  });
});

describe("procesaDireccionViento", () => {
  it("debería devolver la dirección correcta para grados dados", () => {
    expect(procesaDireccionViento(0)).toBe("Norte");
    expect(procesaDireccionViento(45)).toBe("Noreste");
    expect(procesaDireccionViento(90)).toBe("Este");
    expect(procesaDireccionViento(135)).toBe("Sureste");
    expect(procesaDireccionViento(180)).toBe("Sur");
    expect(procesaDireccionViento(225)).toBe("Suroeste");
    expect(procesaDireccionViento(270)).toBe("Oeste");
    expect(procesaDireccionViento(315)).toBe("Noroeste");
  });

  it("debería devolver 'Desconocido' para grados inválidos", () => {
    expect(procesaDireccionViento(-10)).toBe("Desconocido");
    expect(procesaDireccionViento(400)).toBe("Desconocido");
  });

  it("debería lanzar un error si los parámetros no son válidos", async () => {
    await expect(obtenInformacionMeteo("string", {})).rejects.toThrow(
      "Latitud y longitud deben ser números válidos"
    );
  });

  it("no debería devolver valores incorrectos", () => {
    expect(procesaDireccionViento(0)).not.toBe("Este");
    expect(procesaDireccionViento(90)).not.toBe("Norte");
  });
});
