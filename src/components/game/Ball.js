import { Graphics } from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

const Ball = PixiComponent('Ball', {
    create: props => {
        return new Graphics()
    },

    didMount: (instance, parent) => {
        
    },

    willUnmount: (instance, parent) => {
        // clean up before removal
    },

    applyProps: (instance, oldProps, newProps) => {
        const { fill, x, y, radius } = newProps;
        instance.clear();
        instance.beginFill(fill);
        instance.drawCircle(x, y, radius);
        instance.endFill();
    }
})

export {Ball}