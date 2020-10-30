{
    init: function(elevators, floors) {

        elevators.forEach(function (elevator, index) {
            var highestRequestedFloor, lowestRequestedFloor;
            
            elevator.on("passing_floor", function(floorNum, direction) { 
                highestRequestedFloor = Math.max(...elevator.destinationQueue );
                lowestRequestedFloor = Math.min(...elevator.destinationQueue);

            });
                     
            elevator.on("stopped_at_floor", function(floorNum) {
             
                elevator.destinationQueue = elevator.destinationQueue.filter(floor => floor != floorNum)
                
                if (elevator.destinationQueue.length == 0) {                
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(true);
                }
                if (elevator.currentFloor() == highestRequestedFloor || elevator.currentFloor() == floors.length -1) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                }

                if (elevator.currentFloor() == lowestRequestedFloor || elevator.currentFloor() == 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                }
             
            });
            elevator.on("floor_button_pressed", function (floorNum) {
         
                elevator.destinationQueue.push(floorNum);
                               
                if (elevator.destinationQueue.length >= 1 && floorNum <= highestRequestedFloor) {
                    var sortedQueue = elevator.destinationQueue.sort((a, b) => a - b);
                    for ( var i = 0; i < elevator.destinationQueue.length; i++) {
                        if (elevator.destinationQueue[i] > elevator.currentFloor()) {
                            elevator.goToFloor(elevator.destinationQueue[i]);
                            return;
                        }
                    }
                }

                if (elevator.destinationQueue.length >= 1 && floorNum >= lowestRequestedFloor) {
                    var sortedQueue = elevator.destinationQueue.sort((a, b) => b - a);
                    console.log('going down', sortedQueue)
                    for ( var i = 0; i < elevator.destinationQueue.length; i++) {
                        if (elevator.destinationQueue[i] < elevator.currentFloor()) {
                            elevator.goToFloor(elevator.destinationQueue[i]);
                            return;
                        }
                    }              
                }
            });
            
            floors.forEach(function(floor, index) {
                floor.on("up_button_pressed", function() {
                    elevator.destinationQueue.push(floor.floorNum())        
                });
                floor.on("down_button_pressed", function() {
                    elevator.destinationQueue.push(floor.floorNum())
                });
            });
        });

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}