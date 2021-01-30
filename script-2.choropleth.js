const margin = {t: 50, r:50, b: 50, l: 50};
const size = {w: 800, h: 800};
const svg = d3.select('svg');

svg.attr('width', size.w)
    .attr('height', size.h);

const files = ['data/maps/world.geo.json', 'data/life-expectancy.json'];
const promises = [];
Promise.all([
    d3.json(files[0]),
    d3.json(files[1])
]).then(function (datasets) {
    let mapData = datasets[0],
        lifeExpData = datasets[1];

    let mapSize = {
            w: size.w - margin.l - margin.r,
            h: size.h - margin.t - margin.b
        };
    let g = svg.append('g')
        .classed('map', true)
        .attr('transform', 'translate('+margin.l+','+margin.t+')');
    let pathSelection = drawMap(mapData, g, mapSize);

    choroplethiseMap(pathSelection, lifeExpData);
});


function drawMap (mapData, ele, size) {

    let projection = d3.geoMercator()
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

function choroplethiseMap (pathSelection, data) {

    const colorScale = d3.scaleSequential()
        .domain(d3.extent(data, d => +d.lifeExpectancy))
        .interpolator(d3.interpolateYlGnBu);

    pathSelection.style('fill', function(d) {
        let country = data.filter(e => e.countryCode === d.properties.brk_a3);
        if (country.length > 0) {
            country = country[0];
            return colorScale(country.lifeExpectancy);
        }

        return '#aaaaaa';
    })
};