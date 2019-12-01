var ft = require("fourier-transform");

const FREQUENCIES = [
  0.1,
  0.2,
  0.3,
  0.4,
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1.0,
  1.1,
  1.2,
  1.3,
  1.4,
  1.5
];

//generate random signal functions

generate_random_signal = () => {
  var amplitudes = [...Array(5).keys()].map(frequency => {
    return Math.random();
  });

  var phases = [...Array(5).keys()].map(frequency => {
    var max = Math.PI;
    var min = -1 * Math.PI;
    return Math.random() * (max - min) + min;
  });

  return [amplitudes, phases];
};

const [
  disturbance_amplitudes,
  disturbance_phases
] = this.generate_random_signal();
var disturbance_frequencies = getRandom(FREQUENCIES, 5);

const [reference_amplitudes, reference_phases] = this.generate_random_signal();
var reference_frequencies = getRandom(FREQUENCIES, 5);

disturbance_function = time => {
  let disturbance = 0;
  for (let i = 0; i < 5; i++) {
    disturbance +=
      disturbance_amplitudes[i] *
      Math.sin(
        disturbance_phases[i] + 2 * Math.PI * time * disturbance_frequencies[i]
      );
  }
  return disturbance;
};

reference_function = time => {
  let reference = 0;
  for (let i = 0; i < 5; i++) {
    reference +=
      reference_amplitudes[i] *
      Math.sin(
        reference_phases[i] + 2 * Math.PI * time * reference_frequencies[i]
      );
  }
  return reference;
};

//create sufficient number of data points

//map index to data point in map

//save map as json file
