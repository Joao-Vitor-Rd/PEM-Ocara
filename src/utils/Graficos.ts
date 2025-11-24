export class Graficos {
  public static createBarChart(data: number[], labels: string[]): void {
    const containerElement = document.getElementById('grafico-evolucao') as HTMLElement | null;
    
    if (!containerElement) {
      console.error("Div com id 'grafico-evolucao' não encontrado");
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

  public static createPieChart(data: number[], labels: string[]): void {
    const containerElement = document.getElementById('grafico-distribuicao') as HTMLElement | null;

      if (!containerElement) {
        console.error("Div com id 'grafico-distribuicao' não encontrado");
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
