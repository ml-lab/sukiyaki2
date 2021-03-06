// (c) 2016 Machine Intelligence Laboratory (The University of Tokyo), MIT License.
import $M = require('milsushi2');
import Layer = require('./layer');
import ForwardConfiguration = require('../forward_configuration');

class LossLayer extends Layer {

  constructor(params: any) {
    super();
  }

  init(callback: () => void): void {
    setImmediate(callback);
  }

  forward(bottoms: $M.Matrix[], config: ForwardConfiguration, callback: (tops: $M.Matrix[]) => void): void {
    //square loss
    var data: $M.Matrix = bottoms[0];
    var gt: $M.Matrix = bottoms[1];
    var loss = $M.autodestruct(() => $M.times($M.sum($M.sum($M.power($M.minus(data, gt), 2.0))), 1.0 / $M.numel(data)));

    setImmediate(function () {
      callback([loss]);
    });
  }

  backward(bottoms: $M.Matrix[], top_deltas: $M.Matrix[], config: ForwardConfiguration, callback: (bottom_deltas: $M.Matrix[]) => void): void {
    //top_deltas[0] is usually 1.0
    var data: $M.Matrix = bottoms[0];
    var gt: $M.Matrix = bottoms[1];
    var top_delta: $M.Matrix = top_deltas[0];//scalar

    var bottom_delta = $M.autodestruct(() => $M.times($M.minus(data, gt), $M.times(top_delta, 1.0 / $M.numel(data))));

    setImmediate(function () {
      callback([bottom_delta]);
    });
  }

  release(): void {

  }

  destruct(): void {

  }
}

export = LossLayer;
