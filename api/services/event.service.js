import emitter from "../../events/emitter.js";

export const handleEvent = (eventData) =>{
    console.log('Event received', eventData);

    // emit internal event
    emitter.emit("event.received", eventData);
};