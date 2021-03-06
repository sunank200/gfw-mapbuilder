import React, {PropTypes, Component} from 'react';
import charts from 'utils/charts';
import text from 'js/languages';

const formatData = (counts, labels, colors) => {
  return labels.map((label, index) => {
    return {
      name: label,
      data: [counts[index]],
      color: colors[index]
    };
  }).filter((item) => {
    return item.data[0] && item.name !== 'No Data';
  });
};

export default class RestorationCharts extends Component {

  static contextTypes = {
    language: PropTypes.string.isRequired,
    settings: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { hasErrors: false };
  }

  componentDidMount() {
    const {slopeChart, landCoverChart, populationChart, treeCoverChart} = this.refs;
    const {results} = this.props;
    const {settings} = this.context;
    //- Format the data into series highcharts can easily consume
    const slopeData = formatData(results.slope, settings.slopeClasses, settings.slopeColors);
    const lcData = formatData(results.landCover, settings.landCoverClasses, settings.landCoverColors);
    const popData = formatData(results.population, settings.populationClasses, settings.populationColors);
    const tcData = formatData(results.treeCover, settings.treeCoverClasses, settings.treeCoverColors);
    //- Generate Charts if there is data
    if (slopeData.length && lcData.length && popData.length && tcData.length) {
      charts.makeRestorationBarChart(slopeChart, 'Slope', slopeData);
      charts.makeRestorationBarChart(landCoverChart, 'Land Cover', lcData);
      charts.makeRestorationBarChart(populationChart, 'Population Density', popData);
      charts.makeRestorationBarChart(treeCoverChart, '% Tree cover', tcData);
    } else {
      this.setState({ hasErrors: true });
    }
  }

  render () {
    const {language} = this.context;
    const {hasErrors} = this.state; // ANALYSIS_RESTORATION_ERROR

    return hasErrors ? <div className='restoration-error'>{text[language].ANALYSIS_RESTORATION_ERROR}</div> :
      (
        <div className='restoration-charts'>
          <div ref='slopeChart' className='analysis__chart-container' />
          <div ref='landCoverChart' className='analysis__chart-container' />
          <div ref='populationChart' className='analysis__chart-container' />
          <div ref='treeCoverChart' className='analysis__chart-container' />
        </div>
      );
  }
}

RestorationCharts.propTypes = {
  results: PropTypes.object.isRequried
};
