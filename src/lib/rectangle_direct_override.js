import MapboxDraw from '@mapbox/mapbox-gl-draw'
import Constants from '@mapbox/mapbox-gl-draw/src/constants'
import constrainFeatureMovement from '@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement'

const DirectMode = MapboxDraw.modes.direct_select

/**
 *   0.0 ------- 0.1
 *    |           |
 *    |           |
 *    |           |
 *   0.3 ------- 0.2
 */

export default {
  ...DirectMode,
  onMidpoint(state, e) {
    if (!state.feature.properties.isRectangle) {
      DirectMode.onMidpoint.bind(this)(state, e)
    }
  },
  dragVertex(state, e, delta) {
    if (state.feature.properties.isRectangle) {
      const pointPath = state.selectedCoordPaths[0]
      const changePointsMapping = {
        '0.0': ['0.0', '0.1', '0.3'], // lat,lng | lat | lng
        '0.1': ['0.1', '0.0', '0.2'],
        '0.2': ['0.2', '0.3', '0.1'],
        '0.3': ['0.3', '0.2', '0.0'],
      }
      const paths = changePointsMapping[pointPath]
      const coordinate = paths.map(p => state.feature.getCoordinate(p))

      const selectedCoordPoints = [
        {
          type: Constants.geojsonTypes.FEATURE,
          properties: {},
          geometry: {
            type: Constants.geojsonTypes.POINT,
            coordinates: coordinate[0],
          },
        },
      ]

      const constrainedDelta = constrainFeatureMovement(
        selectedCoordPoints,
        delta,
      )
      for (let i = 0; i < paths.length; i++) {
        const coord = coordinate[i]
        switch (i) {
          case 0:
            state.feature.updateCoordinate(
              paths[i],
              coord[0] + constrainedDelta.lng,
              coord[1] + constrainedDelta.lat,
            )
            break
          case 1:
            state.feature.updateCoordinate(
              paths[i],
              coord[0],
              coord[1] + constrainedDelta.lat,
            )
            break
          case 2:
            state.feature.updateCoordinate(
              paths[i],
              coord[0] + constrainedDelta.lng,
              coord[1],
            )
            break
        }
      }
    } else {
      DirectMode.dragVertex.bind(this)(state, e, delta)
    }
  },
}
