import {checkPointOnSegment} from "klinecharts/lib/mark/graphicHelper"

export const rect = {
  name: 'rect',
  totalStep: 3,
  checkMousePointOn: (key, type, points, mousePoint) => {
    return checkPointOnSegment(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (step, tpPoint, xyPoints) => {
    if (xyPoints.length === 2) {
      return [
        {
          type: 'line',
          isDraw: false,
          isCheck: true,
          dataSource: [
            [{...xyPoints[0]}, {x: xyPoints[1].x, y: xyPoints[0].y}],
            [{x: xyPoints[1].x, y: xyPoints[0].y}, {...xyPoints[1]}],
            [{...xyPoints[1]}, {x: xyPoints[0].x, y: xyPoints[1].y}],
            [{x: xyPoints[0].x, y: xyPoints[1].y}, {...xyPoints[0]}]
          ]
        },
        {
          type: 'polygon',
          isDraw: true,
          isCheck: false,
          style: 'fill',
          dataSource: [[
            {...xyPoints[0]},
            {x: xyPoints[1].x, y: xyPoints[0].y},
            {...xyPoints[1]},
            {x: xyPoints[0].x, y: xyPoints[1].y}
          ]]
        },
        {
          type: 'polygon',
          isDraw: true,
          isCheck: false,
          dataSource: [[
            {...xyPoints[0]},
            {x: xyPoints[1].x, y: xyPoints[0].y},
            {...xyPoints[1]},
            {x: xyPoints[0].x, y: xyPoints[1].y}
          ]]
        }
      ]
    }
    return []
  }
}
