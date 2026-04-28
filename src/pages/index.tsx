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
    name: 'LiveView',
    label: 'Reactive UI',
    description:
      'Server-driven, real-time UI updates for interactive applications with a lightweight component model and production deployment path.',
    href: '/docs/LiveView/',
    logo: '/img/liveview-logo.svg',
    proof: 'AI Companion MCP',
  },
  {
    name: 'TraceLens',
    label: 'Observability',
    description:
      'OpenTelemetry UI and collector tooling for ingesting traces, visualizing actor flows, and troubleshooting distributed systems.',
    href: '/docs/TraceLens/',
    logo: '/img/tracelens-logo.png',
    proof: 'OTEL-native',
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
    name: 'Jsome',
    label: 'Schema tooling',
    description:
      'A .NET global tool that generates strongly typed clients, DTOs, validators, Protocol Buffers, and build assets from schemas.',
    href: '/docs/Jsome/',
    logo: '/img/jsome-logo.svg',
    proof: 'OpenAPI + JSON Schema',
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
  'Observe live systems',
  'Generate safe contracts',
];

function ProductCard({product, index}: {product: Product; index: number}) {
  return (
    <Link className={styles.productCard} to={product.href}>
      <span className={styles.productNumber}>0{index + 1}</span>
      <div className={styles.productLogoFrame}>
        <img src={product.logo} alt="" className={styles.productLogo} />
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
                Asynkron brings actor runtimes, durable workflows, reactive UI,
                observability, EV charging infrastructure, and schema tooling
                into one documentation surface for teams shipping high-scale
                systems.
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
                {products.slice(0, 4).map((product) => (
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
              <span>Layer 03 / Visibility</span>
              <strong>TraceLens</strong>
              <p>Trace search, timelines, logs, spans, and actor-flow troubleshooting.</p>
            </div>
            <div className={styles.layer}>
              <span>Layer 04 / Interfaces</span>
              <strong>LiveView, OcppServer, Jsome</strong>
              <p>Reactive UI, EV charging infrastructure, and generated contracts.</p>
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
