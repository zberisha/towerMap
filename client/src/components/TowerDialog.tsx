import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useTranslation } from "react-i18next";
import type { Skyscraper } from "../types/skyscraper";
import { TowerScene } from "./TowerScene";
import styles from "./tower-dialog.module.css";

interface TowerDialogProps {
  tower: Skyscraper | null;
  maxHeightM: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TowerDialog({ tower, maxHeightM, open, onOpenChange }: TowerDialogProps) {
  const { t, i18n } = useTranslation();

  if (!tower) return null;

  const locale = i18n.language;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{tower.name}</Dialog.Title>
            <Dialog.Description className={styles.description}>
              {tower.city}, {tower.country}
            </Dialog.Description>
          </div>
          <ScrollArea.Root className={styles.scrollRoot} type="auto">
            <ScrollArea.Viewport className={styles.viewport}>
              <div className={styles.canvasWrap}>
                <TowerScene
                  name={tower.name}
                  heightM={tower.heightM}
                  maxHeightM={maxHeightM}
                  sceneAriaLabel={t("dialog.sceneAria", { name: tower.name })}
                />
              </div>
              <dl className={styles.dl}>
                <div>
                  <dt className={styles.dt}>{t("dialog.height")}</dt>
                  <dd className={styles.dd}>
                    {tower.heightM.toLocaleString(locale, { maximumFractionDigits: 1 })} m
                  </dd>
                </div>
                {tower.floors != null && (
                  <div>
                    <dt className={styles.dt}>{t("dialog.floors")}</dt>
                    <dd className={styles.dd}>{tower.floors}</dd>
                  </div>
                )}
                {tower.yearBuilt != null && (
                  <div>
                    <dt className={styles.dt}>{t("dialog.year")}</dt>
                    <dd className={styles.dd}>{tower.yearBuilt}</dd>
                  </div>
                )}
                {tower.architect != null && tower.architect !== "" && (
                  <div className={styles.span2}>
                    <dt className={styles.dt}>{t("dialog.architect")}</dt>
                    <dd className={styles.dd}>{tower.architect}</dd>
                  </div>
                )}
              </dl>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
              <ScrollArea.Thumb className={styles.thumb} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <Dialog.Close asChild>
            <button type="button" className={styles.closeBtn} aria-label={t("dialog.close")}>
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
