/* *
 * Orthographic projection
 * */

'use strict';
import type { LonLatArray, ProjectedXYArray } from '../MapViewOptions';
import type ProjectionDefinition from '../ProjectionDefinition';

const deg2rad = Math.PI / 180,
    scale = 63.78460826781007;

export default class Orthographic implements ProjectionDefinition {

    bounds = {
        x1: -scale,
        x2: scale,
        y1: -scale,
        y2: scale
    };

    forward(lonLat: LonLatArray): ProjectedXYArray {

        const lonDeg = lonLat[0],
            latDeg = lonLat[1];

        const lat = latDeg * deg2rad;
        const xy: ProjectedXYArray = [
            Math.cos(lat) * Math.sin(lonDeg * deg2rad) * scale,
            Math.sin(lat) * scale
        ];
        if (lonDeg < -90 || lonDeg > 90) {
            xy.outside = true;
        }
        return xy;
    }

    inverse(xy: ProjectedXYArray): LonLatArray {
        const x = xy[0] / scale,
            y = xy[1] / scale,
            z = Math.sqrt(x * x + y * y),
            c = Math.asin(z),
            cSin = Math.sin(c),
            cCos = Math.cos(c);

        return [
            Math.atan2(x * cSin, z * cCos) / deg2rad,
            Math.asin(z && y * cSin / z) / deg2rad
        ];
    }
}
