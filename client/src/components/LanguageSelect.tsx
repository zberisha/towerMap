import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "../i18n/i18n";
import styles from "./language-select.module.css";

const OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ar", label: "العربية" },
];

function ChevronDownIcon() {
  return (
    <svg className={styles.chevronSvg} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.indicatorIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2214L3.70446 8.9214C3.44905 8.70724 3.43023 8.34301 3.64439 8.0876C3.85856 7.83219 4.22279 7.81337 4.4782 8.02753L6.59899 9.84598L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSelect() {
  const { i18n, t } = useTranslation();

  return (
    <Select.Root
      value={i18n.language}
      onValueChange={(v) => void i18n.changeLanguage(v as AppLanguage)}
    >
      <Select.Trigger className={styles.trigger} aria-label={t("lang.label")}>
        <Select.Value />
        <Select.Icon className={styles.icon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content} position="popper" sideOffset={8} align="end" collisionPadding={12}>
          <Select.Viewport className={styles.viewport}>
            {OPTIONS.map((o) => (
              <Select.Item key={o.value} value={o.value} className={styles.item}>
                <Select.ItemIndicator className={styles.indicator}>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
