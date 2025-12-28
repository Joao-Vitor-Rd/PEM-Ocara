import { IGraficos } from "../interfaces/IGraficos";

export class GraficoPizza implements IGraficos {
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
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                label: 'Casos Registrados na região',
                data: data,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            },
                        }
                    },
                    title: {
                        display: true,
                        text: 'Casos Registrados por Região'
                    },
                    tooltip: {
                        callbacks: {
                            label(context: any) {
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }                        
                        }
                    }
                }
            }
        });
    }
}