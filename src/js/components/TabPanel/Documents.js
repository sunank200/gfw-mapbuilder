import Loader from 'components/Loader';
// import request from 'utils/request';
import text from 'js/languages';
import React, {
  Component,
  PropTypes
} from 'react';

//- TODO: If this is ever needed elsewhere, move to utils
// const getLayerId = (language) => {
//   switch (language) {
//     case 'en': return 0;
//     case 'fr': return 1;
//     case 'es': return 2;
//     case 'pt': return 3;
//     default: return 0;
//   }
// };

const documentsSvg = '<use xlink:href="#icon-documents" />';

const DocumentInstructions = ({language}) => {
  return (
    <div className='documents-instructions'>
      {text[language].DOCS_INSTRUCTIONS}
    </div>
  );
};

const DocumentsNotAvailable = ({language}) => {
  return (
    <div className='documents-unavailable'>
      {text[language].DOCS_NOT_AVAILABLE}
    </div>
  );
};

class DocumentResults extends Component {

  state = this.getDefaultState();

  componentDidMount () {
    const {selectedFeature} = this.props;
    const layer = selectedFeature._layer;
    const idfield = layer && layer.objectIdField;

    if (layer && layer.hasAttachments && layer.queryAttachmentInfos) {
      layer.queryAttachmentInfos(selectedFeature.attributes[idfield], (res) => {
        const documents = res.map((item) => ({
          name: item.name,
          type: item.contentType,
          author: 'N/A',
          year: 'N/A',
          url: item.url
        }));

        this.setState({ loading: false, documents });
      }, () => {
        this.setState({ loading: false, documents: [] });
      });
    } else {
      this.setState({ loading: false, documents: [] });
    }

    //- Use this URL in Equatorial Guinea for Testing
    // const url = 'http://gis.forest-atlas.org/arcgis/rest/services/GAB/documents_administratifs/MapServer';
    // request.queryTaskByGeometry(`${service}/${layerId}`, selectedFeature.geometry).then((results) => {
    //   let {features} = results;
    //   let docs = [], attributes;
    //   if (features) {
    //     features.forEach((feature) => {
    //       attributes = feature.attributes;
    //       if (attributes.url) {
    //         docs.push({
    //           name: attributes.doc_titre || attributes.url,
    //           type: attributes.desc_type || 'N/A',
    //           author: attributes.auteur || 'N/A',
    //           year: attributes.date_doc ? new Date(attributes.date_doc).getFullYear() : 'N/A',
    //           url: dir + encodeURIComponent(attributes.url)
    //         });
    //       }
    //     });
    //     //- Sort the documents by year
    //     docs.sort((a, b) => {
    //       if (a.year === 'N/A') { return 1; }
    //       if (a.year < b.year) { return 1; }
    //       if (a.year > b.year) { return -1; }
    //       return 0;
    //     });
    //   }
    //   //- Update the view
    //   this.setState({ loading: false, documents: docs });
    // }, () => {
    //   //- Set to no documents
    //   this.setState({ loading: false, documents: [] });
    // });
  }

  getDefaultState () {
    return {
      loading: true,
      documents: undefined
    };
  }

  renderDocuments (documents, language) {
    return (
      <table className='documents-table'>
        <thead>
          <th>{text[language].DOCS_TYPE}</th>
          <th>{text[language].DOCS_AUTHOR}</th>
          <th>{text[language].DOCS_YEAR}</th>
          <th>{text[language].DOCS_PDF}</th>
        </thead>
        <tbody>
          {documents.map((doc) => {
            return (
              <tr title={doc.name}>
                <td>{doc.type}</td>
                <td>{doc.author}</td>
                <td>{doc.year}</td>
                <td className='documents-table__link'>
                  <a href={doc.url} target='_blank'>
                    <svg className='svg-icon' dangerouslySetInnerHTML={{ __html: documentsSvg }}/>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render () {
    const {loading, documents} = this.state;
    const {language, selectedFeature} = this.props;
    let content;

    if (documents && documents.length) {
      content = this.renderDocuments(documents, language);
    } else {
      content = <DocumentsNotAvailable language={language} />;
    }

    return (
      <div className='documents-results'>
        <Loader active={loading} />
        <h3 className='documents-feature-title'>
          {selectedFeature.getTitle ? selectedFeature.getTitle() : 'N/A'}
        </h3>
        {content}
      </div>
    );
  }
}

export default class Documents extends Component {

  static contextTypes = {
    language: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired
  };

  render () {
    const {language, map} = this.context;
    const {active} = this.props;
    let content, selectedFeature;

    if (map.infoWindow && map.infoWindow.getSelectedFeature) {
      selectedFeature = map.infoWindow.getSelectedFeature();
    }

    if (selectedFeature && active) {
      content = <DocumentResults language={language} selectedFeature={selectedFeature} />;
    } else {
      content = <DocumentInstructions language={language} />;
    }

    return (
      <div className='documents-panel'>
        {content}
      </div>
    );
  }

}

Documents.propTypes = {
  active: PropTypes.bool.isRequired
};
