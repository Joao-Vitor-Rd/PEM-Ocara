import { IGraficos } from "../interfaces/IGraficos";

export class GraficoLinha implements IGraficos {

    public gerarGrafico(data: number[], labels: string[], divName: string): void {
        const containerElement = document.getElementById(divName) as HTMLElement | null;
    
        if (!containerElement) {
        console.error(`Div com id '${divName}' não encontrado`);
        return;
        }

        const Chart = (window as any).Chart;
        
        if (!Chart) {
        console.error("Chart.js não foi carregado");
        return;
        }

        const canvas = document.createElement('canvas');
        containerElement.innerHTML = '';
        containerElement.appendChild(canvas);

        new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
            label: 'Casos Registrados no mês',
            data: data,
            borderWidth: 3,
            borderColor: 'rgba(255, 149, 0, 1)',
            backgroundColor: 'rgba(255, 149, 0, 0.9)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
            y: {
                beginAtZero: true
            }
            },
            plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
            }
            }
        }
        });

    }
}