import React from 'react';
import Logo from '../Logo';

import styles from './index.module.scss';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <div className={styles.copyright}>
        © if you update the script, you need to {' '}
        <a
          href="http://30.208.45.10:9999/gitpull"
          target="_blank"
          className={styles.copyrightLink}
          rel="noopener noreferrer"
        >
          UPDATE
        </a>||
        <a
          href="http://30.208.45.10:9999/gitpush"
          target="_blank"
          className={styles.copyrightLink}
          rel="noopener noreferrer"
        >
          PUSH
        </a>
      </div>
    </div>
  );
}
