export class SobreAgressor {
    constructor(usoDrogasAlcool, doencaMental, agressorCumpriuMedidaProtetiva, agressorTentativaSuicidio, agressorDesempregado, agressorPossuiArmaFogo, agressorAmeacouAlguem) {
        this.usoDrogasAlcool = usoDrogasAlcool;
        this.doencaMental = doencaMental;
        this.agressorCumpriuMedidaProtetiva = agressorCumpriuMedidaProtetiva;
        this.agressorTentativaSuicidio = agressorTentativaSuicidio;
        this.agressorDesempregado = agressorDesempregado;
        this.agressorPossuiArmaFogo = agressorPossuiArmaFogo;
        this.agressorAmeacouAlguem = agressorAmeacouAlguem;
    }
    //Getters
    getUsoDrogasAlcool() {
        return this.usoDrogasAlcool;
    }
    getDoencaMental() {
        return this.doencaMental;
    }
    getAgressorCumpriuMedidaProtetiva() {
        return this.agressorCumpriuMedidaProtetiva;
    }
    getAgressorTentativaSuicidio() {
        return this.agressorTentativaSuicidio;
    }
    getAgressorDesempregado() {
        return this.agressorDesempregado;
    }
    getAgressorPossuiArmaFogo() {
        return this.agressorPossuiArmaFogo;
    }
    getAgressorAmeacouAlguem() {
        return this.agressorAmeacouAlguem;
    }
    //Setters
    setUsoDrogasAlcool(value) {
        this.usoDrogasAlcool = value;
    }
    setDoencaMental(value) {
        this.doencaMental = value;
    }
    setAgressorCumpriuMedidaProtetiva(value) {
        this.agressorCumpriuMedidaProtetiva = value;
    }
    setAgressorTentativaSuicidio(value) {
        this.agressorTentativaSuicidio = value;
    }
    setAgressorDesempregado(value) {
        this.agressorDesempregado = value;
    }
    setAgressorPossuiArmaFogo(value) {
        this.agressorPossuiArmaFogo = value;
    }
    setAgressorAmeacouAlguem(value) {
        this.agressorAmeacouAlguem = value;
    }
}
