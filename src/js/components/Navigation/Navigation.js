import LanguageToggle from 'components/Navigation/LanguageToggle';
import MapThemes from 'components/Navigation/MapThemes';
import text from 'js/languages';
import React, {
  Component,
  PropTypes
} from 'react';

const aboutSvg = '<use xlink:href="#icon-h-about" />';
const myGFWSvg = '<use xlink:href="#icon-h-mygfw" />';
const downloadSvg = '<use xlink:href="#icon-download" />';

export default class Navigation extends Component {

  static contextTypes = {
    language: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired
  };

  renderMapThemes = (language, settings) => {
    const shouldRender = settings.labels &&
                       settings.labels[language] &&
                       settings.labels[language].themes !== undefined;
    const target = settings.navLinksInNewTab ? '_blank' : '_self';

    return shouldRender ? <MapThemes themes={settings.labels[language].themes} target={target} /> : undefined;
  };

  render () {
    const {
      language,
      settings
    } = this.context;

    const LanguageComponent = settings.useAlternativeLanguage ? <LanguageToggle /> : undefined;
    const ThemeComponent = this.renderMapThemes(language, settings);
    const target = settings.navLinksInNewTab ? '_blank' : '_self';

    return (
      <nav className='app-header__nav'>
        <ul className='app-header__nav-list'>
          {ThemeComponent}
          {!settings.downloadLinkUrl ? null :
            <li className='app-header__nav-link pointer'>
              <a target={target} href={settings.downloadLinkUrl}>
                <svg className='svg-icon__nav' dangerouslySetInnerHTML={{ __html: downloadSvg }}/>
                {text[language].NAV_DOWNLOAD}
              </a>
            </li>
          }
          {!settings.aboutLinkUrl ? null :
            <li className='app-header__nav-link pointer'>
              <a target={target} href={settings.aboutLinkUrl}>
                <svg className='svg-icon__nav' dangerouslySetInnerHTML={{ __html: aboutSvg }}/>
                {text[language].NAV_ABOUT}
              </a>
            </li>
          }
          {!settings.includeMyGFWLogin ? null :
            <li className='app-header__nav-link pointer'>
              <a target={target}>
                <svg className='svg-icon__nav' dangerouslySetInnerHTML={{ __html: myGFWSvg }}/>
                {text[language].NAV_MY_GFW}
              </a>
            </li>
          }
          {LanguageComponent}
        </ul>
      </nav>
    );
  }
}
