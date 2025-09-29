import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  linkHref: string;
  image: string;
  imageAlt: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Actor Model',
    description: (
      <>
        The Actor Model offers a high-level abstraction for building concurrent
        and distributed systems. It removes the need for explicit locks and
        thread management, making it easier to write reliable parallel code.
      </>
    ),
    linkHref: '/docs/actors',
    image: require('@site/static/img/protoactor/actor-illustration.png').default,
    imageAlt: 'Actor model illustration',
  },
  {
    title: 'Grains / Virtual Actors',
    description: (
      <>
        Grains encapsulate state and behavior, letting you build interactive
        distributed applications without mastering complex patterns for
        concurrency, fault tolerance, or resource management.
      </>
    ),
    linkHref: '/docs/cluster',
    image: require('@site/static/img/protoactor/grains-illustration.png').default,
    imageAlt: 'Virtual actors in different servers',
  },
  {
    title: 'Stream Processing',
    description: (
      <>
        Proto.Actor optimizes for locality: grains automatically migrate toward
        the nodes that interact with them most, delivering in-process performance
        for real-time stream processing.
      </>
    ),
    linkHref: '/docs/local-affinity',
    image: require('@site/static/img/protoactor/stream-illustration.png').default,
    imageAlt: 'Actor migrating to where its messages arrive',
  },
  {
    title: 'Digital Twins',
    description: (
      <>
        A digital twin mirrors a physical object or process. With Proto.Actor&apos;s
        local-affinity strategy, twins stay close to their data and respond to
        events in real time.
      </>
    ),
    linkHref: '/docs/local-affinity',
    image: require('@site/static/img/protoactor/digitaltwins-illustration.png').default,
    imageAlt: 'Digital twins illustration',
  },
  {
    title: 'Metrics and Tracing',
    description: (
      <>
        Proto.Actor is instrumented end-to-end for observability, exposing
        runtime and performance metrics with ready-to-use dashboards for DataDog
        and Grafana.
      </>
    ),
    linkHref: '/docs/metrics',
    image: require('@site/static/img/protoactor/metrics-illustration.png').default,
    imageAlt: 'Metrics and tracing illustration',
  },
];

function Feature({title, description, linkHref, image, imageAlt}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <img src={image} alt={imageAlt} className={styles.featureImage} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link className={styles.readMore} to={linkHref}>
          Read More
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
