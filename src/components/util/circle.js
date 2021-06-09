export const circle = {
  name: 'circle',
  totalStep: 3,
  checkMousePointOn: (key, type, points, mousePoint) => {
    const xDis = Math.abs(points.x - mousePoint.x)
    const yDis = Math.abs(points.y - mousePoint.y)
    const r = Math.sqrt(xDis * xDis + yDis * yDis)
    return Math.abs(r - points.radius) < 3;
  },
  createGraphicDataSource: (step, tpPoint, xyPoints) => {
    if (xyPoints.length === 2) {
      const xDis = Math.abs(xyPoints[0].x - xyPoints[1].x)
      const yDis = Math.abs(xyPoints[0].y - xyPoints[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      return [
        {
          type: 'arc',
          isDraw: true,
          isCheck: false,
          style: 'fill',
          dataSource: [
            {...xyPoints[0], radius, startAngle: 0, endAngle: Math.PI * 2}
          ]
        },
        {
          type: 'arc',
          isDraw: true,
          isCheck: true,
          dataSource: [
            {...xyPoints[0], radius, startAngle: 0, endAngle: Math.PI * 2}
          ]
        }
      ];
    }
    return []
  }
}
