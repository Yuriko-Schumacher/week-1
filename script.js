const margin = { t: 50, r: 50, b: 50, l: 50 };
const size = { w: 800, h: 800 };
const svg = d3.select("svg");

svg.attr("width", size.w).attr("height", size.h);

Promise.all([
	// Promise.all JavaScript
	d3.json("data/maps/world.geo.json"),
	d3.json("data/life-expectancy.json"),
]).then(function (datasets) {
	console.log(datasets);
	const mapData = datasets[0];
	const lifeExpData = datasets[1];
	let mapG = svg.append("g").classed("map", true);
	drawMap(mapG, mapData, lifeExpData);
});

// d3.json("data/maps/world.geo.json").then(function (mapData) {
// 	let mapG = svg.append("g");
// 	drawMap(mapG, mapData);
// });

function drawMap(mapG, mapData, lifeExpData) {
	let projection = d3
		.geoMercator() // like a scale for a bar chart // domain is expected
		.fitSize([size.w, size.h], mapData); // range
	let path = d3.geoPath(projection);

	let pathSel = mapG
		.selectAll("path")
		.data(mapData.features)
		.enter()
		.append("path")
		.attr("id", function (d) {
			return d.properties.brk_a3;
		})
		.attr("d", function (d) {
			return path(d);
		});
	// M: move, L: from, L: to, Z: close

	let extent = d3.extent(lifeExpData, (d) => d.lifeExpectancy);

	let colorScale = d3
		.scaleSequential()
		.domain(extent)
		.interpolator(d3.interpolateYlGnBu);

	pathSel.style("fill", function (d) {
		// d...geographic data
		let countryCode = d.properties.brk_a3;
		let country = lifeExpData.filter(
			(el) => el.countryCode === countryCode
		);
		if (country.length > 0) {
			country = country[0];
			return colorScale(country.lifeExpectancy);
		}
		return "#aaa";
	}); // path doesn't take attribute "fill"
}
