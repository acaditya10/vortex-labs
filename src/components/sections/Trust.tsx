import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Trust.module.css";

const CLIENT_WORK = ["UPMARK MEDIA", "WINIT MEDIA", "PRINCE ACHAR"];
const INDEPENDENT_PRODUCTS = ["DOCDECODER", "SUPPORTFLOW", "PROJECTHELPER"];

export function Trust() {
  return (
    <section className={styles.section}>
      <div className="shell">
        <SectionHeader
          eyebrow="BUILT IN THE REAL WORLD"
          title="From agencies to consumer brands."
        />

        <div className={styles.cols}>
          <Reveal variant="up" className={styles.col}>
            <h4 className={styles.colTitle}>CLIENT WORK</h4>
            <ul className={styles.brands}>
              {CLIENT_WORK.map((brand, i) => (
                <li key={brand} className={styles.brandRow}>
                  <span className={styles.brandNum}>0{i + 1}</span>
                  <span className={styles.brandName}>{brand}</span>
                  <span className={styles.brandArrow} aria-hidden="true">
                    ↗
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={120} className={styles.col}>
            <h4 className={styles.colTitle}>INDEPENDENT PRODUCTS</h4>
            <ul className={styles.products}>
              {INDEPENDENT_PRODUCTS.map((product) => (
                <li key={product} className={styles.productRow}>
                  <span className={styles.productDot} aria-hidden="true" />
                  <span className={styles.productName}>{product}</span>
                  <span className={styles.productTag}>PRODUCT</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
