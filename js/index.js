
class Raco {
    constructor(canvas) {
        this.canvas = canvas;
        this.length = [{x: 0, y: 0}];
        this.direction = 39;
        return this;
    }
}

/**
 * Window Load
 */
window.onload = function() {
        racoGame = new Game("stage").Run({});

        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:8080/getBoard', true);
        
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            console.log(data);
          } else {
            // We reached our target server, but it returned an error
        
          }
        };
        
        request.onerror = function() {
          // There was a connection error of some sort
        };
        
        request.send();
};