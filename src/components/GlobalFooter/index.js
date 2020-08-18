import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, links, copyright,logo }) => {
  const clsString = classNames(styles.globalFooter, className);
  links = null;
  return (
    <footer className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright}>{logo&& <img  className={styles.logo} src={logo} alt=""/>} {copyright}</div>}
    </footer>
  );
};

export default GlobalFooter;
