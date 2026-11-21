import { create } from "storybook/theming"

import theme from "@auradata/tokens/shadcn-theme.json"

/** Storybook in the brand: the docs pages and the manager (sidebar, toolbar). */
export const auradata = create({
  base: "light",
  brandTitle: "AuraData design",
  brandImage: "/brand/continua/horizontal-color.svg",
  brandUrl: "https://auradata.mx",
  brandTarget: "_blank",
  fontBase: theme.theme["font-sans"],
  fontCode: theme.theme["font-mono"],
  colorPrimary: theme.light.primary,
  colorSecondary: theme.light.primary,
  textColor: theme.light.foreground,
  textMutedColor: theme.light["muted-foreground"],
  appBg: theme.light.muted,
  appContentBg: theme.light.background,
  appBorderColor: theme.light.border,
  appBorderRadius: 8,
  barBg: theme.light.background,
})
