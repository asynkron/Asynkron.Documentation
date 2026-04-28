import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

type Product = {
  name: string;
  label: string;
  description: string;
  href: string;
  logo: string;
  logoVariant?: 'screenshot';
  proof: string;
};

type Signal = {
  value: string;
  label: string;
};

const products: Product[] = [
  {
    name: 'Proto.Actor',
    label: 'Actor runtime',
    description:
      'A lightweight actor framework for .NET and Go with clustering, virtual actors, supervision, persistence, and message-driven concurrency.',
    href: '/docs/ProtoActor/',
    logo: '/img/protoactor-logo.png',
    proof: '.NET + Go',
  },
  {
    name: 'Durable Functions',
    label: 'Workflow engine',
    description:
      'Long-running, reliable workflows for .NET applications using durable orchestration patterns, hosting guidance, and operational playbooks.',
    href: '/docs/DurableFunctions/',
    logo: '/img/durable-functions-logo.svg',
    proof: 'Reliable automation',
  },
  {
    name: 'OcppServer',
    label: 'EV charging',
    description:
      'A next-generation OCPP platform for massive-scale charging networks, integration scenarios, and operational guidance.',
    href: '/docs/OcppServer/',
    logo: '/img/ocppserver-logo.svg',
    proof: 'Preview track',
  },
  {
    name: 'Faktorial',
    label: 'Autonomous delivery',
    description:
      'A GitHub-native delivery factory that moves scoped issues through investigation, build, verification, pull requests, and learning loops.',
    href: '/docs/Products/faktorial',
    logo: '/img/products/faktorial-home.png',
    logoVariant: 'screenshot',
    proof: 'Pilot + managed service',
  },
  {
    name: 'BokaBra',
    label: 'Booking product',
    description:
      'A commercial product with a public launching-soon page and contact path for early updates while the fuller product surface comes online.',
    href: '/docs/Products/bokabra',
    logo: '/img/products/bokabra-home.png',
    logoVariant: 'screenshot',
    proof: 'Launching soon',
  },
  {
    name: 'Inmem / Matcha',
    label: 'Reactive integration',
    description:
      'A self-hosted connector runtime for typed state, document triggers, durable propagation, and AI-assisted integration workflows.',
    href: '/docs/Products/inmem',
    logo: '/img/products/inmem-home.png',
    logoVariant: 'screenshot',
    proof: 'Reactive connectors',
  },
];

const signals: Signal[] = [
  {value: '10+ years', label: 'distributed-systems experience'},
  {value: '.NET + Go', label: 'runtime ecosystems covered'},
  {value: '6 product lines', label: 'documented from one control plane'},
];

const deliveryStages = [
  'Design resilient actors',
  'Orchestrate durable work',
  'Operate charging networks',
];

function ProductCard({product, index}: {product: Product; index: number}) {
  return (
    <Link className={styles.productCard} to={product.href}>
      <span className={styles.productNumber}>0{index + 1}</span>
      <div className={styles.productLogoFrame}>
        <img
          src={product.logo}
          alt=""
          className={
            product.logoVariant === 'screenshot'
              ? `${styles.productLogo} ${styles.productLogoScreenshot}`
              : styles.productLogo
          }
        />
      </div>
      <div className={styles.productBody}>
        <span className={styles.productLabel}>{product.label}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
      <span className={styles.productProof}>{product.proof}</span>
    </Link>
  );
}

function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Product documentation and operating guides for the Asynkron distributed-systems ecosystem.">
      <main className={styles.page}>
        <section className={styles.hero} id="top">
          <div className={styles.heroShell}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Asynkron Documentation</span>
              <h1>Build distributed systems with a sharper operating model.</h1>
              <p className={styles.heroLead}>
                Asynkron brings actor runtimes, durable workflows, and EV
                charging infrastructure together with autonomous delivery,
                booking, and reactive integration products
                into one documentation surface for teams shipping high-scale systems.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} to="/docs/intro">
                  Explore the docs
                </Link>
                <Link className={styles.secondaryAction} to="#products">
                  View products
                </Link>
              </div>
            </div>

            <aside className={styles.controlPanel} aria-label="Asynkron product map">
              <div className={styles.panelHeader}>
                <span>asynkron://docs/live</span>
                <span>6 products</span>
              </div>
              <div className={styles.panelGrid}>
                {products.map((product) => (
                  <Link key={product.name} className={styles.panelTile} to={product.href}>
                    <img src={product.logo} alt="" />
                    <span>{product.label}</span>
                    <strong>{product.name}</strong>
                  </Link>
                ))}
              </div>
              <div className={styles.pipeline}>
                {deliveryStages.map((stage, index) => (
                  <div key={stage} className={styles.pipelineStep}>
                    <span>0{index + 1}</span>
                    <strong>{stage}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.signalBand} aria-label="Asynkron proof points">
          <div className={styles.signalGrid}>
            {signals.map((signal) => (
              <div key={signal.label} className={styles.signal}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.systemSection}>
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>Control plane for builders</span>
            <h2>One product ecosystem. Clear paths from prototype to production.</h2>
          </div>
          <div className={styles.layerStack}>
            <div className={styles.layer}>
              <span>Layer 01 / Runtime</span>
              <strong>Proto.Actor</strong>
              <p>Actors, virtual actors, clustering, supervision, and local affinity.</p>
            </div>
            <div className={styles.layer}>
              <span>Layer 02 / Workflow</span>
              <strong>Durable Functions</strong>
              <p>Reliable orchestration, hosting, operations, and long-running automation.</p>
            </div>
            <div className={styles.layer}>
              <span>Layer 03 / Infrastructure</span>
              <strong>OcppServer</strong>
              <p>EV charging infrastructure, integration scenarios, and operational guidance.</p>
            </div>
            <div className={styles.layer}>
              <span>Layer 04 / Commercial products</span>
              <strong>Faktorial, BokaBra, Inmem / Matcha</strong>
              <p>Autonomous delivery, booking, and reactive integration products with public documentation entry points.</p>
            </div>
          </div>
        </section>

        <section className={styles.productsSection} id="products">
          <div className={styles.sectionIntro}>
            <span className={styles.kicker}>Product documentation</span>
            <h2>Start with the product you are shipping today.</h2>
          </div>
          <div className={styles.productGrid}>
            {products.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div>
            <span className={styles.kicker}>Built by Asynkron AB</span>
            <h2>Distributed-systems experience, packaged as practical guides.</h2>
          </div>
          <p>
            Use the docs to move from core concepts to production operations,
            then jump into the GitHub organization or Proto.Actor project when
            you need source, examples, and community context.
          </p>
          <div className={styles.ctaActions}>
            <Link className={styles.primaryAction} to="/docs/intro">
              Open overview
            </Link>
            <Link className={styles.secondaryAction} href="https://github.com/Asynkron">
              GitHub organization
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
