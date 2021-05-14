'use strict'

const Logger = use('Logger');

/**
 * In this tableau we 'll add conneted collectors and when user send request
 * we get the poisition of this collectors
 * We calculate the distance
 * Send to collector we are in X km from the notification to accept/decline
 */
var freeCollectorsObject = [];
var freeCollectorsTable = [];
var bookings = [];
class CollectorController {
    constructor({ socket, request }) {
        this.socket = socket
        this.request = request
        var data = "booking";
        this.socket.broadcastToAll('test', data);
    }


    //Connect agent using socket
    onAuth(data){
      console.log(data);
    }

    onDrivernewposition(driverPositiondata){
      console.log(driverPositiondata)
      this.socket.emit('driverdaraceive');
    }

    /**
     *
     * @param data = {
     *  username : username,
     *  longitude : longitude,
     *  latitude: latitude
     * }
     */
    onSubscribe(data) {
        console.log(data);
        //verifier si le username à dejà un socket id, changer le socket id
        freeCollectors[data.username] = this.socket.id;
        //Notify in database, user connected time info
    }

    onTest(data){
      console.log(data)
      this.socket.broadcastToAll('message', data);
    }

    onMessage(message) {
      console.log(message)
      this.socket.broadcastToAll('message', message);
    };

    onClose(data) {
        // same as: socket.on('close')
        console.log("CLOSE --------- CLOSE");
        //enlever son  ID du table
        freeCollectorsObject[data.username] = this.socket.id;
        let collectorsockid = freeCollectorsTable[data.username];
        freeCollectorsTable.map((value, index) => {
            if (value == collectorsockid) {
                freeCollectorsTable[index] = null //search method to delete data from table
            }
        });
        this.socket.broadcastToAll('close', message)
    }

    onError(error) {
        // same as: socket.on('error')
        Logger.error(error)
    }




    /*onMessage () {// same as: socket.on('message')*/
}

module.exports = CollectorController
