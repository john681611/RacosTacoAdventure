class Keyboard {

    constructor() {

        this.KeymapOpposite = {
            39: 37,
            40: 38,
            37: 39,
            38: 40
        };
        let self  = this;
        document.onkeydown = function (event) {
            if(self.KeymapOpposite[event.which]) {
                self.pressKey = event.which;
            }
        };
        return this;
    }

    // Get Key
    getKey()
    {
        return this.pressKey
    }


    // Get Opposite
    isOpposite(current, nw)
    {
        return nw !== this.KeymapOpposite[current];
    }
}