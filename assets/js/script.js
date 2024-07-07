let currentChart = null

const validateInput = (event) => {
    const input = event.target
    const value = input.value
    input.value = value.replace(/[^0-9]/g, '')
}

const handleClick = async () => {
    const select = document.querySelector("#selectCurrency")
    const dinero = document.querySelector("#dinero")
    const errorMessage = document.querySelector("#error-message")

       if (!select.value || dinero.value === "" || dinero.value < 0) {
        errorMessage.innerText = "Complete los campos para iniciar, solo valores numericos para precios CLP!!!"
        errorMessage.classList.add("shake")
        setTimeout(() => errorMessage.classList.remove("shake"), 500)
        return
    } else {
    errorMessage.innerText = ""
    }

    const endpoint = "https://mindicador.cl/api/" + select.value
    
    try {
        const res = await fetch(endpoint)

        if (!res.ok) {
            throw new Error(`Error de http status: ${res.status}`)
        }
        const data = await res.json()
        if (!data.serie) {
            throw new Error("Error de data")
        }

        const diezdias = data.serie.slice(0, 10).reverse()
        const etiquetas = diezdias.map(day => {
            return day.fecha.split('T')[0]
        })
        const valores = diezdias.map(day => day.valor)
        const conversion = dinero.value / valores[valores.length - 1]

    document.querySelector("h2").innerText = "Resultado: " + "$" + conversion.toFixed(2)

        const ctx = document.querySelector("#myChart").getContext("2d")

        if (currentChart) {
            currentChart.destroy();
        }

        const dataChart = {
            labels: etiquetas,
            datasets: [
                {
                    data: valores,
                },
            ],
        }

        currentChart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha',
                            color: 'white' 
                        },
                        ticks: {
                            color: 'white' 
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white' 
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    }
                }
            }
        })

    } catch(error) {
        errorMessage.innerText = "Ha ocurrido un error."
    }
}
const dineroInput = document.querySelector("#dinero")
dineroInput.addEventListener('input', validateInput)

dineroInput.addEventListener('keydown', (event) => {
    if (["e", "E", ".", "-", "+"].includes(event.key)) {
        event.preventDefault()
    }
})
const btnBuscar = document.querySelector("#btn-buscar")
btnBuscar.addEventListener('click', handleClick)
