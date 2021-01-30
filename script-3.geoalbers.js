const margin = {t: 50, r:50, b: 50, l: 50};
const size = {w: 800, h: 800};
const svg = d3.select('svg');

svg.attr('width', size.w)
    .attr('height', size.h);

d3.json('data/maps/us-states.geo.json').then(function (mapData) {

    let mapSize = {
            w: size.w - margin.l - margin.r,
            h: size.h - margin.t - margin.b
        };
    let g = svg.append('g')
        .classed('map', true)
        .attr('transform', 'translate('+margin.l+','+margin.t+')');
    let pathSelection = drawMap(mapData, g, mapSize);
});


function drawMap (mapData, ele, size) {

    let projection = d3.geoAlbersUsa()
        .fitSize([size.w, size.h], mapData);

    let geoPath = d3.geoPath(projection);

    let pathSelection = ele.selectAll('path')
        .data(mapData.features)
        .enter()
        .append('path')
        .attr('id', (d) => d.properties.brk_a3)
        .attr('d', (d) => geoPath(d));
    
    return pathSelection;
}
