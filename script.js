const data = './boston_311.csv';

const width = 800;
const height = 600;
const margin = { top: 30, bottom: 30, left: 300, right: 30 };

const barsvg = d3
    .select('#bar-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

d3.csv(data).then((data) => {
    //Data
    const dataSorted = data.sort((a, b) =>
        d3.descending(Number(a.total_count), Number(b.total_count))
    );

    //Axis
    const xValues = dataSorted.map((d) => Number(d.total_count));
    const x = d3
        .scaleLinear()
        .domain([0, d3.max(xValues)])
        .range([0, width]);

    const yValues = dataSorted.map((d) => d.Name);
    const y = d3.scaleBand().domain(yValues).range([0, height]).padding(0.15);

    barsvg.append('g').call(d3.axisTop(x).ticks(6));
    barsvg.append('g').attr('id', 'yAxis').call(d3.axisLeft(y));

    //Tooltip
    const tooltip = d3.select('#tooltip');

    //Rect
    const mouseover = (event, d) => {
        tooltip
            .html(`<p>The exact value of ${d.Name} is: ${d.total_count}<p>`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 'px')
            .classed('hidden', false);
    };

    const mouseout = (event, d) => {
        tooltip.classed('hidden', true);
    };

    barsvg
        .selectAll('rect')
        .data(dataSorted)
        .enter()
        .append('rect')
        .attr('x', (d) => x(0))
        .attr('y', (d) => y(d.Name))
        .attr('width', (d) => x(d.total_count))
        .attr('height', y.bandwidth())
        .attr('fill', 'teal')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
});
