/**
 * 
 * Reference physics:
 * Position update
 * Velocity update
 * Acceleration update
 * 
 * Path updates:
 */

 export const UPDATE_POSITION = 'UPDATE_POSITION'
 export const UPDATE_VELOCITY = 'UPDATE_VELOCITY'
 export const UPDATE_ACCELERATION = 'UPDATE_ACCELERATION'

 /**
  * Updates position of reference tracker.
  * @param {int} new_position x-coord of updated position within stage
  */
 export function updatePosition(new_position) {
     return {
         type: UPDATE_POSITION,
         new_position
     }
 }

  /**
  * Updates velocity of reference tracker.
  * @param {int} new_velocity scalar of updated velocity within stage
  */
 export function updateVelocity(new_velocity) {
     return {
         type: UPDATE_VELOCITY,
         new_velocity
     }
 }

   /**
  * Updates acceleration of reference tracker.
  * @param {int} new_acceleration scalar of updated acceleration within stage
  */
 export function updateAcceleration(new_acceleration) {
    return {
        type: UPDATE_ACCELERATION,
        new_acceleration
    }
}